const models = require('../../../../models/index');
const fisik = models.fisik;
const { Op } = require('sequelize');


module.exports = {
    controllerGetAll: async (req, res) => {
        fisik.findAll({
            include: [
                {
                    model: models.siswa,
                    as: "siswa_fisik",
                    attributes: ['name']
                },
                {
                    model: models.penguji,
                    as: "penguji_fisik",
                    attributes: ['name']
                }
            ]
        })
            .then(fisik => {
                res.json({
                    count: fisik.length,
                    data: fisik
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerSearch: async (req, res) => {
        fisik.findAll({
            include: [
                {
                    model: models.siswa,
                    as: "siswa_fisik",
                    attributes: ['nomor_urut','name'],
                    where: {
                        [Op.or]: [
                            { name: { [Op.like]: `%${req.params.id}%` } },
                            { nomor_urut: { [Op.like]: `%${req.params.id}%` } }
                        ]
                    }
                },
            ]
        })
            .then(fisik => {
                res.json({
                    count: fisik.length,
                    data: fisik
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetTotalPage: async (req, res) => {
        const limit = Number(req.params.limit);
        fisik.findAll({
            where: {
                id_event: req.params.id
            },
            attributes: ['id_fisik']
        })
            .then(result => {
                const totalPages = Math.ceil(result.length / limit);
                res.json({ totalPages });
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetByEvent: async (req, res) => {
        const { id, page, limit } = req.params;
        const pageNumber = Number(page);
        const itemsPerPage = Number(limit);

        const offset = (pageNumber - 1) * itemsPerPage;

        console.log(pageNumber)
        console.log(itemsPerPage);

        fisik.findAll({
            include: [
                {
                    model: models.siswa,
                    as: "siswa_fisik",
                    attributes: ['name']
                },
                {
                    model: models.penguji,
                    as: "penguji_fisik",
                    attributes: ['name']
                }
            ],
            where: {
                id_event: id
            },
            limit: itemsPerPage,
            offset: offset
        })
            .then(fisik => {
                res.json({
                    count: fisik.length,
                    data: fisik
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetByUkt: async (req, res) => {
        fisik.findAll({
            where: {
                tipe_ukt: req.params.id
            },
            include: [
                {
                    model: models.siswa,
                    as: "siswa_fisik",
                    attributes: ['name']
                },
                {
                    model: models.penguji,
                    as: "penguji_fisik",
                    attributes: ['name']
                }
            ]
        })
            .then(fisik => {
                res.json({
                    count: fisik.length,
                    data: fisik
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetByUktEvent: async (req, res) => {
        fisik.findAll({
            where: {
                tipe_ukt: req.params.id,
                id_event: req.params.event
            },
            include: [
                {
                    model: models.siswa,
                    as: "siswa_fisik",
                    attributes: ['name', 'nomor_urut']
                },
                {
                    model: models.penguji,
                    as: "penguji_fisik",
                    attributes: ['name']
                }
            ]
        })
            .then(fisik => {
                res.json({
                    count: fisik.length,
                    data: fisik
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
            tipe_ukt: req.body.tipe_ukt,
            mft: req.body.mft,
            push_up: req.body.push_up,
            spir_perut_atas: req.body.spir_perut_atas,
            spir_perut_bawah: req.body.spir_perut_bawah,
            spir_dada: req.body.spir_dada,
            spir_paha: req.body.spir_paha,
            plank: req.body.plank,
        }
        fisik.create(data)
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
            id_fisik: req.params.id
        }
        let data = {
            id_penguji: req.body.id_penguji,
            id_event: req.body.id_event,
            id_siswa: req.body.id_siswa,
            tipe_ukt: req.body.tipe_ukt,
            mft: req.body.mft,
            push_up: req.body.push_up,
            spir_perut_atas: req.body.spir_perut_atas,
            spir_perut_bawah: req.body.spir_perut_bawah,
            spir_dada: req.body.spir_dada,
            spir_paha: req.body.spir_paha,
            plank: req.body.plank,
        }
        fisik.update(data, { where: param })
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
            id_fisik: req.params.id
        }
        fisik.destroy({ where: param })
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