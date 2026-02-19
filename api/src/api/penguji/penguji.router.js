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
    controllerDownloadTemplateExcel,
    controllerExcel,
    controllerEditVerificaiton,
    controllerDownloadTemplateExcelRanting,
    controllerExcelRanting,
    controllerGetByUsername,
    controllerAddSignUp,
    controllerCheckVerificationById,
    controllerGetCountPengujiRole,
    controllerEditUploadProfilePicture,
} = require('./penguji.controller');


const verifyRoles = require("../../middleware/verifyRoles")

router.get('/', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerGetAll )
router.get('/:id', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerGetById )
router.get('/cek_username/:username', controllerGetByUsername )
router.get('/cek_verification/:id', controllerCheckVerificationById )
router.patch('/non_aktifkan', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "ranting", "penguji cabang", "penguji ranting"), controllerDisabledById)
router.get('/count/penguji', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerGetCountPenguji)
router.get('/count/penguji/role', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang"), controllerGetCountPengujiRole)
router.get('/download/template', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerDownloadTemplateExcel)
router.get('/download/template_ranting', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerDownloadTemplateExcelRanting)
router.post('/pengujiperranting', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerGetByRanting )
router.get('/name_dan_ranting', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerGetByNameAndRanting )
router.post('/ranting', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerGetRantingFiltered )
router.post('/NIW/:id', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerGetByNIW )
router.post('/', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), upload2.single("foto"), controllerAdd )
router.post('/daftar', controllerAddSignUp )
router.post('/auth', controllerAuth )

router.post('/csv', upload2.single("csvFile"), controllerCsv )
router.post('/excel', upload2.single("excelFile"), controllerExcel )
router.post('/excel_ranting', upload2.single("excelFile"), controllerExcelRanting )
router.put('/:id', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), upload2.single("foto"), controllerEdit )
router.patch('/profile_picture/:id', upload2.single("foto"), controllerEditUploadProfilePicture )
router.patch('/verification/:id', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerEditVerificaiton )
router.delete('/:id', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerDelete )

module.exports = router;