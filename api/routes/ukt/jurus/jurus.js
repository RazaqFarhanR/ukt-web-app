//import library
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const Auth = require('../../../middleware/Auth.js');
const verifyRoles = require("../../../middleware/verifyRoles.js");

//implementasi
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//import model
const models = require('../../../src/models/index');
const jurus = models.jurus;

//endpoint ditulis disini

//endpoint get data jurus
app.get("/", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    jurus.findAll()
    .then(jurus => {
        res.json({
            count: jurus.length,
            data: jurus
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})

//endpoint get data jurus by tipe_ukt
app.get("/ukt/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    jurus.findAll({
        where: {
            tipe_ukt: req.params.id
        },
        attributes: ['id_jurus','name']
    })
    .then(jurus => {
        res.json({
            count: jurus.length,
            tipe_ukt: req.params.id,
            data: jurus
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})

//endpoint untuk menyimpan data jurus, METHOD POST, function create
app.post("/", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) =>{
    let data ={        
        tipe_ukt: req.body.tipe_ukt,
        name: req.body.name
    }
    jurus.create(data)
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

//endpoint untuk mengupdate data jurus, METHOD: PUT, fuction: UPDATE
app.put("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    let param = {
        id_jurus : req.params.id
    }
    let data ={        
        tipe_ukt: req.body.tipe_ukt,
        name: req.body.name
    }
    jurus.update(data, {where: param})
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

//endpoint untuk menghapus data jurus,METHOD: DELETE, function: destroy
app.delete("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    let param = {
        id_jurus : req.params.id
    }
    jurus.destroy({where: param})
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