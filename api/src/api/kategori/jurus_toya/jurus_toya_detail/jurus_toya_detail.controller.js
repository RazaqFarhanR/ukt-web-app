const models = require('../../../../models/index');
const jurus_toya_detail = models.jurus_toya_detail;
const jurus_toya_siswa = models.jurus_toya_siswa
const ukt_siswa = models.ukt_siswa

module.exports = {
    controllerGetAll: async (req, res) => {
        jurus_toya_detail.findAll()
            .then(jurus_toya_detail => {
                res.json({
                    count: jurus_toya_detail.length,
                    data: jurus_toya_detail
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetByTipeUkt: async (req, res) => {
        jurus_toya_detail.findAll({
            where: {
                tipe_ukt: req.params.id
            },
            attributes: ['id_jurus_toya_detail', 'id_penguji', 'id_event', 'id_siswa', 'tipe_ukt'],
            include: [
                {
                    model: models.siswa,
                    attributes: ['name'],
                    as: "jurus_toya_siswa",
                },
                {
                    model: models.penguji,
                    attributes: ['name'],
                    as: "penguji_jurus_toya"
                },
                {
                    model: models.jurus_toya_siswa,
                    attributes: ['id_jurus_toya', 'predikat'],
                    as: "siswa_jurus_toya_detail",
                    include: [
                        {
                            model: models.jurus_toya,
                            attributes: ['name'],
                            as: "siswa_jurus_toya"
                        }
                    ]
                }
            ]
        })
            .then(jurus_toya => {
                res.json({
                    count: jurus_toya.length,
                    data: jurus_toya
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetByUktEvent: async (req, res) => {
        jurus_toya_detail.findAll({
            where: {
                tipe_ukt: req.params.id,
                id_event: req.params.event
            },
            attributes: ['id_jurus_toya_detail', 'id_penguji', 'id_event', 'id_siswa', 'tipe_ukt'],
            include: [
                {
                    model: models.siswa,
                    attributes: ['name', 'nomor_urut'],
                    as: "jurus_toya_siswa",
                },
                {
                    model: models.penguji,
                    attributes: ['name'],
                    as: "penguji_jurus_toya"
                },
                {
                    model: models.jurus_toya_siswa,
                    attributes: ['id_jurus_toya', 'predikat'],
                    as: "siswa_jurus_toya_detail",
                    required: true,
                    include: [
                        {
                            model: models.jurus_toya,
                            attributes: ['name'],
                            as: "siswa_jurus_toya"
                        }
                    ]
                }
            ]
        })
            .then(jurus_toya => {
                res.json({
                    count: jurus_toya.length,
                    data: jurus_toya
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetByIdSiswa: async (req, res) => {
        jurus_toya_detail.findAll({
            attributes: ['id_jurus_toya_detail', 'id_siswa', 'id_jurus_toya', 'predikat'],
            where: {
                id_siswa: req.params.id
            },
            include: [
                {
                    model: models.jurus_toya,
                    attributes: ['name', 'tipe_ukt'],
                    as: "siswa_jurus_toya",
                    required: false
                }
            ]
        })
            .then(jurus_toya => {
                console.log(jurus_toya[0].predikat)
                const nilai = []
                for (let i = 0; i < jurus_toya.length; i++) {
                    if (jurus_toya[i].predikat == true) {
                        nilai.push('true');
                    }
                }
                console.log(nilai.length);
                res.json({
                    count: jurus_toya.length,
                    jurus_toya_benar: nilai.length,
                    data: jurus_toya
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
        jurus_toya_detail.create(data)
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
            const processDetail = await jurus_toya_detail.create(detail)
            // mapping array ujian jadi banyak row
            const data = ujian.map(item => ({
                id_jurus_toya_detail: processDetail.id_jurus_toya_detail,
                id_siswa,
                id_jurus_toya: item.id_jurus_toya,
                predikat: item.predikat
            }));

            await jurus_toya_siswa.bulkCreate(data);

            const total = data.length;
            const predikat10 = data.filter(i => i.predikat === 2).length;
            const predikat8 = data.filter(i => i.predikat === 1).length;

            const examResult10 = predikat10 * (100 / total);
            const examResult8 = predikat8 * (80 / total);
            const examResult = (examResult10 + examResult8)
            const result1 = {
                total: Number(examResult.toFixed(2)),
                plus: Number(examResult10.toFixed(2)),
                benar: Number(examResult8.toFixed(2))
            };

            await ukt_siswa.update(
                { jurus_toya: result1.total },
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
            id_jurus_toya_detail: req.params.id
        }
        let data = {
            id_penguji: req.body.id_penguji,
            id_event: req.body.id_event,
            tipe_ukt: req.body.tipe_ukt,
            name: req.body.name
        }
        jurus_toya_detail.update(data, { where: param })
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
            id_jurus_toya_detail: req.params.id
        }
        jurus_toya_detail.destroy({ where: param })
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