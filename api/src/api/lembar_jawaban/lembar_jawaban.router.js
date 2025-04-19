const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const Auth = require('../../middleware/Auth');

const {
    controllerGetByIdSession,
    controllerAdd,
    controllerEdit,
    controllerDeleteByIdSession,
    controllerCheckAnswer,
} = require('./lembar_jawaban.controller');


const verifyRoles = require("../../middleware/verifyRoles")

router.get('/session/:id', Auth, verifyRoles('siswa'), controllerGetByIdSession)
router.post('/ceksoal', Auth, verifyRoles('siswa'), controllerCheckAnswer)
router.post('/', Auth, verifyRoles('siswa'), controllerAdd)
router.put('/', Auth, verifyRoles('siswa'), controllerEdit)
router.delete('/session/:id', Auth, verifyRoles('siswa'), controllerDeleteByIdSession)

module.exports = router;