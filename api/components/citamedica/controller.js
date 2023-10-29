const TABLA = 'citamedica'
const IDprincipal = 'CitaID'

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

    function getStandByAppointments(mascotaid) {
        return store.getStandByAppointments(TABLA, mascotaid, IDprincipal)
    }

    function getAcceptedAppointments(mascotaid) {
        return store.getAcceptedAppointments(TABLA, mascotaid, IDprincipal)
    }

    function getAcceptedDates(vetid) {
        return store.getAcceptedDates(TABLA, vetid, IDprincipal)
    }

    function getStandByDates(id) {
        return store.getStandByDates(TABLA, id, IDprincipal)
    }

    async function upsert(body) {
        const cita = {
            MascotaID: body.MascotaID,
            MedicoVeterinarioID: body.MedicoVeterinarioID,
            FechaCita: body.FechaCita,
            Aprobada: body.Aprobada,
            Estado: body.Estado
        }

        if (body.CitaID) {
            cita.CitaID = body.CitaID
        }

        return store.upsert(TABLA, cita, IDprincipal)
    }

    return {
        list,
        get,
        upsert,
        getStandByAppointments,
        getAcceptedAppointments,
        getAcceptedDates,
        getStandByDates
    }
}