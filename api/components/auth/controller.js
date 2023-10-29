const bcrypt = require('bcrypt')
const auth = require('../../../auth')
const TABLA = 'auth'

module.exports = function (injectedStore) {
    let store = injectedStore
    if (!store) {
        store = require('../../../store/dummy')
    }

    async function login(Email, Password) {
        const data = await store.query(TABLA, { Email: Email })
        return bcrypt.compare(Password, data.Password)
            .then(sonIguales => {
                if (sonIguales === true) {
                    //generar token
                    return auth.sign({ ...data })
                } else {
                    throw new Error('Información invalida')
                }
            })
    }

    async function upsert(data) {
        const authData = {
            id: data.id
        }

        if (data.Email) {
            authData.Email = data.Email
        }

        if (data.Password) {
            authData.Password = data.Password
        }

        return store.upsert(TABLA, authData)
    }

    return {
        login,
        upsert,
    }
}