const auth = require('../auth')
const { nanoid } = require('nanoid')
const bcrypt = require('bcrypt')

const TABLA = 'Colaborador'
const IDprincipal = 'id'

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

    async function changeOther(body) {
        let type = ''
        const user = {
            emailPersonal: body.emailPersonal,
            contrasenaUsuario: body.contrasenaUsuario,
        }

        if (body.id) {
            user.id = body.id
            type = 'Update'
        }

        if (body.contrasenaUsuario) {
            let contrasenaUsuario = ''
            if (type === 'Update') {
                contrasenaUsuario = await bcrypt.hash(body.contrasenaUsuario, 5)
                user.contrasenaUsuario = contrasenaUsuario
            }
            await auth.upsert({
                id: user.id,
                emailPersonal: user.emailPersonal,
                contrasenaUsuario: contrasenaUsuario
            })
        }

        return store.upsert(TABLA, user, IDprincipal)
    }

    async function upsert(body) {
        let type = ''
        const user = {
            primerNombre: body.primerNombre,
            segundoNombre: body.segundoNombre,
            otrosNombres: body.otrosNombres,
            primerApellido: body.primerApellido,
            segundoApellido: body.segundoApellido,
            apellidoCasada: body.apellidoCasada,
            cui: body.cui,
            nit: body.nit,
            empresa: body.empresa,
            telefonoCasa: body.telefonoCasa,
            telefonoCelular: body.telefonoCelular,
            emailPersonal: body.emailPersonal,
            contrasenaUsuario: body.contrasenaUsuario,
            perfilUsuario: body.perfilUsuario,
            fechaIngreso: body.fechaIngreso,
            fechaCaducidad: body.fechaCaducidad,
            estado: body.estado
        }

        if (body.id) {
            user.id = body.id
            type = 'Update'
        } else {
            user.id = nanoid()
            user.contrasenaUsuario = await bcrypt.hash(body.contrasenaUsuario, 5)
            type = 'Creation'
        }

        if (body.contrasenaUsuario) {
            let contrasenaUsuario = ''
            if (type === 'Update') {
                contrasenaUsuario = await bcrypt.hash(body.contrasenaUsuario, 5)
                user.contrasenaUsuario = contrasenaUsuario
            }

            if (type === 'Creation') {
                contrasenaUsuario = user.contrasenaUsuario
            }
            await auth.upsert({
                id: user.id,
                emailPersonal: user.emailPersonal,
                contrasenaUsuario: contrasenaUsuario
            })
        }

        return store.upsert(TABLA, user)
    }

    return {
        list,
        get,
        upsert,
        changeOther
    }
}