const TABLA = 'inventario'
const IDprincipal = 'ProductoID'

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
        const inventario = {
            Nombre: body.Nombre,
            Tipo: body.Tipo,
            Stock: body.Stock,
            Precio: body.Precio
        }

        if (body.ProductoID) {
            inventario.ProductoID = body.ProductoID
        }

        return store.upsert(TABLA, inventario, IDprincipal)
    }

    return {
        list,
        get,
        upsert
    }
}