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
const teknik_detail = models.teknik_detail;

//endpoint ditulis disini

//endpoint get data teknik_detail
app.get("/", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    teknik_detail.findAll()
    .then(teknik_detail => {
        res.json({
            count: teknik_detail.length,
            data: teknik_detail
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})

//endpoint get data teknik_detail by tipe_ukt
app.get("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    teknik_detail.findAll({
        where: {
            tipe_ukt: req.params.id
        }
    })
    .then(teknik_detail => {
        res.json({
            count: teknik_detail.length,
            data: teknik_detail
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})
//endpoint get data teknik by tipe_ukt
app.get("/ukt/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    teknik_detail.findAll({
        where: {
            tipe_ukt: req.params.id
        },
        attributes: ['id_teknik_detail','id_penguji','id_event','id_siswa','tipe_ukt'],
        include: [
            {
                model: models.siswa,
                attributes: ['name'],
                as: "teknik_siswa",
            },
            {
                model: models.penguji,
                attributes: ['name'],
                as: "penguji_teknik"
            },
            {
                model: models.teknik_siswa,
                attributes: ['id_teknik','predikat'],
                as: "siswa_teknik_detail",
                include: [
                    {
                        model: models.teknik,
                        attributes: ['name'],
                        as: "siswa_teknik",
                    }
                ],
                order: [['id_teknik', 'ASC']]
            }
        ],
    })
    .then(teknik => {
        res.json({
            count: teknik.length,
            data: teknik
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})
//endpoint get data teknik by tipe_ukt
app.get("/ukt/:id/:event", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    teknik_detail.findAll({
        where: {
            tipe_ukt: req.params.id,
            id_event: req.params.event
        },
        attributes: ['id_teknik_detail','id_penguji','id_event','id_siswa','tipe_ukt'],
        include: [
            {
                model: models.siswa,
                attributes: ['name', 'nomor_urut'],
                as: "teknik_siswa",
            },
            {
                model: models.penguji,
                attributes: ['name'],
                as: "penguji_teknik"
            },
            {
                model: models.teknik_siswa,
                attributes: ['id_teknik','predikat'],
                as: "siswa_teknik_detail",
                include: [
                    {
                        model: models.teknik,
                        attributes: ['id_teknik','name'],
                        as: "siswa_teknik",
                    }
                ],
                order: [['id_teknik', 'DESC']]
            }
        ],
    })
    .then(teknik => {
        res.json({
            count: teknik.length,
            data: teknik
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})
//endpoint get data teknik by id siswa
app.get("/siswa/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    teknik_detail.findAll({
        attributes: ['id_teknik_detail','id_siswa','id_teknik', 'predikat'],
        where: {
            id_siswa: req.params.id
        },
        include: [
            {
                model: models.teknik,
                attributes: ['name','tipe_ukt'],
                as: "siswa_teknik",
                required: false
            }
        ]
    })
    .then(teknik => {
        console.log(teknik[0].predikat)
        const nilai = []
        for(let i=0; i < teknik.length; i++) {
            if(teknik[i].predikat == true){
              nilai.push('true');
            }
        }
        console.log(nilai.length);
        res.json({
            count: teknik.length,
            teknik_benar: nilai.length,
            data: teknik
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})
//endpoint untuk menyimpan data teknik_detail, METHOD POST, function create
app.post("/", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) =>{
    let data ={
        id_penguji: req.body.id_penguji,
        id_event: req.body.id_event,
        id_siswa: req.body.id_siswa,
        tipe_ukt: req.body.tipe_ukt
    }
    teknik_detail.create(data)
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

//endpoint untuk mengupdate data teknik_detail, METHOD: PUT, fuction: UPDATE
app.put("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    let param = {
        id_teknik_detail : req.params.id
    }
    let data ={
        id_penguji: req.body.id_penguji,
        id_event: req.body.id_event,
        tipe_ukt: req.body.tipe_ukt,
        name: req.body.name
    }
    teknik_detail.update(data, {where: param})
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

//endpoint untuk menghapus data teknik_detail,METHOD: DELETE, function: destroy
app.delete("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    let param = {
        id_teknik_detail : req.params.id
    }
    teknik_detail.destroy({where: param})
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