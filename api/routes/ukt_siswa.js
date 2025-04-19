//import library
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const Auth = require('../middleware/Auth.js');
const verifyRoles = require("../middleware/verifyRoles");

//implementasi
const app = express();
const { Sequelize, Op, where } = require("sequelize");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//import model
const models = require('../src/models/index');
const ukt_siswa = models.ukt_siswa;
const detail_sambung = models.detail_sambung

//endpoint ditulis disini

//endpoint get data ukt_siswa
app.get("/", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    ukt_siswa.findAll()
    .then(ukt_siswa => {
        res.json({
            count: ukt_siswa.length,
            data: ukt_siswa
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})
//endpoint get data ukt_siswa by tipe ukt
app.get("/ukt/:event/:jenis/:updown", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting",), (req,res) => {
    const { jenis, updown } = req.params;
    let orderCriteria = [];
    
    switch (jenis) {
    case 'senam':
        orderCriteria.push(['senam', updown === 'downToUp' ? 'ASC' : 'DESC']);
    break;
    case 'jurus':
        orderCriteria.push(['jurus', updown === 'downToUp' ? 'ASC' : 'DESC']);
        break;
    case 'fisik':
        orderCriteria.push(['fisik', updown === 'downToUp' ? 'ASC' : 'DESC']);
        break;
    case 'teknik':
        orderCriteria.push(['teknik', updown === 'downToUp' ? 'ASC' : 'DESC']);
        break;
    case 'sambung':
        orderCriteria.push(['sambung', updown === 'downToUp' ? 'ASC' : 'DESC']);
        break;
    case 'keshan':
        orderCriteria.push(['keshan', updown === 'downToUp' ? 'ASC' : 'DESC']);
        break;
    case 'all':
        orderCriteria.push([
        Sequelize.literal('(COALESCE(senam, 0) + COALESCE(jurus, 0) + COALESCE(fisik, 0) + COALESCE(teknik, 0) + COALESCE(sambung, 0) + COALESCE(keshan, 0))/6'),
        updown === 'downToUp' ? 'ASC' : 'DESC'
        ]);
    break;
        default:
          // handle invalid jenis value
          res.status(400).send('Invalid jenis value');
          return;
      }
    ukt_siswa.findAll({
        include: [
            {
                model: models.siswa,
                as: "siswa_ukt_siswa",
                attributes: ['name','tingkatan',"nomor_urut"],
                include: [
                    {
                        model: models.ranting,
                        as: "siswa_ranting",
                        attributes: ['name'],
                    }
                ]
            }
        ],
        where: {
            id_event: req.params.event,
        },
        order: orderCriteria
    })
    .then(ukt_siswa => {
        res.json({
            count: ukt_siswa.length,
            data: ukt_siswa
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})

//endpoint get data ukt_siswa by tipe ukt
app.post("/ukt/:event", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting",), (req,res) => {
    const rantings = req.body.ranting || []
    ukt_siswa.findAll({
        include: [
            {
                model: models.siswa,
                as: "siswa_ukt_siswa",
                attributes: ['name','tingkatan', "nomor_urut"],
                where: {
                    id_ranting: {
                        [Op.in]: rantings   
                    }
                },
                include: [
                    {
                        model: models.ranting,
                        as: "siswa_ranting",
                        attributes: ['name'],
                    }
                ]
            }
        ],
        where: {
            id_event: req.params.event,
        },
    })
    .then(ukt_siswa => {
        res.json({
            count: ukt_siswa.length,
            data: ukt_siswa
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})
//endpoint get data ukt_siswa by tipe ukt
app.get("/ukt/:event/:ukt", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting",), (req,res) => {
    let orderCriteria = [[Sequelize.literal('(COALESCE(senam, 0) + COALESCE(jurus, 0) + COALESCE(fisik, 0) + COALESCE(teknik, 0) + COALESCE(sambung, 0) + COALESCE(keshan, 0))/6'), 'DESC']];

    ukt_siswa.findAll({
        where: {
            tipe_ukt: req.params.ukt,
            id_event: req.params.event
        },
        include: [
            {
                model: models.siswa,
                as: "siswa_ukt_siswa",
                attributes: ['name','tingkatan', "nomor_urut"],
                include: [
                    {
                        model: models.ranting,
                        as: "siswa_ranting",
                        attributes: ['name']
                    }
                ]
            }
        ],
        order: orderCriteria
    })
    .then(ukt_siswa => {
        res.json({
            count: ukt_siswa.length,
            data: ukt_siswa
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})
//endpoint get data ukt_siswa by tipe id siswa
app.get("/siswa/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting", "siswa"), (req,res) => {
    ukt_siswa.findOne({
        where: {
            id_siswa: req.params.id
        },
        order: []
    })
    .then(ukt_siswa => {
        res.json({
            data: ukt_siswa
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})

//endpoint untuk menyimpan data ukt_siswa, METHOD POST, function create
app.post("/", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting", "siswa"), (req,res) =>{
    let data ={     
        tipe_ukt: req.body.tipe_ukt,
        id_event: req.body.id_event,
        id_siswa: req.body.id_siswa,
        rayon: req.body.rayon,
        keshan: req.body.keshan,
        senam: req.body.senam,
        jurus: req.body.jurus,
        fisik: req.body.fisik > 100 ? 100 : req.body.fisik,
        teknik: req.body.teknik,
        sambung: req.body.sambung
    }
    ukt_siswa.create(data)
    .then(result => {
        res.json({
            message: "data has been inserted",
            data: result
        })
    })
    .catch(error =>{
        res.json({
            message: error.message
        })
    })
}) 

//endpoint untuk mengupdate data ukt_siswa, METHOD: PUT, fuction: UPDATE
app.put("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting", "siswa"), (req,res) => {
    let param = {
        id_ukt_siswa : req.params.id
    }
    let data ={     
        tipe_ukt: req.body.tipe_ukt,
        id_event: req.body.id_event,
        id_siswa: req.body.id_siswa,
        rayon: req.body.rayon,
        keshan: req.body.keshan,
        senam: req.body.senam,
        jurus: req.body.jurus,
        fisik: req.body.fisik > 100 ? 100 : req.body.fisik,
        teknik: req.body.teknik,
        sambung: req.body.sambung
    }
    ukt_siswa.update(data, {where: param})
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

//endpoint untuk menghapus data ukt_siswa,METHOD: DELETE, function: destroy
app.delete("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req,res) => {
    let param = {
        id_ukt_siswa : req.params.id
    }
    ukt_siswa.destroy({where: param})
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