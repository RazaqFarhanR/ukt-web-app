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

const Auth = require('./../../middleware/Auth.js');

const {
    controllerGetAll,
    controllerAdd,
    controllerAuth,
    controllerEdit,
    controllerDelete,
    controllerGetById,
    controllerNiw,
} = require('./user.controller');


const verifyRoles = require("../../middleware/verifyRoles")

router.get('/', Auth, verifyRoles("super admin", "admin"), controllerGetAll )
router.get('/:id', Auth, verifyRoles("super admin", "admin"), controllerGetById )
router.post('/', Auth, verifyRoles("super admin", "admin"), upload2.single("foto"), controllerAdd )
router.post('/niw', Auth, verifyRoles("admin", "super admin", "admin ranting"), controllerNiw )
router.put('/:id', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang"), upload2.single("foto"), controllerEdit )
router.delete('/:id', Auth, verifyRoles("admin", "super admin", "admin ranting"), controllerDelete )
router.post('/auth', controllerAuth )

module.exports = router;