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
const teknik_siswa = models.teknik_siswa;

//endpoint ditulis disini

//endpoint get data teknik_siswa
app.get("/", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    teknik_siswa.findAll()
    .then(teknik_siswa => {
        res.json({
            count: teknik_siswa.length,
            data: teknik_siswa
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})
//endpoint get data teknik_siswa by tipe ukt
app.get("/ukt/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    teknik_siswa.findAll({
        where: {
            tipe_ukt: req.params.id
        }
    })
    .then(teknik_siswa => {
        res.json({
            count: teknik_siswa.length,
            data: teknik_siswa
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})
//endpoint get data teknik_siswa by tipe id siswa
app.get("/siswa/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    teknik_siswa.findAll({
        where: {
            id_siswa: req.params.id
        },
        attributes: ['id_teknik','predikat'],
        include: [
            {
                model: models.teknik,
                attributes: ['name'],
                as: "siswa_teknik"
            }
        ],
        order: ['id_teknik']
    })
    .then(teknik_siswa => {
        console.log(teknik_siswa[0].predikat)
        const baik = []
        const cukup = []
        const kurang = []
        for(let i=0; i < teknik_siswa.length; i++) {
            if(teknik_siswa[i].predikat == 'BAIK'){
                baik.push('1');
            } else if (teknik_siswa[i].predikat == 'CUKUP') {
                cukup.push('1');
            } else if (teknik_siswa[i].predikat == 'KURANG'){
                kurang.push('1');
            }
        }
        const newBaik = baik.length * 3;
        const newCukup = cukup.length * 2;
        const newKurang = kurang.length;
        const nilai = newBaik + newCukup + newKurang;
        res.json({
            count: teknik_siswa.length,
            id_siswa: req.params.id,
            nilai: nilai,
            data: teknik_siswa
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})

//endpoint untuk menyimpan data teknik_siswa, METHOD POST, function create
app.post("/", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) =>{
    let data ={     
        id_teknik_detail: req.body.id_teknik_detail,
        id_teknik: req.body.id_teknik,
        predikat: req.body.predikat
    }
    teknik_siswa.create(data)
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

//endpoint untuk mengupdate data teknik_siswa, METHOD: PUT, fuction: UPDATE
app.put("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    let param = {
        id_teknik_siswa : req.params.id
    }
    let data ={     
        id_teknik_detail: req.body.id_teknik_detail,
        id_teknik: req.body.id_teknik,
        predikat: req.body.predikat
    }
    teknik_siswa.update(data, {where: param})
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

//endpoint untuk menghapus data teknik_siswa,METHOD: DELETE, function: destroy
app.delete("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    let param = {
        id_teknik_siswa : req.params.id
    }
    teknik_siswa.destroy({where: param})
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