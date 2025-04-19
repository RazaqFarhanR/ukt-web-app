const models = require('../../models/index');
const soal = models.soal;
const lembar_soal = models.lembar_soal;
const kunciSoal = models.kunci_soal;
const { Sequelize, Op } = require("sequelize");
const { randomUUID } = require('crypto');

module.exports = {
    controllerGetAll: async (req, res) => {
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
    },
    controllerGetCount: async (req, res) => {
        try {
            let data = await lembar_soal.findAll({
                raw:true,
                include: [
                    {
                        model: models.soal,
                        as: "lembar_soal_ujian",
                        attributes: [],
                        required: false,
                    }
                ],
                attributes: ['tipe_ukt', [Sequelize.fn('COUNT', Sequelize.col('lembar_soal_ujian.id_lembar_soal')), 'count']],
                group: ['lembar_soal.id_lembar_soal']
              }
            )
    
            let UKCW = data.find(e => {return e.tipe_ukt === 'UKCW'})?.count
            let Jambon = data.find(e => {return e.tipe_ukt === 'UKT Jambon'})?.count
            let Hijau = data.find(e => {return e.tipe_ukt === 'UKT Hijau'})?.count
            let Putih = data.find(e => {return e.tipe_ukt === 'UKT Putih'})?.count
    
            res.json({
                    jambon: Jambon,
                    hijau: Hijau,
                    putih: Putih,
                    ukcw: UKCW,
            })
        } catch (error) {
            res.json({
                message: error.message
            })
        }

    },
    controllerGetByTipe: async (req, res, next) => {
        let lembarSoal = await lembar_soal.findOne({
            where: {tipe_ukt: req.params.tipe_ukt}
        })
        
        let id_lembar_soal 
        if (!lembarSoal) {
            const id = randomUUID();
            let data = {
                id_lembar_soal: id,
                id_ranting: req.body.id_ranting,
                tipe_ukt: req.params.tipe_ukt,
                waktu_pengerjaan: req.body.waktu_pengerjaan
            }
            await lembar_soal.create(data)
            .then(res =>{
                id_lembar_soal = res.id_lembar_soal
            })
            .catch(error => {
                return res.json({
                    message: error.message
                })
            })
        } else {
            id_lembar_soal = lembarSoal?.id_lembar_soal
        }


        soal.findAll({
            where: {
                id_lembar_soal: id_lembar_soal
            },
            include: [
                {
                    model: kunciSoal,
                    as: "kunci_soal",
                    attributes: ['id_soal', 'opsi'],
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
    },
    controllerGetByTipeandPaket: async (req, res, next) => {
        let lembarSoal = await lembar_soal.findOne({
            where: { tipe_ukt: req.params.tipe_ukt }
        })

        let id_lembar_soal
        if (!lembarSoal) {
            const id = randomUUID();
            let data = {
                id_lembar_soal: id,
                id_ranting: req.body.id_ranting,
                tipe_ukt: req.params.tipe_ukt,
                waktu_pengerjaan: req.body.waktu_pengerjaan
            }
            await lembar_soal.create(data)
                .then(res => {
                    id_lembar_soal = res.id_lembar_soal
                })
                .catch(error => {
                    return res.json({
                        message: error.message
                    })
                })
        } else {
            id_lembar_soal = lembarSoal?.id_lembar_soal
        }


        soal.findAll({
            where: {
                id_lembar_soal: id_lembar_soal,
                paket: req.params.paket
            },
            include: [
                {
                    model: kunciSoal,
                    as: "kunci_soal",
                    attributes: ['id_soal', 'opsi'],
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
    },
    controllerGetEmptySoal: async (req, res) => {
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
    },
    controllerGetAnswerByLembarSoal: async (req, res) => {
        let lembarSoal = await lembar_soal.findOne({
            where: {tipe_ukt: req.params.tipe_ukt}
        })
        const id_lembar_soal = lembarSoal?.id_lembar_soal
        soal.findAll({
            where: {
                id_lembar_soal: id_lembar_soal
            },
            attributes: [],
            include: [
                {
                    model: kunciSoal,
                    as: "kunci_soal",
                    attributes: ['id_soal', 'opsi'],
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
    },
    controllerGetExamQuestion: async (req, res) => {
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
    },
    controllerAdd: async (req, res) => {
        // let lembarSoal = await lembar_soal.findOne({
        //     where: {tipe_ukt: req.params.tipe_ukt}
        // })

        // const id_lembar_soal = lembarSoal?.id_lembar_soal
        const id = randomUUID();
        let data = {
            id_soal: id,
            id_lembar_soal: req.body.id_lembar_soal,
            pertanyaan: req.body.pertanyaan,
            opsi1: req.body.opsi1,
            opsi2: req.body.opsi2,
            opsi3: req.body.opsi3,
            opsi4: req.body.opsi4,
        }
        if (req.body.paket) {
            data.paket = req.body.paket
        }
        soal.create(data)
            .then(result => {
                const id_kunci = randomUUID();
                // console.log(result.dataValues.id_soal);
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
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerEdit: async (req, res) => {
        let param = {
            id_soal: req.params.id
        }
        let data = {
            id_lembar_soal: req.body.id_lembar_soal,
            pertanyaan: req.body.pertanyaan,
            opsi1: req.body.opsi1,
            opsi2: req.body.opsi2,
            opsi3: req.body.opsi3,
            opsi4: req.body.opsi4
        }
        soal.update(data, { where: param })
            .then(result => {
                kunciSoal.update({ opsi: req.body.opsi }, { where: param })
                    .then(res => {
                        res.json({
                            message: "data has been updated"
                        })
                    })
                    .catch(error => {
                        res.json({
                            message: error.message
                        })
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
            id_soal: req.params.id
        }
        kunciSoal.destroy({ where: param })
        soal.destroy({ where: param })
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