const models = require('../../../../models/index');
const kripen_detail = models.kripen_detail;
const kripen_siswa = models.kripen_siswa
const ukt_siswa = models.ukt_siswa

module.exports = {
    controllerGetAll: async (req, res) => {
        kripen_detail.findAll()
            .then(kripen_detail => {
                res.json({
                    count: kripen_detail.length,
                    data: kripen_detail
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetByTipeUkt: async (req, res) => {
        kripen_detail.findAll({
            where: {
                tipe_ukt: req.params.id
            },
            attributes: ['id_kripen_detail', 'id_penguji', 'id_event', 'id_siswa', 'tipe_ukt'],
            include: [
                {
                    model: models.siswa,
                    attributes: ['name'],
                    as: "kripen_siswa",
                },
                {
                    model: models.penguji,
                    attributes: ['name'],
                    as: "penguji_kripen"
                },
                {
                    model: models.kripen_siswa,
                    attributes: ['id_kripen', 'predikat'],
                    as: "siswa_kripen_detail",
                    include: [
                        {
                            model: models.kripen,
                            attributes: ['name'],
                            as: "siswa_kripen"
                        }
                    ]
                }
            ]
        })
            .then(kripen => {
                res.json({
                    count: kripen.length,
                    data: kripen
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetByUktEvent: async (req, res) => {
        kripen_detail.findAll({
            where: {
                tipe_ukt: req.params.id,
                id_event: req.params.event
            },
            attributes: ['id_kripen_detail', 'id_penguji', 'id_event', 'id_siswa', 'tipe_ukt'],
            include: [
                {
                    model: models.siswa,
                    attributes: ['name', 'nomor_urut'],
                    as: "kripen_siswa",
                },
                {
                    model: models.penguji,
                    attributes: ['name'],
                    as: "penguji_kripen"
                },
                {
                    model: models.kripen_siswa,
                    attributes: ['id_kripen', 'predikat'],
                    as: "siswa_kripen_detail",
                    required: true,
                    include: [
                        {
                            model: models.kripen,
                            attributes: ['name'],
                            as: "siswa_kripen"
                        }
                    ]
                }
            ]
        })
            .then(kripen => {
                res.json({
                    count: kripen.length,
                    data: kripen
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetByIdSiswa: async (req, res) => {
        kripen_detail.findAll({
            attributes: ['id_kripen_detail', 'id_siswa', 'id_kripen', 'predikat'],
            where: {
                id_siswa: req.params.id
            },
            include: [
                {
                    model: models.kripen,
                    attributes: ['name', 'tipe_ukt'],
                    as: "siswa_kripen",
                    required: false
                }
            ]
        })
            .then(kripen => {
                console.log(kripen[0].predikat)
                const nilai = []
                for (let i = 0; i < kripen.length; i++) {
                    if (kripen[i].predikat == true) {
                        nilai.push('true');
                    }
                }
                console.log(nilai.length);
                res.json({
                    count: kripen.length,
                    kripen_benar: nilai.length,
                    data: kripen
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
            id_penguji: req.body.id_penguji,
            id_event: req.body.id_event,
            id_siswa: req.body.id_siswa,
            tipe_ukt: req.body.tipe_ukt
        }
        kripen_detail.create(data)
            .then(result => {
                res.json({
                    message: "data has been inserted",
                    data: result,
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerAddExam: async (req, res) => {
        try {
            const {
                id_penguji,
                id_event,
                id_siswa,
                tipe_ukt,
                ujian
            } = req.body;
            const detail = {
                id_penguji,id_siswa,id_event,tipe_ukt
            }
            const processDetail = await kripen_detail.create(detail)
            // mapping array ujian jadi banyak row
            const data = ujian.map(item => ({
                id_kripen_detail: processDetail.id_kripen_detail,
                id_siswa,
                id_kripen: item.id_kripen,
                predikat: item.predikat
            }));

            await kripen_siswa.bulkCreate(data);

            const total = data.length;
            const predikat10 = data.filter(i => i.predikat === 2).length;
            const predikat8 = data.filter(i => i.predikat === 1).length;

            const examResult10 = predikat10 * (100 / total);
            const examResult8 = predikat8 * (80 / total);
            const examResult = examResult10 + examResult8;
            const result1 = {
                total: Number(examResult.toFixed(2)),
                plus: Number(examResult10.toFixed(2)),
                benar: Number(examResult8.toFixed(2))
            };

            await ukt_siswa.update(
                { kripen: result1.total },
                { where: { id_siswa: req.body.id_siswa } }
            );

            res.json({
                message: "All exams inserted successfully",
                data: result1
            });

        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    },
    controllerEdit: async (req, res) => {
        let param = {
            id_kripen_detail: req.params.id
        }
        let data = {
            id_penguji: req.body.id_penguji,
            id_event: req.body.id_event,
            tipe_ukt: req.body.tipe_ukt,
            name: req.body.name
        }
        kripen_detail.update(data, { where: param })
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
            id_kripen_detail: req.params.id
        }
        kripen_detail.destroy({ where: param })
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