//import library
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const Auth = require('../../../middleware/Auth');
const verifyRoles = require("../../../middleware/verifyRoles.js");

//implementasi
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//import model
const models = require('../../../src/models/index');
const fisik = models.fisik;

//endpoint ditulis disini

//endpoint get data fisik
app.get("/", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    fisik.findAll({
        include: [
            {
                model: models.siswa,
                as: "siswa_fisik",
                attributes: ['name']
            },
            {
                model: models.penguji,
                as: "penguji_fisik",
                attributes: ['name']
            }
        ]
    })
    .then(fisik => {
        res.json({
            count: fisik.length,
            data: fisik
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})
//endpoint get data fisik
app.get("/ukt/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    fisik.findAll({
        where: {
            tipe_ukt: req.params.id
        },
        include: [
            {
                model: models.siswa,
                as: "siswa_fisik",
                attributes: ['name']
            },
            {
                model: models.penguji,
                as: "penguji_fisik",
                attributes: ['name']
            }
        ]
    })
    .then(fisik => {
        res.json({
            count: fisik.length,
            data: fisik
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})
//endpoint get data fisik
app.get("/ukt/:id/:event", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    fisik.findAll({
        where: {
            tipe_ukt: req.params.id,
            id_event: req.params.event
        },
        include: [
            {
                model: models.siswa,
                as: "siswa_fisik",
                attributes: ['name', 'nomor_urut']
            },
            {
                model: models.penguji,
                as: "penguji_fisik",
                attributes: ['name']
            }
        ]
    })
    .then(fisik => {
        res.json({
            count: fisik.length,
            data: fisik
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})

//endpoint untuk menyimpan data fisik, METHOD POST, function create
app.post("/", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) =>{
    let data ={
        id_penguji: req.body.id_penguji,
        id_event: req.body.id_event,
        id_siswa: req.body.id_siswa,
        tipe_ukt: req.body.tipe_ukt,
        mft: req.body.mft,
        push_up: req.body.push_up,
        spir_perut_atas: req.body.spir_perut_atas,
        spir_perut_bawah: req.body.spir_perut_bawah,
        spir_dada: req.body.spir_dada,
        plank: req.body.plank,
    }
    fisik.create(data)
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

//endpoint untuk mengupdate data fisik, METHOD: PUT, fuction: UPDATE
app.put("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    let param = {
        id_fisik : req.params.id
    }
    let data ={
        id_penguji: req.body.id_penguji,
        id_event: req.body.id_event,
        id_siswa: req.body.id_siswa,
        tipe_ukt: req.body.tipe_ukt,
        mft: req.body.mft,
        push_up: req.body.push_up,
        spir_perut_atas: req.body.spir_perut_atas,
        spir_perut_bawah: req.body.spir_perut_bawah,
        spir_dada: req.body.spir_dada,
        plank: req.body.plank,
    }
    fisik.update(data, {where: param})
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

//endpoint untuk menghapus data fisik,METHOD: DELETE, function: destroy
app.delete("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    let param = {
        id_fisik : req.params.id
    }
    fisik.destroy({where: param})
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