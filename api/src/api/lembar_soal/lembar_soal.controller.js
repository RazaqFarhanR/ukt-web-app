const models = require('../../models/index');
const lembar_soal = models.lembar_soal;
const ranting = models.ranting

const { randomUUID } = require('crypto');
const Sequelize = require('sequelize');


module.exports = {
    controllerGetAll: async (req, res) => {
        lembar_soal.findAll({
            include: [
                {
                    model: ranting,
                    as: "lembar_ranting",
                    attributes: ['name'],
                    required: false
                }
            ]
        })
            .then(lembar_soal => {
                res.json({
                    count: lembar_soal.length,
                    data: lembar_soal
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerExam: async (req, res) => {
        let param = {
            tipe_ukt: req.params.ukt,
        }
    
        if(req.body.id_ranting){
            param.id_ranting= req.body.id_ranting
        }
    
        lembar_soal.findOne({
            where: param,
            include: [
                {
                    model: ranting,
                    as: "lembar_ranting",
                    attributes: ['name'],
                    required: false
                },
                {
                    model: models.soal,
                    as: "lembar_soal_ujian",
                    order: [
                        Sequelize.fn('RAND')
                    ],
                    limit: 20
                }
            ]
        })
        .then(lembar_soal => {
            res.json({
                data: lembar_soal
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })    
    },
    controllerAdd: async (req, res) => {
        const id = randomUUID();
        let data = {
            id_lembar_soal: id,
            id_ranting: req.body.id_ranting,
            tipe_ukt: req.body.tipe_ukt,
            waktu_pengerjaan: req.body.waktu_pengerjaan
        }
        lembar_soal.create(data)
            .then(result => {
                res.json({
                    message: "data has been inserted"
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerEdit: async (req, res) => {
        let param = {
            id_lembar_soal: req.params.id
        }
        let data = {
            id_ranting: req.body.id_ranting,
            tipe_soal: req.body.tipe_soal,
            waktu_pengerjaan: req.body.waktu_pengerjaan
        }
        lembar_soal.update(data, { where: param })
            .then(result => {
                res.json({
                    message: "data has been updated"
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerDelete: async (req, res) => {
        let param = {
            id_lembar_soal: req.params.id
        }
        lembar_soal.destroy({ where: param })
            .then(result => {
                res.json({
                    massege: "data has been deleted"
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
}