const mysql = require('mysql')
const config = require('../config')
const fs = require('fs')
const path = require('path')

const dbconf = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
}

let connection

function handleConnection() {
    connection = mysql.createConnection(dbconf)

    connection.connect(err => {
        if (err) {
            console.error('[db error]', err)
            setTimeout(handleConnection, 200)
        } else {
            console.log('DB connected')
        }
    })

    connection.on('error', err => {
        console.error('[db error]', err)
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleConnection()
        } else {
            throw err
        }
    })
}

handleConnection()

function list(table) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table}`, (err, data) => {
            if (err) return reject(err)
            resolve(data);
        })
    })
}

function get(table, id, nameID) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table} WHERE ${nameID} = '${id}'`, (err, data) => {
            if (err) return reject(err)
            resolve(data)
        })
    })
}

function insert(table, data) {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO ${table} SET ?`, data, (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}

function update(table, data, IDprincipal) {
    let propNames = Object.getOwnPropertyNames(data);
    for (let i = 0; i < propNames.length; i++) {
        let propName = propNames[i];
        if (data[propName] === null || data[propName] === undefined) {
            delete data[propName];
        }
    }
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE ${table} SET ? WHERE ${IDprincipal}=?`, [data, data[IDprincipal]], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })
}

async function upsert(table, data, IDprincipal) {
    let row = -1
    if (data[IDprincipal]) {
        row = await get(table, data[IDprincipal], IDprincipal);
    }
    if (row.length === 0 || !data[IDprincipal]) {
        return insert(table, data);
    } else {
        return update(table, data, IDprincipal);
    }
}

function query(table, query) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT auth.*, usuario.Password, usuario.PerfilID, usuario.TipoUsuario FROM ${table} LEFT JOIN usuario ON usuario.UsuarioID = auth.id WHERE auth.?`, query, (err, res) => {
            if (err) return reject(err);
            resolve(res[0] || null);
        })
    })
}

// funciones especiales

// -- Mascotas
function getPetsWithFoto(table, id) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT
        mascota.*, foto.DataFoto, foto.Nombre as MascotaNombre
        FROM
        ${table}
        LEFT JOIN foto ON mascota.MascotaID = foto.MascotaID
        WHERE mascota.DuenioID = '${id}';`, (err, data) => {
            if (err) return reject(err)
            resolve(data)
        })
    })
}

function getPetsByOwner(table, ownerid) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table} WHERE DuenioID = '${ownerid}' ORDER BY MascotaID DESC LIMIT 1;`, (err, data) => {
            if (err) return reject(err)
            resolve(data)
        })
    })
}

// -- Foto mascota

function getFotoByIDpet(table, idpet) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT
        foto.DataFoto, foto.Nombre
        FROM
        ${table}
        WHERE MascotaID = '${idpet}';`, (err, data) => {
            if (err) return reject(err)
            resolve(data)
        })
    })
}

function savePetFoto(table, data, IDprincipal, file) {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO ${table} SET ?`, data, (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}

// -- Vacunas

function getPetsShots(table, mascotaid) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT
        VacunaID, Nombre as NombreVacuna, FechaAplicacion, Descripcion
        FROM
        ${table}
        WHERE MascotaID = '${mascotaid}';`, (err, data) => {
            if (err) return reject(err)
            resolve(data)
        })
    })
}

// -- Tratamientos

function getPetTreatments(table, petid) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT
        TratamientoID, MascotaID, Nombre as NombreTratamiento, FechaInicio, FechaFin, Descripcion, Descuento, PrecioInicial, PrecioFinal, CobroID
        FROM
        ${table}
        WHERE MascotaID = '${petid}';`, (err, data) => {
            if (err) return reject(err)
            resolve(data)
        })
    })
}

// -- Citas
function getStandByAppointments(table, mascotaid) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT CM.CitaID, CM.MascotaID, CM.MedicoVeterinarioID, CM.FechaCita, CM.Aprobada, CM.Estado, M.Nombre
        FROM 
        ${table} CM
        LEFT JOIN mascota M ON CM.MascotaID = M.MascotaID
        WHERE CM.MascotaID = ${mascotaid} AND CM.Aprobada = FALSE AND CM.Estado = 'Creada';`, (err, data) => {
            if (err) return reject(err)
            resolve(data)
        })
    })
}

function getAcceptedAppointments(table, mascotaid) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT CM.CitaID, CM.MascotaID, CM.MedicoVeterinarioID, CM.FechaCita, CM.Aprobada, CM.Estado, M.Nombre
        FROM 
        ${table} CM
        LEFT JOIN mascota M ON CM.MascotaID = M.MascotaID
        WHERE CM.MascotaID = ${mascotaid} AND CM.Aprobada = TRUE AND CM.Estado = 'Aprobada';`, (err, data) => {
            if (err) return reject(err)
            resolve(data)
        })
    })
}

// -- Citas admin

function getStandByDates(table, mascotaid) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT CM.*, M.MascotaID, M.Nombre as MascotaNombre, M.FechaNacimiento, M.Especie, M.Raza, M.Sexo, U.UsuarioID, U.Nombre as DuenioNombre, U.Telefono 
        FROM ${table} CM 
        LEFT JOIN mascota M ON CM.MascotaID = M.MascotaID 
        LEFT JOIN usuario U ON M.DuenioID = U.UsuarioID 
        WHERE CM.Aprobada = FALSE AND CM.Estado = 'Creada';`, (err, data) => {
            if (err) return reject(err)
            resolve(data)
        })
    })
}

function getAcceptedDates(table, vetid) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT CM.*, M.MascotaID, M.Nombre as MascotaNombre, M.FechaNacimiento, M.Especie, M.Raza, M.Sexo, U.UsuarioID, U.Nombre as DuenioNombre, U.Telefono 
        FROM ${table} CM 
        LEFT JOIN mascota M ON CM.MascotaID = M.MascotaID 
        LEFT JOIN usuario U ON M.DuenioID = U.UsuarioID 
        WHERE CM.Aprobada = TRUE AND CM.MedicoVeterinarioID = '${vetid}' AND CM.Estado = 'Aprobada';`, (err, data) => {
            if (err) return reject(err)
            resolve(data)
        })
    })
}

module.exports = {
    list,
    get,
    upsert,
    query,
    getPetsWithFoto,
    savePetFoto,
    getStandByAppointments,
    getAcceptedAppointments,
    getStandByDates,
    getAcceptedDates,
    getPetsShots,
    getPetTreatments,
    getFotoByIDpet,
    getPetsByOwner
}