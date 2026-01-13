const fs = require("fs");
const csv = require('csv-parser');
const { Sequelize, Op } = require("sequelize");
const localStorage = process.env.LOCAL_STORAGE + "/";

const jwt = require("jsonwebtoken");

const models = require('../../models/index');
const siswa = models.siswa;
const ranting = models.ranting
const event = models.event;

module.exports = {
    controllerGetAll: async (req, res) => {
        siswa.findAll({
            include: [
                {
                    model: ranting,
                    as: "siswa_ranting",
                    attributes: ['name'],
                    required: false,
                },
                {
                    model: event,
                    as: "siswa_event",
                    attributes: ['name'],
                    required: false
                },
            ]
        })
            .then(siswa => {
                res.json({
                    count: siswa.length,
                    data: siswa
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetCount: async (req, res) => {
        siswa.findAll({
            attributes: ['id_ranting', [Sequelize.fn('COUNT', Sequelize.col('id_ranting')), 'count']],
            group: ['id_ranting']
        })
            .then(result => {
                res.json({
                    count: result.length,
                    data: result
                });
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetByEvent: async (req, res) => {
        siswa.findAll({
            where: {
                id_event: req.params.id
            },
            attributes: ['id_siswa', 'nomor_urut', 'name', 'rayon', 'jenis_kelamin', 'jenis_latihan'],
            include: [
                {
                    model: event,
                    as: "siswa_event",
                    attributes: ['name'],
                    required: false
                },
            ]
        })
            .then(siswa => {
                res.json({
                    count: siswa.length,
                    data: siswa
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerDisabledByEvent: async (req, res) => {
        siswa.update(
            {
                active: 0   // <-- columns to update
            },
            {
                where: {
                    id_event: req.params.id
                }
            }
        )
            .then(item => {
                res.json({
                    message: "Siswa Updated Successfully"
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetByEventNew: async (req, res) => {
        siswa.findAll({
            where: {
                id_event: req.params.id
            },
            include: [
                {
                    model: ranting,
                    as: "siswa_ranting",
                    attributes: ['name'],
                    required: false,
                },
                {
                    model: event,
                    as: "siswa_event",
                    attributes: ['name'],
                    required: false
                },
            ]
        })
            .then(siswa => {
                res.json({
                    count: siswa.length,
                    data: siswa
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetByEventFiltered: async (req, res) => {
        let idEvent = req.params.id
        let action = req.params.action

        let whereClause = {
            id_event: idEvent
        };

        if (action == 'senam') {
            whereClause["$senam_siswa.id_siswa$"] = { [Op.is]: null };
        } else if (action == 'jurus') {
            whereClause["$jurus_siswa.id_siswa$"] = { [Op.is]: null };
        } else if (action == 'fisik') {
            whereClause["$siswa_fisik.id_siswa$"] = { [Op.is]: null };
        } else if (action == 'teknik') {
            whereClause["$siswa_teknik.id_siswa$"] = { [Op.is]: null };
        } else if (action == 'sambung') {
            whereClause["$sambung_siswa.id_siswa$"] = { [Op.is]: null };
        }
        siswa.findAll({
            include: [
                {
                    model: ranting,
                    as: "siswa_ranting",
                    attributes: ['name'],
                    required: false,
                },
                {
                    model: event,
                    as: "siswa_event",
                    attributes: ['name'],
                    required: false
                },
                {
                    model: models.senam_detail,
                    as: "senam_siswa",
                    required: false,
                    attributes: ['id_siswa']
                },
                {
                    model: models.jurus_detail,
                    as: "jurus_siswa",
                    required: false,
                    attributes: ['id_siswa']
                },
                {
                    model: models.fisik,
                    as: "siswa_fisik",
                    required: false,
                    attributes: ['id_siswa']
                },
                {
                    model: models.teknik_detail,
                    as: "siswa_teknik",
                    required: false,
                    attributes: ['id_siswa']
                },
                {
                    model: models.detail_sambung,
                    as: "sambung_siswa",
                    required: false,
                    attributes: ['id_siswa']
                },
            ],
            where: whereClause,
            order: [
                ['nomor_urut', 'ASC']
            ]
        })
            .then(siswa => {
                res.json({
                    count: siswa.length,
                    data: siswa
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetByRantingEventFiltered: async (req, res) => {
        const id_event = req.params.idEvent
        const id_ranting = req.params.id
        const action = req.params.action
        let whereClause = {
            id_event: id_event,
            id_ranting: id_ranting
        };

        if (action == 'senam') {
            whereClause["$senam_siswa.id_siswa$"] = { [Op.is]: null };
        } else if (action == 'jurus') {
            whereClause["$jurus_siswa.id_siswa$"] = { [Op.is]: null };
        } else if (action == 'fisik') {
            whereClause["$siswa_fisik.id_siswa$"] = { [Op.is]: null };
        } else if (action == 'teknik') {
            whereClause["$siswa_teknik.id_siswa$"] = { [Op.is]: null };
        } else if (action == 'sambung') {
            whereClause["$sambung_siswa.id_siswa$"] = { [Op.is]: null };
        }
        siswa
            .findAll({
                include: [
                    {
                        model: ranting,
                        as: "siswa_ranting",
                        attributes: ['name'],
                        required: false,
                    },
                    {
                        model: event,
                        as: "siswa_event",
                        attributes: ['name'],
                        required: false
                    },
                    {
                        model: models.senam_detail,
                        as: "senam_siswa",
                        required: false,
                        attributes: ['id_siswa']
                    },
                    {
                        model: models.jurus_detail,
                        as: "jurus_siswa",
                        required: false,
                        attributes: ['id_siswa']
                    },
                    {
                        model: models.fisik,
                        as: "siswa_fisik",
                        required: false,
                        attributes: ['id_siswa']
                    },
                    {
                        model: models.teknik_detail,
                        as: "siswa_teknik",
                        required: false,
                        attributes: ['id_siswa']
                    },
                    {
                        model: models.detail_sambung,
                        as: "sambung_siswa",
                        required: false,
                        attributes: ['id_siswa']
                    },
                ],

                where: whereClause
            })
            .then((siswa) => {
                res.json({
                    count: siswa.length,
                    data: siswa,
                });
            })
            .catch((error) => {
                res.json({
                    message: error.message,
                });
            });
    },
    controllerGetByRanting: async (req, res) => {
        const id_ranting = req.params.id;
        siswa
            .findAll({
                where: {
                    id_ranting: id_ranting
                },
                include: [
                    {
                        model: ranting,
                        as: "siswa_ranting",
                        attributes: ['name'],
                        required: false,
                    },
                    {
                        model: event,
                        as: "siswa_event",
                        attributes: ['name'],
                        required: false
                    },
                ]
            })
            .then((siswa) => {
                res.json({
                    count: siswa.length,
                    data: siswa,
                });
            })
            .catch((error) => {
                res.json({
                    message: error.message,
                });
            });
    },
    controllerGetSearchFiltered: async (req, res) => {
        const id_event = req.params.idEvent
        const name = req.params.name
        const action = req.params.action
        let whereClause = {
            id_event: id_event,
            [Op.or]: [
                {
                    name: {
                        [Op.like]: `%${name}%`
                    }
                },
                {
                    nomor_urut: {
                        [Op.like]: `%${name}%`
                    }
                }
            ]
        };

        if (action == 'senam') {
            whereClause["$senam_siswa.id_siswa$"] = { [Op.is]: null };
        } else if (action == 'jurus') {
            whereClause["$jurus_siswa.id_siswa$"] = { [Op.is]: null };
        } else if (action == 'fisik') {
            whereClause["$siswa_fisik.id_siswa$"] = { [Op.is]: null };
        } else if (action == 'teknik') {
            whereClause["$siswa_teknik.id_siswa$"] = { [Op.is]: null };
        } else if (action == 'sambung') {
            whereClause["$sambung_siswa.id_siswa$"] = { [Op.is]: null };
        }
        siswa
            .findAll({
                include: [
                    {
                        model: ranting,
                        as: "siswa_ranting",
                        attributes: ['name'],
                        required: false,
                    },
                    {
                        model: event,
                        as: "siswa_event",
                        attributes: ['name'],
                        required: false
                    },
                    {
                        model: models.senam_detail,
                        as: "senam_siswa",
                        required: false,
                        attributes: ['id_siswa']
                    },
                    {
                        model: models.jurus_detail,
                        as: "jurus_siswa",
                        required: false,
                        attributes: ['id_siswa']
                    },
                    {
                        model: models.fisik,
                        as: "siswa_fisik",
                        required: false,
                        attributes: ['id_siswa']
                    },
                    {
                        model: models.teknik_detail,
                        as: "siswa_teknik",
                        required: false,
                        attributes: ['id_siswa']
                    },
                    {
                        model: models.detail_sambung,
                        as: "sambung_siswa",
                        required: false,
                        attributes: ['id_siswa']
                    },
                ],

                where: whereClause
            })
            .then((siswa) => {
                res.json({
                    count: siswa.length,
                    data: siswa,
                });
            })
            .catch((error) => {
                res.json({
                    message: error.message,
                });
            });
    },
    controllerGetSearch: async (req, res) => {
        siswa.findAll({
            where: {
                name: {
                    [Op.like]: '%' + req.body.name + '%'
                }
            },
            include: [
                {
                    model: ranting,
                    as: "siswa_ranting",
                    attributes: ['name'],
                    required: false,
                },
                {
                    model: event,
                    as: "siswa_event",
                    attributes: ['name'],
                    required: false
                },
            ]
        })
            .then((result) => {
                res.json({
                    data: result
                })
            })
            .catch(e => {
                res.json({
                    message: e.message
                })
            })
    },
    controllerAdd: async (req, res) => {
        let data = {
            id_event: req.body.id_event,
            nomor_urut: req.body.nomor_urut,
            name: req.body.name,
            id_role: req.body.id_role,
            jenis_kelamin: req.body.jenis_kelamin,
            jenis_latihan: req.body.jenis_latihan,
            peserta: req.body.jenis_latihan + " - " + req.body.jenis_kelamin,
            tipe_ukt: req.body.tipe_ukt,
            id_ranting: req.body.id_ranting,
            rayon: req.body.rayon,
            tingkatan: req.body.tingkatan,
        }
        siswa.create(data)
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
    controllerAuth: async (req, res) => {
        let param = {
            nomor_urut: req.body.nomor_urut,
            id_event: req.body.id_event
        }

        if (req.body.id_ranting) {
            param.id_ranting = req.body.id_ranting
        }
        siswa.findOne({
            where: param
        })
            .then(async (result) => {
                if (result) {
                    //set payload from data
                    // console.log(result)
                    const data = result
                    if (result.id_role === "siswa") {
                        const idUser = result.id_user;
                        const role = result.id_role;

                        // generate token based on payload and secret_key
                        let localToken = jwt.sign({ idUser, role }, process.env.ACCESS_TOKEN_SECRET);
                        res.json({
                            logged: true,
                            data: data,
                            token: localToken,
                        });

                    } else {
                        res.status(404).json({ message: "Kamu Bukan Penguji" });
                    }
                } else {
                    //tidak ditemukan
                    res.json({
                        logged: false,
                        message: "Invalid username or password",
                    });
                }
            })
            .catch(e => {
                res.json({
                    message: e.message
                })
            })
    },
    controllerAddByCsv: async (req, res) => {
        let results = []
        fs.createReadStream(localStorage + req.file.filename)
            .pipe(csv({ headers: false }))
            .on('data', (data) => results.push(data))
            .on('end', () => {
                const promises = [];

                for (const data of results) {
                    const values = Object.values(data);
                    let dataKelamin = '';
                    if (values[2] === 'L') {
                        dataKelamin = 'Laki laki';
                    } else if (values[2] === 'P') {
                        dataKelamin = 'Perempuan';
                    }
                    const idRole = 'siswa';
                    const newData = {
                        id_event: req.body.id_event,
                        nomor_urut: values[0],
                        name: values[1],
                        id_role: idRole,
                        jenis_kelamin: dataKelamin,
                        jenis_latihan: values[3],
                        peserta: values[3] + ' - ' + dataKelamin,
                        tipe_ukt: req.body.tipe_ukt,
                        id_ranting: values[4],
                        rayon: values[5],
                        tingkatan: values[6],
                    };
                    // console.log(newData);
                    promises.push(siswa.create(newData));
                }

                Promise.all(promises)
                    .then(() => {
                        const csvPath = localStorage + req.file.filename;
                        fs.unlink(csvPath, (err) => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            console.log('csv deleted successfully');
                        })
                        res.json({ message: 'Data has been inserted' })
                    })
                    .catch((error) => {
                        res.json({ message: error.message })
                    })
            });
    },
    controllerEdit: async (req, res) => {
        let param = {
            id_siswa: req.params.id
        }
        let data = {
            id_event: req.body.id_event,
            nomor_urut: req.body.nomor_urut,
            name: req.body.name,
            id_role: req.body.id_role,
            jenis_kelamin: req.body.jenis_kelamin,
            jenis_latihan: req.body.jenis_latihan,
            peserta: req.body.jenis_latihan + " - " + req.body.jenis_kelamin,
            tipe_ukt: req.body.tipe_ukt,
            id_ranting: req.body.id_ranting,
            rayon: req.body.rayon,
            tingkatan: req.body.tingkatan,
        }
        siswa.update(data, { where: param })
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
            id_siswa: req.params.id
        }
        siswa.destroy({ where: param })
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