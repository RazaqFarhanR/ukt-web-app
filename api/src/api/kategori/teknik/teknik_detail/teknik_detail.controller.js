const models = require('../../../../models/index');
const teknik_detail = models.teknik_detail;
const teknik_siswa = models.teknik_siswa;
const ukt_siswa = models.ukt_siswa

module.exports = {
    controllerGetAll: async (req, res) => {
        teknik_detail.findAll()
            .then(teknik_detail => {
                res.json({
                    count: teknik_detail.length,
                    data: teknik_detail
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerSearch: async (req, res) => {
        teknik_detail.findAll({
            include: [
                {
                    model: models.siswa,
                    as: "teknik_siswa",
                    attributes: ['nomor_urut', 'name'],
                    where: {
                        [Op.or]: [
                            { name: { [Op.like]: `%${req.params.id}%` } },
                            { nomor_urut: { [Op.like]: `%${req.params.id}%` } }
                        ]
                    }
                },
            ]
        })
            .then(result => {
                res.json({
                    count: result.length,
                    data: result
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetByTipeUkt: async (req, res) => {
        teknik_detail.findAll({
            where: {
                tipe_ukt: req.params.id
            },
            attributes: ['id_teknik_detail', 'id_penguji', 'id_event', 'id_siswa', 'tipe_ukt'],
            include: [
                {
                    model: models.siswa,
                    attributes: ['name'],
                    as: "teknik_siswa",
                },
                {
                    model: models.penguji,
                    attributes: ['name'],
                    as: "penguji_teknik"
                },
                {
                    model: models.teknik_siswa,
                    attributes: ['id_teknik', 'predikat'],
                    as: "siswa_teknik_detail",
                    include: [
                        {
                            model: models.teknik,
                            attributes: ['name'],
                            as: "siswa_teknik",
                        }
                    ],
                    order: [['id_teknik', 'ASC']]
                }
            ],
        })
            .then(teknik => {
                res.json({
                    count: teknik.length,
                    data: teknik
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
    controllerGetByUktEvent: async (req, res) => {
        const { id, page, limit } = req.params;
        const pageNumber = Number(page);
        const itemsPerPage = Number(limit);

        const offset = (pageNumber - 1) * itemsPerPage;
        teknik_detail.findAll({
            where: {
                id_event: id
            },
            attributes: ['id_teknik_detail', 'id_penguji', 'id_event', 'id_siswa', 'tipe_ukt'],
            include: [
                {
                    model: models.siswa,
                    attributes: ['name', 'nomor_urut'],
                    as: "teknik_siswa",
                    require: true
                },
                {
                    model: models.penguji,
                    attributes: ['name'],
                    as: "penguji_teknik"
                },
                {
                    model: models.teknik_siswa,
                    attributes: ['id_teknik', 'predikat'],
                    as: "siswa_teknik_detail",
                    include: [
                        {
                            model: models.teknik,
                            attributes: ['id_teknik', 'name'],
                            as: "siswa_teknik",
                        }
                    ],
                    order: [['id_teknik', 'DESC']]
                }
            ],
            limit: itemsPerPage,
            offset: offset
        })
            .then(teknik => {
                res.json({
                    count: teknik.length,
                    data: teknik
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetByEvent: async (req, res) => {
        const { id } = req.params;
        teknik_detail.findAll({
            where: {
                id_event: id
            },
            attributes: ['id_teknik_detail', 'id_penguji', 'id_event', 'id_siswa', 'tipe_ukt'],
            include: [
                {
                    model: models.siswa,
                    attributes: ['name', 'nomor_urut'],
                    as: "teknik_siswa",
                    require: true,
                    where: {
                        id_ranting: req.params.ranting
                    }
                },
                {
                    model: models.penguji,
                    attributes: ['name'],
                    as: "penguji_teknik"
                },
                {
                    model: models.teknik_siswa,
                    attributes: ['id_teknik', 'predikat'],
                    as: "siswa_teknik_detail",
                    include: [
                        {
                            model: models.teknik,
                            attributes: ['id_teknik', 'name'],
                            as: "siswa_teknik",
                        }
                    ],
                    order: [['id_teknik', 'DESC']]
                }
            ],
        })
            .then(teknik => {
                res.json({
                    count: teknik.length,
                    data: teknik
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetByIdSiswa: async (req, res) => {
        teknik_detail.findAll({
            attributes: ['id_teknik_detail', 'id_siswa', 'id_teknik', 'predikat'],
            where: {
                id_siswa: req.params.id
            },
            include: [
                {
                    model: models.teknik,
                    attributes: ['name', 'tipe_ukt'],
                    as: "siswa_teknik",
                    required: false
                }
            ]
        })
            .then(teknik => {
                console.log(teknik[0].predikat)
                const nilai = []
                for (let i = 0; i < teknik.length; i++) {
                    if (teknik[i].predikat == true) {
                        nilai.push('true');
                    }
                }
                console.log(nilai.length);
                res.json({
                    count: teknik.length,
                    teknik_benar: nilai.length,
                    data: teknik
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerAddExam: async (req, res) => {
        const { id_penguji, id_event, id_siswa, tipe_ukt, newData } = req.body
        let data = {
            id_penguji,
            id_event,
            id_siswa,
            tipe_ukt,
        }
        const processDetail = await teknik_detail.create(data)
        const dataSiswa = ujian.map(item => ({
            id_teknik_detail: processDetail.id_teknik_detail,
            id_siswa,
            id_teknik: item.id_teknik,
            predikat: item.predikat
        }));

        await teknik_siswa.bulkCreate(dataSiswa)
        const baik = newData.filter(i => i.predikat === "BAIK").length
        const cukup = newData.filter(i => i.predikat === "CUKUP").length
        const kurang = newData.filter(i => i.predikat === "KURANG").length

        // -- redefine nilai -- //
        const newBaik = baik.length * 3;
        const newCukup = cukup.length * 2;
        const newKurang = kurang.length;
        // -- ukt siswa  -- //
        const nilaiUkt = newBaik + newCukup + newKurang;
        await ukt_siswa.update(
            {
                teknik: nilaiUkt
            },
            {
                where: {
                    id_siswa
                }
            }
        )
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
    controllerAdd: async (req, res) => {
        let data = {
            id_penguji: req.body.id_penguji,
            id_event: req.body.id_event,
            id_siswa: req.body.id_siswa,
            tipe_ukt: req.body.tipe_ukt
        }
        teknik_detail.create(data)
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
            id_teknik_detail: req.params.id
        }
        let data = {
            id_penguji: req.body.id_penguji,
            id_event: req.body.id_event,
            tipe_ukt: req.body.tipe_ukt,
            name: req.body.name
        }
        teknik_detail.update(data, { where: param })
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
            id_teknik_detail: req.params.id
        }
        teknik_detail.destroy({ where: param })
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