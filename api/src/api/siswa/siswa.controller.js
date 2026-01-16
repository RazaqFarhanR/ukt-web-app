const fs = require("fs");
const csv = require('csv-parser');
const ExcelJS = require('exceljs');
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
    controllerGetCountSiswa: async (req, res) => {
        try {
            const result = await siswa.findAll({
                attributes: [
                    'id_ranting',
                    [
                        Sequelize.literal(
                            `SUM(CASE WHEN active = true THEN 1 ELSE 0 END)`
                        ),
                        'count_active'
                    ],
                    [
                        Sequelize.literal(
                            `SUM(CASE WHEN active = false THEN 1 ELSE 0 END)`
                        ),
                        'count_disabled'
                    ]
                ],
                group: ['id_ranting']
            })

            res.json({
                count: result.length,
                data: result
            })
        } catch (error) {
            res.json({ message: error.message })
        }
    },
    controllerDisabledById: async (req, res) => {
        try {
            const { id, tipe } = req.body;
            const data = tipe == 'individu' ? {
                id_siswa: id
            } : { id_event: id }
            const [updated] = await siswa.update(
                { active: 0 },
                { where: data }
            );
            if (updated === 0) {
                return res.status(404).json({
                    message: "Siswa not found"
                });
            }

            res.status(200).json({
                message: `Siswa disabled successfully`,
                id
            });
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    },
    controllerActivatedById: async (req, res) => {
        try {
            const { id, tipe } = req.body;
            const data = tipe == 'individu' ? {
                id_siswa: id
            } : { id_event: id }
            const [updated] = await siswa.update(
                { active: 1 },
                { where: data }
            );
            if (updated === 0) {
                return res.status(404).json({
                    message: "Siswa not found"
                });
            }

            res.status(200).json({
                message: `Siswa disabled successfully`,
                id
            });
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    },
    controllerGetCountSiswaTipeRantingbyEvent: async (req, res) => {
        try {
            const tipe = req.params.tipe
            const ranting = req.params.ranting
            const result = await siswa.findAll({
                where: {
                    tipe_ukt: tipe,
                    id_ranting: ranting
                },
                attributes: [
                    'id_event',
                    [
                        Sequelize.literal(
                            `SUM(CASE WHEN active = true THEN 1 ELSE 0 END)`
                        ),
                        'count_active'
                    ],
                    [
                        Sequelize.literal(
                            `SUM(CASE WHEN active = false THEN 1 ELSE 0 END)`
                        ),
                        'count_disabled'
                    ]
                ],
                include: [
                    {
                        model: event,
                        as: "siswa_event",
                        attributes: ['name'],
                        required: false
                    }
                ],
                group: ['id_event']
            })

            res.json({
                count: result.length,
                data: result
            })
        } catch (error) {
            res.json({ message: error.message })
        }
    },
    controllerGetCountSiswaTipe: async (req, res) => {
        try {
            const tipe = req.params.tipe

            const result = await siswa.findAll({
                where: {
                    tipe_ukt: tipe
                },
                attributes: [
                    'id_ranting',

                    [
                        Sequelize.literal(
                            `SUM(CASE WHEN siswa.active = true THEN 1 ELSE 0 END)`
                        ),
                        'count_active'
                    ],

                    [
                        Sequelize.literal(
                            `SUM(CASE WHEN siswa.active = false THEN 1 ELSE 0 END)`
                        ),
                        'count_disabled'
                    ],
                ],
                include: [
                    {
                        model: event,
                        as: 'siswa_event',
                        attributes: [],
                        required: false
                    }
                ],
                group: ['siswa.id_ranting']
            })
            const eventCount = await event.findAll({
                where: { tipe_ukt: tipe },
                attributes: ['id_ranting',
                    [Sequelize.fn('COUNT',
                        Sequelize.fn('DISTINCT', Sequelize.col('id_event'))),
                        'count_event']],
                group: ['id_ranting']
            })
            const ranting = await models.ranting.findAll({
                attributes: ['id_ranting']
            })
            const siswaData = result.map(r => r.get({ plain: true }))
            const eventData = eventCount.map(e => e.get({ plain: true }))
            const rantingData = ranting.map(r => r.get({ plain: true }))

            // merge based on ranting
            const dataResult = rantingData.map(rantingRow => {
                const matchSiswa = siswaData.find(s => s.id_ranting === rantingRow.id_ranting)
                const matchEvent = eventData.find(e => e.id_ranting === rantingRow.id_ranting)

                return {
                    id_ranting: rantingRow.id_ranting,
                    count_active: matchSiswa ? matchSiswa.count_active : 0,
                    count_disabled: matchSiswa ? matchSiswa.count_disabled : 0,
                    count_event: matchEvent ? matchEvent.count_event : 0
                }
            })

            res.json({
                count: dataResult.length,
                data: dataResult
            })


        } catch (error) {
            res.json({ message: error.message })
        }
    },
    controllerGetByEvent: async (req, res) => {
        siswa.findAll({
            where: {
                id_event: req.params.id
            },
            attributes: ['id_siswa', 'nomor_urut', 'name', 'rayon', 'jenis_kelamin', 'jenis_latihan', 'active'],
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
    controllerGetByEventSearchName: async (req, res) => {
        siswa.findAll({
            where: {
                id_event: req.params.id,
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: `%${req.params.name}%`
                        }
                    },
                    {
                        nomor_urut: {
                            [Op.like]: `%${req.params.name}%`
                        }
                    }
                ]
            },
            attributes: ['id_siswa', 'nomor_urut', 'name', 'rayon', 'jenis_kelamin', 'jenis_latihan'],
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
                    if (result.id_role === "siswa" && result.active === true) {
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
                        res.status(404).json({ message: "Kamu Bukan Siswa berwenang" });
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
    controllerExcel: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'File is required' });
            }

            const filePath = localStorage + req.file.filename;
            const workbook = new ExcelJS.Workbook();

            await workbook.xlsx.readFile(filePath);

            const worksheet = workbook.getWorksheet(1); // first sheet
            const rows = worksheet.getRows(2, worksheet.rowCount - 1);

            const bulkData = await Promise.all(
                rows
                    .filter(row => row && row.getCell(1).value)
                    .map(async (row) => {
                        let dataKelamin = '';
                        if (String(row.getCell(3).value) === 'L') {
                            dataKelamin = 'Laki laki';
                        } else if (String(row.getCell(3).value) === 'P') {
                            dataKelamin = 'Perempuan';
                        }
                        let peserta = String(row.getCell(4).value).trim() + ' - ' + dataKelamin
                        return {
                            id_event: req.body.id_event,
                            tipe_ukt: req.body.tipe_ukt,
                            nomor_urut: String(row.getCell(1).value).trim(),
                            name: String(row.getCell(2).value || '').trim(),
                            id_role: 'siswa',
                            jenis_kelamin: dataKelamin,
                            jenis_latihan: String(row.getCell(4).value).trim(),
                            peserta: peserta,
                            id_ranting: String(row.getCell(5).value || '').trim(),
                            id_cabang: 'jatim',
                            rayon: String(row.getCell(6).value).trim(),
                            tingkatan: String(row.getCell(7).value).trim(),
                            active: true,
                        };
                    })
            );

            if (bulkData.length === 0) {
                return res.status(400).json({ message: 'No valid data found in Excel' });
            }

            // Batch insert (FAST)
            await siswa.bulkCreate(bulkData, {
                validate: true,
                individualHooks: false
            });

            // Delete uploaded file
            fs.unlink(filePath, (err) => {
                if (err) console.error('Failed to delete excel:', err);
            });

            res.json({
                message: 'Excel data successfully inserted',
                total: bulkData.length
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: error.message
            });
        }
    },
    controllerDownloadTemplateExcel: async (req, res) => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Template Siswa');

            // Define columns (header + width)
            worksheet.columns = [
                { header: 'Nomor Urut', key: 'nomor_urut', width: 20 },
                { header: 'Name', key: 'name', width: 25 },
                { header: 'Jenis Kelamin', key: 'jenis_kelamin', width: 25 },
                { header: 'Jenis Latihan', key: 'jenis_latihan', width: 25 },
                { header: 'Ranting', key: 'id_ranting', width: 15 },
                { header: 'Rayon', key: 'rayon', width: 20 },
                { header: 'tingkatan', key: 'tingkatan', width: 20 },
            ];

            // Style header row
            worksheet.getRow(1).font = { bold: true };
            worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

            // Sample row with defaults
            worksheet.addRow({
                nomor_urut: '',
                name: '',
                jenis_kelamin: 'L / P',
                jenis_latihan: 'Privat / Remaja',
                id_ranting: '',
                rayon: '',
                tingkatan: '',
            });

            // Set response headers
            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader(
                'Content-Disposition',
                'attachment; filename=template_penguji.xlsx'
            );

            // Send workbook
            await workbook.xlsx.write(res);
            res.end();

        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
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