const models = require('../../models/index');
const session = models.session;
const ukt_siswa = models.ukt_siswa;
const lembar_soal = models.lembar_soal;
const lembar_jawaban = models.lembar_jawaban;
const ranting = models.ranting;
const kunci_soal = models.kunci_soal;

const { Sequelize, Op } = require("sequelize");

// Logger utility for development. Disables automatically in production 
// or if ENABLE_EXAM_LOGS is explicitly set to false.
const ENABLE_LOGS = process.env.NODE_ENV !== 'production' && process.env.ENABLE_EXAM_LOGS !== 'false';
const logger = (...args) => {
    if (ENABLE_LOGS) {
        console.log('[EXAM_LOG]', ...args);
    }
};

module.exports = {
    controllerGetAll: async (req, res) => {
        session.findAll()
            .then(session => {
                res.json({
                    count: session.length,
                    data: session
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
        session.findAll({
            where: {
                id_event: req.params.id
            },
            include: [
                {
                    model: models.siswa,
                    attributes: ['id_siswa'],                                                                           
                    as: "keshan_siswa",
                    where: {
                        id_ranting: req.params.ranting
                    }
                },
            ],
            attributes: ['id_session']
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

        session.findAll({
            where: {
                id_event: id
            },
            include: [
                {
                    model: models.siswa,
                    attributes: ['name', 'nomor_urut', 'id_ranting'],
                    as: "keshan_siswa",
                    where: {
                        id_ranting: req.params.ranting
                    }
                },
                {
                    model: models.lembar_jawaban,
                    as: "lembar_jawaban",
                    include: [
                        {
                            model: models.soal,
                            as: 'soal_ujian'
                        }
                    ]
                }
            ],

            limit: itemsPerPage,
            offset: offset,
        })
            .then(session => {
                res.json({
                    count: session.length,
                    data: session
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetById: async (req, res) => {
        let param = {
            id_lembar_soal: req.body?.id_lembar_soal,
            id_siswa: req.body.id_siswa
        }
        session.findOne({ where: param })
            .then(session => {
                res.json({
                    count: session.length,
                    data: session
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerCekKeSHan: async (req, res) => {
        let status = false
        let resData = []

        // get ukt siswa
        await ukt_siswa.findOne({
            where: {
                id_siswa: req.params.id
            },
            attributes: ['id_ukt_siswa', 'id_siswa', 'tipe_ukt', 'id_event','rayon', 'keshan'],
            order: []
        })
        .then(ukt_siswa => {
            if (ukt_siswa) {
                status = true
                resData = ukt_siswa
            }
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })

        // create ukt siswa
        if (status == false) {
            let data = {
                tipe_ukt: req.body.tipe_ukt,
                id_event: req.body.id_event,
                id_siswa: req.body.id_siswa,
                rayon: req.body.rayon,
            }
            ukt_siswa.create(data)
            .then(result => {
                res.json({
                    status: true,
                    message: "data has been inserted",
                    data: result
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
        } else {
            res.json({
                status: true,
                message: "data already exists",
                data: resData
            })
        }

    },
    controllerCekUjain: async (req, res) => {
        //cek session session
        //get soal ujian
        let soal=[]
        let lembarSoal
        let param = {
            tipe_ukt: req.body.tipe_ukt,
        }
        if (req.body.id_ranting) {
            param.id_ranting = req.body.id_ranting
        }
        let paramPaket
        if (req.body.tipe_ukt == 'ukcw') {
            const arrPaket = [1,2,3]
            paramPaket = arrPaket[Math.floor(Math.random() *3)];
            logger("Param paket:", paramPaket);
            await lembar_soal.findOne({
                where: param,
                attributes:['id_lembar_soal', 'id_ranting', 'tipe_ukt'],
                include: [
                    {
                        model: ranting,
                        as: "lembar_ranting",
                        attributes: ['name'],
                        required: false
                    },
                    {
                        model: models.soal,
                        where: {paket: paramPaket},
                        as: "lembar_soal_ujian",
                        order: [
                            Sequelize.fn('RAND')
                        ],
                        attributes: ['id_soal', 'paket'],
                        limit: 20
                    }
                ]
            })
            .then(res => {
                lembarSoal = res
                soal = JSON.parse(JSON.stringify(res.lembar_soal_ujian))
            })
            .catch(error => {
                return res.json({
                    message: error.message
                })
            })
        } else {
            await lembar_soal.findOne({
                where: param,
                attributes:['id_lembar_soal', 'id_ranting', 'tipe_ukt'],
                include: [
                    {
                        model: ranting,
                        as: "lembar_ranting",
                        attributes: ['name'],
                        required: false
                    },
                    {
                        model: models.soal,
                        as: "lembar_soal_ujian",
                        order: [
                            Sequelize.fn('RAND')
                        ],
                        attributes: ['id_soal', 'paket'],
                        limit: 20
                    }
                ]
            })
            .then(res => {
                lembarSoal = res
                soal = JSON.parse(JSON.stringify(res.lembar_soal_ujian))
                logger("Soal count:", soal.length);
            })
            .catch(error => {
                return res.json({
                    message: error.message
                })
            })
        }
        let sessionParam = {
            id_lembar_soal: lembarSoal.id_lembar_soal,
            id_siswa: req.body.id_siswa
        }
        const cekData = await session.findOne({ where: sessionParam })
        if (!cekData) {
            //create session
            //waktu session
            let start = new Date()
            let endDate = new Date()
            let setdetik = endDate.setMilliseconds((endDate.getMilliseconds()) + 600000)
            let end = new Date(setdetik)

            let data = {
                id_lembar_soal: lembarSoal.id_lembar_soal,
                id_siswa: req.body.id_siswa,
                id_event: req.body.id_event,
                nilai: 0,
                start: start,
                finish: end
            }
            let waktu = new Date(end).getTime() - new Date().getTime()
            let minute = (Math.floor((waktu / 1000 / 60) % 60))
            let second = (Math.floor((waktu / 1000) % 60))
            //create session
            const newSession = await session.create(data)
            .then(async result => {
                soal.forEach((element => {
                    element.id_session = result.id_session,
                    element.id_siswa = result.id_siswa
                }))
                await lembar_jawaban.bulkCreate(soal)
                .then(async jawab => {
                    let end = new Date(setdetik)
                    let time = {
                        start: start,
                        finish: end
                    }
                    await session.update(time,{where: {id_session: result.id_session}})
                    .then(last => {
                        res.json({
                            status: true,
                            message: "Exam begins",
                            data: result,
                            minute: minute,
                            second: second
                        })
                    })
                    .catch(error => {
                        return res.json({
                            status: false,
                            message: error.message
                        })
                    })
                })
                .catch(error => {
                    return res.json({
                        status: false,
                        message: error.message
                    })
                })
            })
            .catch(error => {
                return res.json({
                    status: false,
                    message: error.message
                })
            })
        } else {
            let waktu = Math.max(0, new Date(cekData.finish).getTime() - new Date().getTime());
            let minute = (Math.floor((waktu / 1000 / 60) % 60))
            let second = (Math.floor((waktu / 1000) % 60))
            res.json({
                status: true,
                message: "The exam has started",
                data: cekData,
                minute: minute,
                second: second
            })
        }
    },
    controllerGetSoal: async (req,res) => {
        const { page } = req.params;
        const pageNumber = Number(page);
        const itemsPerPage = Number(1);

        const offset = (pageNumber - 1) * itemsPerPage;
        await lembar_jawaban.findOne({
            where: {
                id_session: req.body.id_session,
                id_siswa: req.body.id_siswa
            },
            include:[
                {
                    model: models.soal,
                    as: "soal_ujian",
                    attributes: {exclude:['createdAt', 'updatedAt']}
                }
            ],
            // attributes:[],
            order: [
                ['createdAt', 'ASC']
            ],
            limit: 1,
            offset:offset
        })
        .then(soal =>{
            logger("Fetched page:", page);
            res.json({
                status: true,
                massege: "successfuly",
                data: soal ? soal.soal_ujian : null
            })
        })
        .catch(error => {
            return res.json({
                status: false,
                message: error.message
            })
        })
    },
    controllerKoreksi: async (req, res) => {
        try {
            const { id_session, id_siswa, id_ukt_siswa, jawaban } = req.body;
            if (!jawaban || !Array.isArray(jawaban)) {
                return res.json({ status: false, message: "Invalid data" });
            }

            const currentSession = await session.findOne({
                where: { id_session, id_siswa },
                attributes: ["id_lembar_soal"],
            });

            if (!currentSession) {
                return res.json({ status: false, message: "Session not found" });
            }

            const keys = await kunci_soal.findAll({
                where: {
                    id_soal: { [Op.in]: jawaban.map((j) => j.id_soal) },
                },
            });

            const keyMap = new Map(keys.map((k) => [k.id_soal, k.opsi]));

            let benar = 0;
            const updatePromises = [];

            for (const item of jawaban) {
                const correctOpsi = keyMap.get(item.id_soal);
                let status = "kosong";
                if (item.selectedOption) {
                    status = item.selectedOption === correctOpsi ? "benar" : "salah";
                }

                if (status === "benar") benar++;

                updatePromises.push(
                    lembar_jawaban.update(
                        { answer: status },
                        { where: { id_session, id_siswa, id_soal: item.id_soal } }
                    )
                );
            }

            await Promise.all(updatePromises);

            await ukt_siswa.update(
                { keshan: benar * 5 },
                { where: { id_ukt_siswa: id_ukt_siswa } }
            );

            res.json({
                status: true,
                message: "Correction completed successfully",
                score: benar * 5,
            });
        } catch (error) {
            res.json({ status: false, message: error.message });
        }
    },
    controllerSync: async (req, res) => {
        try {
            const { id_session, id_siswa, id_soal, selectedOption } = req.body;

            const key = await kunci_soal.findOne({ where: { id_soal } });
            if (!key) {
                return res.json({ status: false, message: "Question key not found" });
            }

            let status = "kosong";
            if (selectedOption) {
                status = selectedOption === key.opsi ? "benar" : "salah";
            }

            await lembar_jawaban.update(
                { answer: status },
                { where: { id_session, id_siswa, id_soal } }
            );

            res.json({ status: true, message: "Answer synced" });
        } catch (error) {
            res.json({ status: false, message: error.message });
        }
    },
    controllerAdd: async (req, res) => {
        let data = {
            id_lembar_soal: req.body.id_lembar_soal,
            id_siswa: req.body.id_siswa,
            id_event: req.body.id_event,
            nilai: req.body.nilai,
            waktu_pengerjaan: req.body.waktu_pengerjaan
        }
        session.create(data)
            .then(result => {
                res.json({
                    message: "data has been inserted",
                    data: data
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerTimer: async (req, res) => {
        let param = {
            id_lembar_soal: req.body.id_lembar_soal,
            id_siswa: req.body.id_siswa
        }

        session.findOne({ where: param })
            .then(result => {
                res.json({
                    message: "Ujian selesai",
                    data: result
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerStart: async (req, res) => {
        try {
            let start = new Date()
            let endDate = new Date()
            let setdetik = endDate.setMilliseconds((endDate.getMilliseconds()) + 600000)
            let end = new Date(setdetik)
                    
            //get lembar soal
            let lembarSoal = await lembar_soal.findOne({
                where: {tipe_ukt: req.body.tipe_ukt}
            })

            const id_lembar_soal = lembarSoal.id_lembar_soal
            const waktu = lembarSoal.waktu_pengerjaan
            
            let param = {
                id_lembar_soal: id_lembar_soal,
                id_siswa: req.body.id_siswa
            }
            let message
            let id_session 
            const cekData = await session.findOne({ where: param })
            if (!cekData) {
                let data = {
                    id_lembar_soal: id_lembar_soal,
                    id_siswa: req.body.id_siswa,
                    id_event: req.body.id_event,
                    nilai: 0,
                    start: start,
                    finish: end
                }
                session.create(data)
                    .then(res => {
                        message = "Ujian dimulai"
                        id_session = res.id_session
                    })
                    .catch(error => {
                        return res.json({
                            message: error.message
                        })
                    })
            } else {
                message = ("Ujian sudah dimulai")
                id_session = cekData.id_session
            }

            //get soal untuk ujian
            soal.findAll({
                where: {
                    id_lembar_soal: id_lembar_soal
                },
                order: [
                    Sequelize.fn('RAND')
                ],
                limit: 20
            })
            .then(soal => {
                res.json({
                    message: message,
                    count: soal.length,
                    waktu: waktu,
                    id_lembar_soal: id_lembar_soal,
                    id_session: id_session,
                    soals: soal
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
        } catch (error) {
            res.json({
                message: error.message
            })
        }
    },
    controllerFinish: async (req, res) => {
        let finish = new Date()

        let param = {
            id_lembar_soal: req.body.id_lembar_soal,
            id_siswa: req.body.id_siswa
        }

        let data = {
            nilai: req.body.nilai,
            // waktu_pengerjaan: req.body.waktu_pengerjaan,
            finish: finish
        }
        logger("Kirim finish data:", data);
        session.update(data, { where: param })
            .then(result => {
                res.json({
                    message: "Ujian selesai",
                    data: data
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
            id_session: req.params.id
        }
        let data = {
            id_lembar_soal: req.body.id_lembar_soal,
            id_siswa: req.body.id_siswa,
            nilai: req.body.nilai,
            waktu_pengerjaan: req.body.waktu_pengerjaan
        }
        session.update(data, { where: param })
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
            id_role: req.params.id
        }
        role.destroy({ where: param })
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