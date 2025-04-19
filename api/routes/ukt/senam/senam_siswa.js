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
const senam_siswa = models.senam_siswa;

//endpoint ditulis disini

//endpoint get data senam_siswa
app.get("/", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    senam_siswa.findAll()
    .then(senam_siswa => {
        res.json({
            count: senam_siswa.length,
            data: senam_siswa
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})

//endpoint get data senam_siswa by tipe_ukt
app.get("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    senam_siswa.findAll({
        where: {
            tipe_ukt: req.params.id
        }
    })
    .then(senam_siswa => {
        res.json({
            count: senam_siswa.length,
            data: senam_siswa
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})
//endpoint get data senam_siswa by tipe_ukt
app.get("/ranting/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    senam_siswa.findAll({
        where: {
            ranting: req.params.id
        }
    })
    .then(senam_siswa => {
        res.json({
            count: senam_siswa.length,
            data: senam_siswa
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
    senam_siswa.findAll({
        attributes: ['id_senam_siswa','id_senam_detail'],
        include: [
            {
                model: models.senam_detail,
                attributes: ['name','tipe_ukt'],
                as: "siswa_senam",
                required: false
            }
        ]
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
//endpoint get data senam by id siswa
app.get("/siswa/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    senam_siswa.findAll({
        attributes: ['id_senam_siswa','id_siswa','id_senam', 'predikat'],
        where: {
            id_siswa: req.params.id
        },
        include: [
            {
                model: models.senam,
                attributes: ['name','tipe_ukt'],
                as: "siswa_senam",
                required: false
            }
        ]
    })
    .then(senam => {
        console.log(senam[0].predikat)
        const nilai = []
        for(let i=0; i < senam.length; i++) {
            if(senam[i].predikat == true){
              nilai.push('true');
            }
        }
        console.log(nilai.length);
        res.json({
            count: senam.length,
            senam_benar: nilai.length,
            data: senam
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})
//endpoint untuk menyimpan data senam_siswa, METHOD POST, function create
app.post("/", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) =>{
    let data ={
        id_senam_detail: req.body.id_senam_detail,
        id_senam: req.body.id_senam,
        predikat: req.body.predikat
    }
    senam_siswa.create(data)
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

//endpoint untuk mengupdate data senam_siswa, METHOD: PUT, fuction: UPDATE
app.put("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    let param = {
        id_senam_siswa : req.params.id
    }
    let data ={
        id_senam_detail: req.body.id_senam_detail,
        id_senam: req.body.id_senam,
        predikat: req.body.predikat
    }
    senam_siswa.update(data, {where: param})
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

//endpoint untuk menghapus data senam_siswa,METHOD: DELETE, function: destroy
app.delete("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    let param = {
        id_senam_siswa : req.params.id
    }
    senam_siswa.destroy({where: param})
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
app.delete("/detail/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    let param = {
        id_senam_detail : req.params.id
    }
    senam_siswa.findAll({where: param})
    .then(result => {
        for(let i=0; i<result.length; i++){
            let data = result[i].dataValues.id_senam
            senam_siswa.destroy({where: {
                id_senam: data
            }})
        }
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