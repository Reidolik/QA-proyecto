const express = require('express')
const response = require('../../../network/response')
const controller = require('./index')
const router = express.Router()

//Lista de rutas
router.get('/', list)
router.get('/:id', get)
router.get('/petsfoto/:id', getPetsWithFoto)
router.get('/newpetinfo/:ownerid', getPetsByOwner)
router.post('/', upsert)

function list(req, res, next) {
    controller.list()
        .then(lista => {
            response.success(req, res, lista, 200)
        })
        .catch(next);
}

function get(req, res, next) {
    controller.get(req.params.id)
        .then(user => {
            response.success(req, res, user, 200)
        })
        .catch(next)
}

function getPetsWithFoto(req, res, next) {
    controller.getPetsWithFoto(req.params.id)
        .then(user => {
            response.success(req, res, user, 200)
        })
        .catch(next)
}

function getPetsByOwner(req, res, next) {
    controller.getPetsByOwner(req.params.ownerid)
        .then(user => {
            response.success(req, res, user, 200)
        })
        .catch(next)
}

function upsert(req, res, next) {
    controller.upsert(req.body)
        .then(user => {
            response.success(req, res, user, 200)
        })
        .catch(next)
}

module.exports = router