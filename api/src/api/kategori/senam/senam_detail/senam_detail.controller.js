const models = require('../../../../models/index');
const senam_detail = models.senam_detail;

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
                tipe_ukt: req.params.id,
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