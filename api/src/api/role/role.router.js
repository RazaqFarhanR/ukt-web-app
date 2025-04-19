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
} = require('./role.controller');


const verifyRoles = require("../../middleware/verifyRoles")

router.get('/', Auth, verifyRoles("admin", "super admin", "admin ranting"), controllerGetAll )
router.post('/', Auth, verifyRoles("admin", "super admin", "admin ranting"), controllerAdd )
router.put('/:id', Auth, verifyRoles("admin", "super admin", "admin ranting"), controllerEdit )
router.delete('/:id', Auth, verifyRoles("admin", "super admin", "admin ranting"), controllerDelete )

module.exports = router;