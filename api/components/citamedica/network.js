const express = require('express')
const response = require('../../../network/response')
const controller = require('./index')
const router = express.Router()

//Lista de rutas
router.get('/', list)
router.get('/:id', get)
router.get('/standby/:mascotaid', getStandByAppointments)
router.get('/accepted/:mascotaid', getAcceptedAppointments)
router.get('/datestandby/:id', getStandByDates)
router.get('/dateaccepted/:vetid', getAcceptedDates)
router.get('/:id', get)
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

function getStandByAppointments(req, res, next) {
    controller.getStandByAppointments(req.params.mascotaid)
        .then(user => {
            response.success(req, res, user, 200)
        })
        .catch(next)
}

function getAcceptedAppointments(req, res, next) {
    controller.getAcceptedAppointments(req.params.mascotaid)
        .then(user => {
            response.success(req, res, user, 200)
        })
        .catch(next)
}

function getStandByDates(req, res, next) {
    controller.getStandByDates(req.params.id)
        .then(user => {
            response.success(req, res, user, 200)
        })
        .catch(next)
}

function getAcceptedDates(req, res, next) {
    controller.getAcceptedDates(req.params.vetid)
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