const models = require('../../../../models/index');
const senam_detail = models.senam_detail;
const senam_siswa = models.senam_siswa;
const ukt_siswa = models.ukt_siswa;

module.exports = {
    controllerGetAll: async (req, res) => {
        senam_detail.findAll()
            .then(senam_detail => {
                res.json({
                    count: senam_detail.length,
                    data: senam_detail
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetByTipeUkt: async (req, res) => {
        senam_detail.findAll({
            where: {
                tipe_ukt: req.params.id
            },
            attributes: ['id_senam_detail', 'id_penguji', 'id_event', 'id_siswa', 'tipe_ukt'],
            include: [
                {
                    model: models.siswa,
                    attributes: ['name'],
                    as: "senam_siswa",
                },
                {
                    model: models.penguji,
                    attributes: ['name'],
                    as: "penguji_senam"
                },
                {
                    model: models.senam_siswa,
                    attributes: ['id_senam', 'predikat'],
                    as: "siswa_senam_detail",
                    include: [
                        {
                            model: models.senam,
                            attributes: ['name'],
                            as: "siswa_senam"
                        }
                    ]
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
    },
    controllerGetByUktEvent: async (req, res) => {
        senam_detail.findAll({
            where: {
                id_event: req.params.event,
            },
            attributes: ['id_senam_detail', 'id_penguji', 'id_event', 'id_siswa', 'tipe_ukt'],
            include: [
                {
                    model: models.siswa,
                    attributes: ['name', 'nomor_urut','id_ranting'],
                    as: "senam_siswa",
                    where: {
                        id_ranting: req.params.ranting
                    }
                },
                {
                    model: models.penguji,
                    attributes: ['name'],
                    as: "penguji_senam"
                },
                {
                    model: models.senam_siswa,
                    attributes: ['id_senam', 'predikat'],
                    as: "siswa_senam_detail",
                    required: true,
                    include: [
                        {
                            model: models.senam,
                            attributes: ['name'],
                            as: "siswa_senam"
                        }
                    ]
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
    },
    controllerGetByIdSiswa: async (req, res) => {
        senam_detail.findAll({
            attributes: ['id_senam_detail', 'id_siswa', 'id_senam', 'predikat'],
            where: {
                id_siswa: req.params.id
            },
            include: [
                {
                    model: models.senam,
                    attributes: ['name', 'tipe_ukt'],
                    as: "siswa_senam",
                    required: false
                }
            ]
        })
            .then(senam => {
                console.log(senam[0].predikat)
                const nilai = []
                for (let i = 0; i < senam.length; i++) {
                    if (senam[i].predikat == true) {
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
    },
    controllerAdd: async (req, res) => {
        let data = {
            id_penguji: req.body.id_penguji,
            id_event: req.body.id_event,
            id_siswa: req.body.id_siswa,
            tipe_ukt: req.body.tipe_ukt
        }
        senam_detail.create(data)
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
            const processDetail = await senam_detail.create(detail)
            // mapping array ujian jadi banyak row
            const data = ujian.map(item => ({
                id_senam_detail: processDetail.id_senam_detail,
                id_siswa,
                id_senam: item.id_senam,
                predikat: item.predikat
            }));

            await senam_siswa.bulkCreate(data);

            const total = data.length;
            const predikat10 = data.filter(i => i.predikat === 2).length;
            const predikat8 = data.filter(i => i.predikat === 1).length;

            const examResult10 = predikat10 * (100 / total);
            const examResult8 = predikat8 * (80 / total);
            const examResult = (examResult10 + examResult8);
            const result1 = {
                total: Number(examResult.toFixed(2)),
                plus: Number(examResult10.toFixed(2)),
                benar: Number(examResult8.toFixed(2))
            };

            await ukt_siswa.update(
                { senam: result1.total },
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
            id_senam_detail: req.params.id
        }
        let data = {
            id_penguji: req.body.id_penguji,
            id_event: req.body.id_event,
            tipe_ukt: req.body.tipe_ukt,
            name: req.body.name
        }
        senam_detail.update(data, { where: param })
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
            id_senam_detail: req.params.id
        }
        senam_detail.destroy({ where: param })
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