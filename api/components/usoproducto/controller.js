const TABLA = 'usoproducto'
const IDprincipal = 'UsoID'

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
        const usoProducto = {
            TratamientoID: body.TratamientoID,
            ProductoID: body.ProductoID,
            Cantidad: body.Cantidad,
            CobroID: body.CobroID
        }

        if (body.UsoID) {
            usoProducto.UsoID = body.UsoID
        }

        return store.upsert(TABLA, usoProducto, IDprincipal)
    }

    return {
        list,
        get,
        upsert
    }
}