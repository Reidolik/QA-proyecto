const TABLA = 'tratamiento'
const IDprincipal = 'TratamientoID'

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

    function getPetTreatments(petid) {
        return store.getPetTreatments(TABLA, petid, IDprincipal)
    }

    async function upsert(body) {
        const tratamiento = {
            MascotaID: body.MascotaID,
            Nombre: body.Nombre,
            FechaInicio: body.FechaInicio,
            FechaFin: body.FechaFin,
            Descripcion: body.Descripcion,
            Descuento: body.Descuento,
            PrecioInicial: body.PrecioInicial,
            PrecioFinal: body.PrecioFinal,
            CobroID: body.CobroID,
            MedicoID: body.MedicoID
        }

        if (body.TratamientoID) {
            tratamiento.TratamientoID = body.TratamientoID
        }

        return store.upsert(TABLA, tratamiento, IDprincipal)
    }

    return {
        list,
        get,
        getPetTreatments,
        upsert
    }
}