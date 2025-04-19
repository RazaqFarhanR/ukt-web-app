//import library
const express = require('express');
const bodyParser = require('body-parser');
const { randomUUID } = require('crypto');
require('dotenv').config();
const Auth = require('../middleware/Auth.js');
const verifyRoles = require("../middleware/verifyRoles");

//implementasi
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//import model
const models = require('../src/models/index');
const kunci_soal = models.kunci_soal;

//endpoint ditulis disini

//endpoint get data kunci_soal
app.get("/", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    kunci_soal.findAll()
    .then(kunci_soal => {
        res.json({
            count: kunci_soal.length,
            data: kunci_soal
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})

//endpoint untuk menyimpan data kunci_soal, METHOD POST, function create
app.post("/", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) =>{
    const id = randomUUID();
    let data ={
        id_kunci_soal: id,
        id_soal: req.body.id_soal,
        opsi: req.body.opsi
    }
    kunci_soal.create(data)
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
//endpoint untuk menyimpan untuk membandingkan soal mengambalikan true jika benar, METHOD POST, function create
app.post("/score", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting", "siswa"), (req,res) =>{
    const id = randomUUID();
    let data ={
        id_soal: req.body.id_soal,
        opsi: req.body.opsi
    }
    kunci_soal.findAll({
        where: {
            id_soal: req.body.id_soal,
        }
    })
    .then(result => {
        console.log(result[0].opsi)
        if(result[0].opsi === req.body.opsi){
            res.json({
                message: "jawaban benar",
                jawaban: true
            })
        } else if (result[0].opsi !== req.body.opsi){
            res.json({
                message: "jawaban salah",
                jawaban: false
            })
        }
        
    })
    .catch(error =>{
        res.json({
            message: error.message
        })
    })
}) 

//endpoint untuk mengupdate data kunci_soal, METHOD: PUT, fuction: UPDATE
app.put("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    let param = {
        id_kunci_soal : req.params.id
    }
    let data = {
        id_soal: req.body.id_soal,
        opsi: req.body.opsi
    }
    kunci_soal.update(data, {where: param})
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

//endpoint untuk menghapus data kunci_soal,METHOD: DELETE, function: destroy
app.delete("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    let param = {
        id_kunci_soal : req.params.id
    }
    kunci_soal.destroy({where: param})
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