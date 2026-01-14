const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

const path = require('path');
const multer = require("multer");
const localStorage = process.env.LOCAL_STORAGE
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // set file storage
      cb(null, localStorage);
  },
  filename: (req, file, cb) => {
      // generate file name
      cb(null, "foto-" + Date.now() + path.extname(file.originalname));
  },
  });

let upload2 = multer({ storage: storage });

const Auth = require('../../middleware/Auth');

const {
    controllerGetAll,
    controllerGetByRanting,
    controllerGetCountPenguji,
    controllerAdd,
    controllerCsv,
    controllerEdit,
    controllerDelete,
    controllerGetById,
    controllerGetByNIW,
    controllerGetByNameAndRanting,
    controllerGetRantingFiltered,
    controllerAuth,
    controllerDisabledById,
} = require('./penguji.controller');


const verifyRoles = require("../../middleware/verifyRoles")

router.get('/', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerGetAll )
router.get('/:id', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerGetById )
router.patch('/non_aktifkan', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerDisabledById)
router.get('/count/penguji', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerGetCountPenguji)
router.post('/pengujiperranting', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerGetByRanting )
router.get('/name_dan_ranting', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerGetByNameAndRanting )
router.post('/ranting', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerGetRantingFiltered )
router.post('/NIW/:id', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerGetByNIW )
router.post('/', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), upload2.single("foto"), controllerAdd )
router.post('/auth', controllerAuth )

router.post('/csv', upload2.single("csvFile"), controllerCsv )
router.put('/:id', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), upload2.single("foto"), controllerEdit )
router.delete('/:id', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerDelete )

module.exports = router;