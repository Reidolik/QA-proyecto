const TABLA = 'mascota'
const IDprincipal = 'MascotaID'

module.exports = function (injectedStore) {
    let store = injectedStore
    if (!store) {
        store = require('../../../store/mysql')
    }

    function list() {
        return store.list(TABLA)
    }

    function get(id) {
        return store.get(TABLA, id, IDprincipal)
    }

    function getPetsWithFoto(id) {
        return store.getPetsWithFoto(TABLA, id)
    }

    function getPetsByOwner(ownerid) {
        return store.getPetsByOwner(TABLA, ownerid)
    }

    async function upsert(body) {
        const mascota = {
            Nombre: body.Nombre,
            FechaNacimiento: body.FechaNacimiento,
            Especie: body.Especie,
            Raza: body.Raza,
            Sexo: body.Sexo,
            DuenioID: body.DuenioID
        }

        if (body.MascotaID) {
            mascota.MascotaID = body.MascotaID
        }

        return store.upsert(TABLA, mascota, IDprincipal)
    }

    return {
        list,
        get,
        upsert,
        getPetsWithFoto,
        getPetsByOwner
    }
}