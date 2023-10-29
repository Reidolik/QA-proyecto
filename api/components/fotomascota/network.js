const express = require('express')
const response = require('../../../network/response')
const controller = require('./index')
const router = express.Router()
const path = require('path')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../../../images'),
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + '_foto_' + file.originalname)
    }
})

const upload = multer({
    storage: storage
}).single('image')

//Lista de rutas
router.get('/', list)
router.get('/:id', get)
router.get('/bypet/:idpet', getFotoByIDpet)
router.post('/', upsert)
router.post('/savefoto', upload, savePetFoto)

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

function getFotoByIDpet(req, res, next) {
    controller.get(req.params.idpet)
        .then(user => {
            response.success(req, res, user, 200)
        })
        .catch(next)
}

function savePetFoto(req, res, next) {
    controller.savePetFoto(req.body, req.file)
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