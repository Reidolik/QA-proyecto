const TABLA = 'vacuna'
const IDprincipal = 'VacunaID'

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
    
    function getPetsShots(mascotaid) {
        return store.getPetsShots(TABLA, mascotaid)
    }

    async function upsert(body) {
        const usoProducto = {
            MascotaID: body.MascotaID,
            Nombre: body.Nombre,
            FechaAplicacion: body.FechaAplicacion,
            Descripcion: body.Descripcion,
            Descuento: body.Descuento,
            PrecioInicial: body.PrecioInicial,
            PrecioFinal: body.PrecioFinal,
            CobroID: body.CobroID
        }

        if (body.VacunaID) {
            usoProducto.VacunaID = body.VacunaID
        }

        return store.upsert(TABLA, usoProducto, IDprincipal)
    }

    return {
        list,
        get,
        upsert,
        getPetsShots
    }
}