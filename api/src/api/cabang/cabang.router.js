const express = require('express');
const bodyParser = require('body-parser');
const Auth = require('../../middleware/Auth');

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

const {
    controllerGetAll,
    controllerAdd,
    controllerEdit,
    controllerDelete,
} = require('./cabang.controller');


const verifyRoles = require("../../middleware/verifyRoles")

router.get('/', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerGetAll)
router.post('/',  controllerAdd)
router.put('/:id', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerEdit)
router.delete('/:id', Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), controllerDelete)

module.exports = router;