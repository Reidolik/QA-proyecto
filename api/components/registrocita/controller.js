const TABLA = 'registrocita'
const IDprincipal = 'RegistroID'

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
        const registroCita = {
            CitaID: body.CitaID,
            FechaAtencion: body.FechaAtencion,
            NotasConsulta: body.NotasConsulta,
            CostoConsulta: body.CostoConsulta
        }

        if (body.RegistroID) {
            cita.RegistroID = body.RegistroID
        }

        return store.upsert(TABLA, registroCita, IDprincipal)
    }

    return {
        list,
        get,
        upsert
    }
}