//import library
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const Auth = require('../middleware/Auth.js');
const verifyRoles = require("../middleware/verifyRoles")
//implementasi
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//import model
const models = require('../src/models/index');
const event = models.event;

//endpoint ditulis disini

//endpoint get data event
app.get("/", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    event.findAll()
    .then(event => {
        res.json({
            count: event.length,
            data: event
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})
//endpoint get data event by ukt
app.get("/ukt/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    event.findAll({
        where: {
            tipe_ukt: req.params.id
        }
    })
    .then(event => {
        res.json({
            count: event.length,
            data: event
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})

//endpoint untuk menyimpan data event, METHOD POST, function create
app.post("/", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) =>{
    let data ={
        name: req.body.name,
        tanggal: req.body.tanggal,
        tipe_ukt: req.body.tipe_ukt
    }
    event.create(data)
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

//endpoint untuk mengupdate data event, METHOD: PUT, fuction: UPDATE
app.put("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    let param = {
        id_event : req.params.id
    }
    let data ={
        name: req.body.name,
        tanggal: req.body.tanggal,
        tipe_ukt: req.body.tipe_ukt
    }
    event.update(data, {where: param})
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

//endpoint untuk menghapus data event,METHOD: DELETE, function: destroy
app.delete("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    let param = {
        id_event : req.params.id
    }
    event.destroy({where: param})
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