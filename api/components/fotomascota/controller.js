const TABLA = 'foto'
const IDprincipal = 'FotoID'

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

    function getFotoByIDpet(idpet) {
        return store.getFotoByIDpet(TABLA, idpet, IDprincipal)
    }

    async function savePetFoto(body, file) {
        const foto = {
            MascotaID: body.MascotaID,
            DataFoto: file.filename,
            Nombre: file.originalname,
            Tipo: file.mimetype
        }

        return store.savePetFoto(TABLA, foto, IDprincipal, file)
    }

    async function upsert(body) {
        const foto = {
            MascotaID: body.MascotaID,
            DataFoto: body.DataFoto,
            Nombre: body.Nombre,
            Tipo: body.Tipo
        }

        if (body.FotoID) {
            foto.FotoID = body.FotoID
        }

        return store.upsert(TABLA, foto, IDprincipal)
    }

    return {
        list,
        get,
        upsert,
        savePetFoto,
        getFotoByIDpet
    }
}