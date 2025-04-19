//import library
const express = require('express');
const bodyParser = require('body-parser');
const { randomUUID } = require('crypto');
const Sequelize = require('sequelize');
const { sequelize, Op } = require("sequelize");
require('dotenv').config();
const Auth = require('../middleware/Auth.js');
const verifyRoles = require("../middleware/verifyRoles");
//implementasi
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//import model
const models = require('../src/models/index');
const soal = models.soal;
const kunciSoal = models.kunci_soal;

//endpoint ditulis disini

//endpoint get data soal
app.get("/", Auth,  (req,res) => {
    soal.findAll()
    .then(soal => {
        res.json({
            count: soal.length,
            data: soal
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})
//endpoint get data soal
app.post("/kunci_jawaban", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    soal.findAll({
        include: [
            {
                model: kunciSoal,
                as: "kunci_soal",
                attributes: ['opsi'],
                required: true,
            }
        ],
        where: {
            id_lembar_soal: req.body.id_lembar_soal
        }
    })
    .then(soal => {
        res.json({
            count: soal.length,
            data: soal
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})
//endpoint get data soal
app.get("/kosong", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    soal.findAll({
        include: [
            {
                model: kunciSoal,
                as: "kunci_soal",
                attributes: ['id_soal'],
                required: false,
            }
        ],
        where: {
            "$kunci_soal.id_soal$": {
              [Op.is]: null
            },
          },
    })
    .then(soal => {
        res.json({
            count: soal.length,
            data: soal
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})

//endpoint get soal tanpa jawaban by id lembar soal
app.get("/tipe/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    soal.findAll({
        where: {
            id_lembar_soal: req.params.id
        },
        order: [
            ["createdAt", "ASC"]
        ]
    })
    .then(soal => {
        res.json({
            count: soal.length,
            data: soal
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})

//endpoint get soal dengan jawaban by id lembar soal
app.get("/tipe/kunci/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    soal.findAll({
        where: {
            id_lembar_soal: req.params.id
        },
        include: [
            {
                model: kunciSoal,
                as: "kunci_soal",
                attributes: ['opsi'],
                required: true,
            }
        ],
        order: [
            ["createdAt", "ASC"]
        ]
    })
    .then(soal => {
        res.json({
            count: soal.length,
            data: soal
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})

//endpoint get data soal by id_lembar_soal
app.get("/lembar_soal/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    soal.findAll({
        where: {
            id_lembar_soal: req.params.id
        },
        order: [
            Sequelize.fn('RAND')
        ],
        limit: 20
    })
    .then(soal => {
        res.json({
            count: soal.length,
            data: soal
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})

//endpoint untuk menyimpan data soal, METHOD POST, function create
app.post("/", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) =>{
    const id = randomUUID();
    let data ={
        id_soal: id,
        id_lembar_soal: req.body.id_lembar_soal,
        pertanyaan: req.body.pertanyaan,
        opsi1: req.body.opsi1,
        opsi2: req.body.opsi2,
        opsi3: req.body.opsi3,
        opsi4: req.body.opsi4,
    }
    soal.create(data)
    .then(result => {
        const id_kunci = randomUUID();
        console.log(result.dataValues.id_soal);
        kunciSoal.create({
            id_kunci_soal: id_kunci,
            id_soal: result.dataValues.id_soal,
            opsi: req.body.opsi
        })
        .then(result => {
            res.json({
                message: "data is inserted"
            })
        })
    })
    .catch(error =>{
        res.json({
            message: error.message
        })
    })
}) 

//endpoint untuk mengupdate data soal, METHOD: PUT, fuction: UPDATE
app.put("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    let param = {
        id_soal : req.params.id
    }
    let data = {
        id_lembar_soal: req.body.id_lembar_soal,
        pertanyaan: req.body.pertanyaan,
        opsi1: req.body.opsi1,
        opsi2: req.body.opsi2,
        opsi3: req.body.opsi3,
        opsi4: req.body.opsi4
    }
    soal.update(data, {where: param})
    .then(result => {
        kunciSoal.update({opsi: req.body.opsi}, {where: param})
        .then(res => {
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
    .catch(error => {
        res.json({
            message  : error.message
        })
    })
})

//endpoint untuk menghapus data soal,METHOD: DELETE, function: destroy
app.delete("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    let param = {
        id_soal : req.params.id
    }
    kunciSoal.destroy({where: param})
    soal.destroy({where: param})
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