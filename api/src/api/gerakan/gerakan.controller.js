const detail_sambung = require('../../models/detail_sambung');
const models = require('../../models/index');
const gerakan = models.gerakan;
const siswa = models.siswa;
const detail = models.detail_sambung;
const detailGerak = models.gerakan_detail
const sambung = models.sambung;
const event = models.event;
const Sequelize = models.Sequelize

module.exports = {
    controllerGetAll: async (req, res) => {
        gerakan.findAll()
            .then(gerakan => {
                res.json({
                    count: gerakan.length,
                    data: gerakan
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetArray: async (req, res) => {
        let idEvent = req.params.id
        let whereClause = {
            id_event: idEvent
        };
        sambung.findAll({
            attributes: ['id_penguji'],
            include: [
                {
                    model: models.penguji,
                    as: 'penguji_sambung',
                    required: true,
                    attributes: ['name'],
                },
                {
                    model: detailGerak,
                    as: 'detail_gerak',
                    required: true,
                    attributes: ['name', 'posisi'],
                    include: [
                        {
                            model: gerakan,
                            as: 'gerak_detail',
                            required: false,
                            attributes: ['id_nilai', 'green'],
                            order: ['id_nilai', 'DESC']
                            // where: {
                            //     id_detail: Sequelize.col('detail_sambung.id_detail_sambung')
                            // }
                        }
                    ],
                    order: [
                        ['posisi', 'DESC']
                    ],
                },
                {
                    model: models.detail_sambung,
                    as: 'detail_sambung',
                    required: true,
                    attributes: ['id_siswa'],
                    include: [
                        {
                            model: models.siswa,
                            as: 'sambung_siswa',
                            required: true,
                            attributes: ['id_siswa'],
                            where: {
                                id_ranting: req.params.ranting
                            }
                        }
                    ]
                }
            ],
            where: whereClause
        })
            .then(gerakan => {
                res.json({
                    count: gerakan.length,
                    data: gerakan
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerAdd: async (req, res) => {
        let data = {
            id_nilai_sambung: req.body.id_nilai_sambung,
            id_siswa: req.body.id_siswa,
            green: req.body.green
        }
        gerakan.create(data)
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
    controllerAddDetail: async (req, res) => {
        let data = {
            id_sambung: req.body.id_sambung,
            name: req.body.name,
            posisi: req.body.posisi
        }
        detailGerak.create(data)
            .then(result => {
                res.json({
                    message: "data has been inserted",
                    data: result
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerArray: async (req, res) => {
        try {
            if (!req.body.dataArray || !Array.isArray(req.body.dataArray)) {
                return res.json({
                    message: "Invalid or missing dataArray in the request body"
                });
            }

            const dataArray = req.body.dataArray;
            const promises = [];

            dataArray.forEach(data => {
                const newData = {
                    id_detail: req.body.id_detail,
                    id_nilai: data.id,
                    green: data.green
                };

                const createPromise = gerakan.create(newData);
                promises.push(createPromise);
            });

            await Promise.all(promises);

            res.json({
                message: "Data has been inserted"
            });
        } catch (error) {
            res.json({
                message: error.message
            });
        }
    },

    controllerEdit: async (req, res) => {
        let param = {
            id_gerakan: req.params.id
        }
        let data = {
            id_nilai_sambung: req.body.id_nilai_sambung,
            id_detail_sambung: req.body.id_detail_sambung,
            green: req.body.green
        }
        gerakan.update(data, { where: param })
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
            id_gerakan: req.params.id
        }
        gerakan.destroy({ where: param })
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