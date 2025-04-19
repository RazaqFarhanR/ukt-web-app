//import library
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const Auth = require('../middleware/Auth.js');
const verifyRoles = require("../middleware/verifyRoles");

//implementasi
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//import model
const models = require('../src/models/index');
const role = models.role;

//endpoint ditulis disini

//endpoint get data kamar
app.get("/", Auth, verifyRoles("admin", "super admin", "admin ranting"), (req,res) => {
    role.findAll()
    .then(role => {
        res.json({
            count: role.length,
            data: role
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})

//endpoint untuk menyimpan data kamar, METHOD POST, function create
app.post("/", Auth, verifyRoles("admin", "super admin", "admin ranting"), (req,res) =>{
    let data ={
        id_role: req.body.id_role,
        role: req.body.id_role,
    }
    role.create(data)
    .then(result => {
        res.json({
            message: "data has been inserted"
        })
    })
    .catch(error =>{
        res.json({
            message: error.message
        })
    })
}) 

//endpoint untuk mengupdate data kamar, METHOD: PUT, fuction: UPDATE
app.put("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting"), (req,res) => {
    let param = {
        id_role : req.params.id
    }
    role.update(param, {where: param})
    .then(result => {
        res.json({
            message : "data has been updated"
        })
    })
    .catch(error => {
        res.json({
            message  : error.message
        })
    })
})

//endpoint untuk menghapus data kamar,METHOD: DELETE, function: destroy
app.delete("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting"), (req,res) => {
    let param = {
        id_role : req.params.id
    }
    role.destroy({where: param})
    .then(result => {
        res.json({
            massege : "data has been deleted"
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})


module.exports = app;