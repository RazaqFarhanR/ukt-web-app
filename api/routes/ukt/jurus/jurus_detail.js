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
const jurus_detail = models.jurus_detail;

//endpoint ditulis disini

//endpoint get data jurus_detail
app.get("/", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    jurus_detail.findAll()
    .then(jurus_detail => {
        res.json({
            count: jurus_detail.length,
            data: jurus_detail
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
    jurus_detail.findAll({
        where: {
            tipe_ukt: req.params.id
        },
        attributes: ['id_jurus_detail','id_event','id_siswa','tipe_ukt'],
        include: [
            {
                model: models.siswa,
                attributes: ['name'],
                as: "jurus_siswa",
            },
            {
                model: models.jurus_siswa,
                attributes: ['id_jurus','predikat'],
                as: "siswa_jurus_detail",
                include: [
                    {
                        model: models.jurus,
                        attributes: ['name'],
                        as: "jurus"
                    }
                ]
            }
        ]
    })
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
app.get("/ukt/:id/:event", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    jurus_detail.findAll({
        where: {
            tipe_ukt: req.params.id,
            id_event: req.params.event
        },
        attributes: ['id_jurus_detail','id_penguji','id_event','id_siswa','tipe_ukt'],
        include: [
            {
                model: models.siswa,
                attributes: ['name', 'nomor_urut'],
                as: "jurus_siswa",
            },
            {
                model: models.penguji,
                attributes: ['name'],
                as: "penguji_jurus"
            },
            {
                model: models.jurus_siswa,
                attributes: ['id_jurus','predikat'],
                as: "siswa_jurus_detail",
                required: true,
                include: [
                    {
                        model: models.jurus,
                        attributes: ['name'],
                        as: "jurus"
                    }
                ]
            }
        ]
    })
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
//endpoint get data jurus by id siswa
app.get("/siswa/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    jurus_detail.findAll({
        attributes: ['id_jurus_detail','id_siswa','id_jurus', 'predikat'],
        where: {
            id_siswa: req.params.id
        },
        include: [
            {
                model: models.jurus,
                attributes: ['name','tipe_ukt'],
                as: "siswa_jurus",
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
//endpoint untuk menyimpan data jurus_detail, METHOD POST, function create
app.post("/", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) =>{
    let data ={
        id_penguji: req.body.id_penguji,
        id_event: req.body.id_event,
        id_siswa: req.body.id_siswa,
        tipe_ukt: req.body.tipe_ukt
    }
    jurus_detail.create(data)
    .then(result => {
        res.json({
            message: "data has been inserted",
            data: result,
        })
    })
    .catch(error =>{
        res.json({
            message: error.message
        })
    })
}) 

//endpoint untuk mengupdate data jurus_detail, METHOD: PUT, fuction: UPDATE
app.put("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    let param = {
        id_jurus_detail : req.params.id
    }
    let data ={
        id_penguji: req.body.id_penguji,
        id_event: req.body.id_event,
        id_siswa: req.body.id_siswa,
        tipe_ukt: req.body.tipe_ukt
    }
    jurus_detail.update(data, {where: param})
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

//endpoint untuk menghapus data jurus_detail,METHOD: DELETE, function: destroy
app.delete("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    let param = {
        id_jurus_detail : req.params.id
    }
    jurus_detail.destroy({where: param})
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