//import library
const express = require('express');
const bodyParser = require('body-parser');
const { randomUUID } = require('crypto');
require('dotenv').config();
const Sequelize = require('sequelize');
const { sequelize, Op } = require("sequelize");
const Auth = require('../middleware/Auth.js');
const verifyRoles = require("../middleware/verifyRoles");

//implementasi
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//import model
const models = require('../src/models/index');
const lembar_soal = models.lembar_soal;
const ranting = models.ranting

//endpoint ditulis disini

//endpoint get data lembar_soal
app.get("/", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    lembar_soal.findAll({
        include: [
            {
                model: ranting,
                as: "lembar_ranting",
                attributes: ['name'],
                required: false
            }
        ]
    })
    .then(lembar_soal => {
        res.json({
            count: lembar_soal.length,
            data: lembar_soal
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})

//get soal untuk ujian siswa
app.post("/ukt/:ukt", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting", "siswa"), (req,res) => {
    let param = {
        tipe_ukt: req.params.ukt,
    }

    if(req.body.id_ranting){
        param.id_ranting= req.body.id_ranting
    }

    lembar_soal.findOne({
        where: param,
        include: [
            {
                model: ranting,
                as: "lembar_ranting",
                attributes: ['name'],
                required: false
            },
            {
                model: models.soal,
                as: "lembar_soal_ujian",
                order: [
                    Sequelize.fn('RAND')
                ],
                limit: 20
            }
        ]
    })
    .then(lembar_soal => {
        res.json({
            count: lembar_soal.length,
            data: lembar_soal
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})

//endpoint untuk menyimpan data lembar_soal, METHOD POST, function create
app.post("/", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) =>{
    const id = randomUUID();
    let data ={
        id_lembar_soal: id,
        id_ranting: req.body.id_ranting,
        tipe_ukt: req.body.tipe_ukt,
        waktu_pengerjaan: req.body.waktu_pengerjaan
    }
    lembar_soal.create(data)
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

//endpoint untuk mengupdate data lembar_soal, METHOD: PUT, fuction: UPDATE
app.put("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    let param = {
        id_lembar_soal : req.params.id
    }
    let data = {
        id_ranting: req.body.id_ranting,
        tipe_soal: req.body.tipe_soal,
        waktu_pengerjaan: req.body.waktu_pengerjaan
    }
    lembar_soal.update(data, {where: param})
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

//endpoint untuk menghapus data lembar_soal,METHOD: DELETE, function: destroy
app.delete("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    let param = {
        id_lembar_soal : req.params.id
    }
    lembar_soal.destroy({where: param})
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