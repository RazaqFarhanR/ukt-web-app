const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const Auth = require('../../middleware/Auth');

const {
    controllerGetAll,
    controllerAdd,
    controllerEdit,
    controllerDelete,
    controllerGetByEvent,
    controllerTimer,
    controllerGetById,
    controllerStart,
    controllerFinish,
    controllerGetTotalPage,
    controllerCekKeSHan,
    controllerCekUjain,
    controllerGetSoal,
    controllerKoreksi
} = require('./session.controller');


const verifyRoles = require("../../middleware/verifyRoles")

router.get('/', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerGetAll )
router.get('/pages/:id/:limit', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerGetTotalPage )
router.get('/ukt/:id/:page/:limit', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerGetByEvent )
router.post('/cek_ukt/:id', controllerCekKeSHan)
router.post('/getdata', controllerCekUjain)
router.post('/getsoal/:page', controllerGetSoal)
router.post('/koreksi', controllerKoreksi)
router.post('/', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting", "siswa"), controllerAdd )
router.post('/getid', Auth, verifyRoles("siswa"), controllerGetById )
router.post('/timer', Auth, verifyRoles("siswa"), controllerTimer )
router.post('/start/', Auth, verifyRoles("siswa"), controllerStart )
router.put('/finish/', Auth, verifyRoles("siswa"), controllerFinish )
router.put('/:id', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerEdit )
router.delete('/:id', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerDelete )

module.exports = router;