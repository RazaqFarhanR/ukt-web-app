const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const Auth = require('../../../../middleware/Auth');

const {
    controllerGetAll,
    controllerAdd,
    controllerEdit,
    controllerDelete,
    controllerGetByJenisLatihan,
    controllerGetByMft,
    controllerGetByPushUp,
    controllerGetBySpirPerutAtas,
    controllerGetBySpirPerutBawah,
    controllerGetBySpirDada,
    controllerGetByPlank,
    controllerGetByPesertaJenisLatihan,
    controllerEditMft,
    controllerEditPushUp,
    controllerEditSpirPerutAtas,
    controllerEditSpirPerutBawah,
    controllerEditSpirDada,
    controllerEditSpirPaha,
    controllerEditPlank,
} = require('./standar_fisik.controller');


const verifyRoles = require("../../../../middleware/verifyRoles")

router.get('/', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerGetAll)
router.post('/peserta', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerGetByPesertaJenisLatihan)
router.get('/jenis_latihan/:id', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerGetByJenisLatihan)
router.get('/jenis_latihan/mft/:id', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerGetByMft)
router.get('/jenis_latihan/push_up/:id', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerGetByPushUp)
router.get('/jenis_latihan/spir_perut_atas/:id', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerGetBySpirPerutAtas)
router.get('/jenis_latihan/spir_perut_bawah/:id', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerGetBySpirPerutBawah)
router.get('/jenis_latihan/spir_dada/:id', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerGetBySpirDada)
router.get('/jenis_latihan/plank/:id', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerGetByPlank)
router.post('/', Auth, verifyRoles("admin", "super admin", "admin cabang"), controllerAdd)
router.put('/:id', Auth, verifyRoles("admin", "super admin", "admin cabang"), controllerEdit)
router.put('/mft/:id', Auth, verifyRoles("admin", "super admin", "admin cabang"), controllerEditMft)
router.put('/push_up/:id', Auth, verifyRoles("admin", "super admin", "admin cabang"), controllerEditPushUp)
router.put('/spir_perut_atas/:id', Auth, verifyRoles("admin", "super admin", "admin cabang"), controllerEditSpirPerutAtas)
router.put('/spir_perut_bawah/:id', Auth, verifyRoles("admin", "super admin", "admin cabang"), controllerEditSpirPerutBawah)
router.put('/spir_dada/:id', Auth, verifyRoles("admin", "super admin", "admin cabang"), controllerEditSpirDada)
router.put('/spir_Paha/:id', Auth, verifyRoles("admin", "super admin", "admin cabang"), controllerEditSpirPaha)
router.put('/plank/:id', Auth, verifyRoles("admin", "super admin", "admin cabang"), controllerEditPlank)
router.delete('/:id', Auth, verifyRoles("admin", "super admin", "admin cabang"), controllerDelete)

module.exports = router;