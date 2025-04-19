//import library
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const Auth = require('../middleware/Auth.js');
const verifyRoles = require("../middleware/verifyRoles");

//implementasi
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//import model
const models = require('../src/models/index');
const session = models.session;

//endpoint ditulis disini

//endpoint get data session
app.get("/", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"),(req,res) => {
    session.findAll()
    .then(session => {
        res.json({
            count: session.length,
            data: session
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})

//endpoint get data jurus by tipe_ukt
app.get("/ukt/:event", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    session.findAll({
        where: {
            id_event: req.params.event
        },
        include: [
            {
                model: models.siswa,
                attributes: ['name', 'nomor_urut'],
                as: "keshan_siswa",
            },
            {
                model: models.lembar_jawaban,
                as: "lembar_jawaban",
                include: [
                    {
                        model: models.soal,
                        as: 'soal_ujian'
                    }
                ]
            }
        ]
    })
    .then(session => {
        res.json({
            count: session.length,
            data: session
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})

//endpoint untuk menyimpan data session, METHOD POST, function create
app.post("/", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting", "siswa"), (req,res) =>{
    let data ={
        id_lembar_soal: req.body.id_lembar_soal,
        id_siswa: req.body.id_siswa,
        id_event: req.body.id_event,
        nilai: req.body.nilai,
        waktu_pengerjaan: req.body.waktu_pengerjaan
    }
    session.create(data)
    .then(result => {
        res.json({
            message: "data has been inserted",
            data: data
        })
    })
    .catch(error =>{
        res.json({
            message: error.message
        })
    })
}) 

app.post("/getid", Auth, verifyRoles("siswa"),(req,res) => {
    let param = {
        id_lembar_soal: req.body?.id_lembar_soal,
        id_siswa: req.body.id_siswa
    }
    session.findOne({where: param})
    .then(session => {
        res.json({
            count: session.length,
            data: session
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})

//endpoint selesai ujian
app.post("/timer", Auth, verifyRoles("siswa"), (req,res) =>{
    let param = {
        id_lembar_soal: req.body.id_lembar_soal,
        id_siswa: req.body.id_siswa
    }
    
    session.findOne({where: param})
    .then(result => {
        res.json({
            message : "Ujian selesai",
            data: result
        })
    })
    .catch(error => {
        res.json({
            message  : error.message
        })
    })
})

//endpoint start timer
app.post("/start/", Auth, verifyRoles("siswa"), async (req,res) =>{
    let start = new Date()
    let endDate = new Date()
    let setdetik = endDate.setMilliseconds((endDate.getMilliseconds()) + 600000)
    let end = new Date(setdetik)

    let param = {
        id_lembar_soal: req.body.id_lembar_soal,
        id_siswa: req.body.id_siswa
    }
    console.log(param);
    const cekData = await session.findOne({where: param})
    if(!cekData){
        let data = {
            id_lembar_soal: req.body.id_lembar_soal,
            id_siswa: req.body.id_siswa,
            id_event: req.body.id_event,
            nilai: 0,
            start: start,
            finish: end
        }
        session.create(data)
        .then(result => {
            res.json({
                message : "Ujian dimulai",
                data: result
            })
        })
        .catch(error => {
            res.json({
                message  : error.message
            })
        })
    } else {
        res.json({
            message : "Ujian sudah dimulai",
            data: cekData
        })
    }

})

//endpoint selesai ujian
app.put("/finish/", Auth, verifyRoles("siswa"), (req,res) =>{
    let finish = new Date()

    let param = {
        id_lembar_soal: req.body.id_lembar_soal,
        id_siswa: req.body.id_siswa
    }
    
    let data = {
        nilai: req.body.nilai,
        // waktu_pengerjaan: req.body.waktu_pengerjaan,
        finish: finish
    }
    console.log(data);
    session.update(data, {where: param})
    .then(result => {
        res.json({
            message : "Ujian selesai",
            data: data
        })
    })
    .catch(error => {
        res.json({
            message  : error.message
        })
    })
})

//endpoint untuk mengupdate data session, METHOD: PUT, fuction: UPDATE
app.put("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    let param = {
        id_session : req.params.id
    }
    let data = {
        id_lembar_soal: req.body.id_lembar_soal,
        id_siswa: req.body.id_siswa,
        nilai: req.body.nilai,
        waktu_pengerjaan: req.body.waktu_pengerjaan
    }
    session.update(data, {where: param})
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

//endpoint untuk menghapus data session,METHOD: DELETE, function: destroy
app.delete("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"),(req,res) => {
    let param = {
        id_session : req.params.id
    }
    session.destroy({where: param})
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