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
const jurus_siswa = models.jurus_siswa;

//endpoint ditulis disini

//endpoint get data jurus_siswa
app.get("/", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    jurus_siswa.findAll({
        include: [
            {
                model: models.jurus,
                as: "jurus",
                attributes: ['name']
            }
        ]
    })
    .then(jurus_siswa => {
        res.json({
            count: jurus_siswa.length,
            data: jurus_siswa
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
    jurus_siswa.findAll({
        attributes: ['id_jurus_siswa','id_jurus', 'predikat'],
        include: [
            {
                model: models.jurus,
                attributes: ['name'],
                as: "jurus",
                where: {
                    tipe_ukt: req.params.id
                },
                required: false
            }
        ]
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
//endpoint get data jurus by id siswa
app.get("/siswa/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    jurus_siswa.findAll({
        attributes: ['id_jurus_siswa','id_jurus', 'predikat'],
        where: {
            id_siswa: req.params.id
        },
        include: [
            {
                model: models.jurus,
                attributes: ['name', 'tipe_ukt'],
                as: "jurus",
                required: false
            }
        ]
    })
    .then(jurus => {
        console.log(jurus[0].predikat)
        const nilai = []
        for(let i=0; i < jurus.length; i++) {
            if(jurus[i].predikat == true){
              nilai.push('true');
            }
        }
        console.log(nilai.length);
        res.json({
            count: jurus.length,
            id_siswa: req.params.id,
            jurus_benar: nilai.length,
            data: jurus
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})
//endpoint untuk menyimpan data jurus_siswa, METHOD POST, function create
app.post("/", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) =>{
    let data ={
        id_jurus_detail: req.body.id_jurus_detail,
        id_jurus: req.body.id_jurus,
        predikat: req.body.predikat
    }
    jurus_siswa.create(data)
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

//endpoint untuk mengupdate data jurus_siswa, METHOD: PUT, fuction: UPDATE
app.put("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    let param = {
        id_jurus_siswa : req.params.id
    }
    let data ={
        id_jurus_detail: req.body.id_jurus_detail,
        id_jurus: req.body.id_jurus,
        predikat: req.body.predikat
    }
    jurus_siswa.update(data, {where: param})
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

//endpoint untuk menghapus data jurus_siswa,METHOD: DELETE, function: destroy
app.delete("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    let param = {
        id_jurus_siswa : req.params.id
    }
    jurus_siswa.destroy({where: param})
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