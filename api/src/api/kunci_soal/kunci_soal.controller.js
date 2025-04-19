const models = require('../../models/index');
const kunci_soal = models.kunci_soal;
const lembar_soal = models.lembar_soal;

const { randomUUID } = require('crypto');


module.exports = {
    controllerGetAll: async (req, res) => {
        kunci_soal.findAll()
        .then(kunci_soal => {
            res.json({
                count: kunci_soal.length,
                data: kunci_soal
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
    },
    controllerGetByTipe: async (req, res) => {
        let lembarSoal = await lembar_soal.findOne({
            where: {tipe_ukt: req.params.tipe_ukt}
        })
        const id_lembar_soal = lembarSoal?.id_lembar_soal
        kunci_soal.findAll({
            attributes: ['id_soal', 'opsi'],
            include:[
                {
                    model: models.soal,
                    as: "soal",
                    attributes: ['id_lembar_soal'],
                    required: true,
                    where: {id_lembar_soal: id_lembar_soal}
                }
            ]
        })
            .then(kunci_soal => {
                res.json({
                    count: kunci_soal.length,
                    data: kunci_soal
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
            id_kunci_soal: id,
            id_soal: req.body.id_soal,
            opsi: req.body.opsi
        }
        kunci_soal.create(data)
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
    controllerScore: async (req, res) => {
        kunci_soal.findAll({
            where: {
                id_soal: req.body.id_soal,
            }
        })
            .then(result => {
                if (result[0].opsi === req.body.opsi) {
                    res.json({
                        message: "jawaban benar",
                        jawaban: true
                    })
                } else if (result[0].opsi !== req.body.opsi) {
                    res.json({
                        message: "jawaban salah",
                        jawaban: false
                    })
                }

            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerEdit: async (req, res) => {
        let param = {
            id_kunci_soal: req.params.id
        }
        let data = {
            id_soal: req.body.id_soal,
            opsi: req.body.opsi
        }
        kunci_soal.update(data, { where: param })
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
            id_kunci_soal: req.params.id
        }
        kunci_soal.destroy({ where: param })
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