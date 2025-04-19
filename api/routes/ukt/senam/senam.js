//import library
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const Auth = require('../../../middleware/Auth.js');
const Sequelize = require('sequelize');
const { sequelize, Op } = require("sequelize");
const verifyRoles = require("../../../middleware/verifyRoles.js");

//implementasi
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//import model
const models = require('../../../src/models/index');
const senam = models.senam;

//endpoint ditulis disini

//endpoint get data senam
app.get("/", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    senam.findAll({
        attributes: ['tipe_ukt','id_senam','name'],
    })
    .then(senam => {
        res.json({
            count: senam.length,
            data: senam
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})

//endpoint get data senam by tipe_ukt
app.get("/ukt/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    let limitSenam = 0;
    if(req.params.id === "UKT Jambon"){
        limitSenam = 15
    } else if(req.params.id === "UKT Hijau"){
        limitSenam = 30;
    } else if(req.params.id === "UKT Putih"){
        limitSenam = 35;
    } else if(req.params.id === "UKCW"){
        limitSenam = 45
    }
    senam.findAll({
        where: {
            tipe_ukt: req.params.id
        },
        order: [
            Sequelize.fn('RAND')
        ],
        attributes: ['id_senam','name'],
        limit: limitSenam
    })
    .then(senam => {
        res.json({
            limit: limitSenam,
            tipe_ukt: req.params.id,
            data: senam
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})

//endpoint untuk menyimpan data senam, METHOD POST, function create
app.post("/", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) =>{
    let data ={
        tipe_ukt: req.body.tipe_ukt,
        name: req.body.name
    }
    senam.create(data)
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

//endpoint untuk mengupdate data senam, METHOD: PUT, fuction: UPDATE
app.put("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    let param = {
        id_senam : req.params.id
    }
    let data ={
        tipe_ukt: req.body.tipe_ukt,
        name: req.body.name
    }
    senam.update(data, {where: param})
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

//endpoint untuk menghapus data senam,METHOD: DELETE, function: destroy
app.delete("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    let param = {
        id_senam : req.params.id
    }
    senam.destroy({where: param})
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