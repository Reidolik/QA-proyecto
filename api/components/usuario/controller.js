const auth = require('../auth')
const { nanoid } = require('nanoid')
const bcrypt = require('bcrypt')

const TABLA = 'usuario'
const IDprincipal = 'UsuarioID'

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

    async function upsert(body) {
        let type = ''
        const usuario = {
            Nombre: body.Nombre,
            Telefono: body.Telefono,
            Email: body.Email,
            Sexo: body.Sexo,
            FechaNacimiento: body.FechaNacimiento,
            TipoUsuario: body.TipoUsuario,
            PerfilID: body.PerfilID,
            Estado: body.Estado
        }

        if (body.UsuarioID) {
            usuario.UsuarioID = body.UsuarioID
            type = 'Update'
        } else {
            usuario.UsuarioID = nanoid()
            usuario.Password = await bcrypt.hash(body.Password, 5)
            type = 'Creation'
        }

        if (body.Password) {
            let Password = ''
            if (type === 'Update') {
                Password = await bcrypt.hash(body.Password, 5)
                usuario.Password = Password
            }

            if (type === 'Creation') {
                Password = usuario.Password
            }
            await auth.upsert({
                id: usuario.UsuarioID,
                Email: usuario.Email,
                Password: Password
            })
        }

        return store.upsert(TABLA, usuario, IDprincipal)
    }

    return {
        list,
        get,
        upsert
    }
}