const models = require('../../models/index');
const ukt_siswa = models.ukt_siswa;

const { Sequelize, Op, or } = require("sequelize");
function formatNumber(number) {
    if (number === 0 || number === null || number === undefined) return null;
    if (number % 1 === 0) return number;
    return parseFloat(number.toFixed(2));
}
module.exports = {
    controllerGetAll: async (req, res) => {
        ukt_siswa.findAll()
            .then(ukt_siswa => {
                res.json({
                    count: ukt_siswa.length,
                    data: ukt_siswa
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
        ukt_siswa.findAll({
            where: {
                id_event: req.params.id
            },
            attributes: ['id_ukt_siswa']
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
    controllerGetRayon: async (req, res) => {
        ukt_siswa.findAll({
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('rayon')), 'rayon']],
            where: {
                id_event: req.body.event
            }
        })
            .then(data => {
                const transformedData = data.map(item => ({
                    label: item.rayon,
                    value: item.rayon
                }));
                res.json({
                    count: transformedData.length,
                    data: transformedData
                });
            })
            .catch(err => {
                console.error('Error fetching distinct rayons:', err);
            });
    },
    controllerGetByEventFiltered: async (req, res) => {
        const { jenis, updown, event, ranting, rayon } = req.body;
        const rantings = req.body.ranting || ['BENDUNGAN', 'DONGKO', 'DURENAN', 'GANDUSARI', 'KAMPAK', 'KARANGAN', 'MUNJUNGAN', 'PANGGUL', 'POGALAN', 'PULE', 'SURUH', 'TRENGGALEK', 'TUGU', 'WATULIMO']
        let orderCriteria = [];
        let noRayon = {
            id_event: event
        };

        let withRayon = {
            id_event: event,
            rayon: {
                [Op.in]: rayon
            }
        };

        let whereCriteria = rayon.length === 0 ? noRayon : withRayon;


        switch (jenis) {
            case 'senam':
                orderCriteria.push(['senam', updown === 'downToUp' ? 'ASC' : 'DESC']);
                break;
            case 'jurus':
                orderCriteria.push(['jurus', updown === 'downToUp' ? 'ASC' : 'DESC']);
                break;
            case 'fisik':
                orderCriteria.push(['fisik', updown === 'downToUp' ? 'ASC' : 'DESC']);
                break;
            case 'teknik':
                orderCriteria.push(['teknik', updown === 'downToUp' ? 'ASC' : 'DESC']);
                break;
            case 'sambung':
                orderCriteria.push(['sambung', updown === 'downToUp' ? 'ASC' : 'DESC']);
                break;
            case 'keshan':
                orderCriteria.push(['keshan', updown === 'downToUp' ? 'ASC' : 'DESC']);
                break;
            case 'all':
                orderCriteria.push([
                    Sequelize.literal('(COALESCE(senam, 0) + COALESCE(jurus, 0) + COALESCE(fisik, 0) + COALESCE(teknik, 0) + COALESCE(sambung, 0) + COALESCE(keshan, 0))/6'),
                    updown === 'downToUp' ? 'ASC' : 'DESC'
                ]);
                break;
            default:
                // handle invalid jenis value
                res.status(400).send('Invalid jenis value');
                return;
        }
        ukt_siswa.findAll({
            include: [
                {
                    model: models.siswa,
                    as: "siswa_ukt_siswa",
                    attributes: ['name', 'tingkatan', 'nomor_urut'],
                    where: {
                        id_ranting: {
                            [Op.in]: rantings
                        }
                    },
                    include: [
                        {
                            model: models.ranting,
                            as: "siswa_ranting",
                            attributes: ['name'],
                        }
                    ]
                }
            ],
            where: whereCriteria,
            order: orderCriteria,
        })
            .then(ukt_siswa => {
                res.json({
                    count: ukt_siswa.length,
                    data: ukt_siswa
                });
            })
            .catch(error => {
                res.json({
                    message: error.message
                });
            });
    },
    controllerGetByRantingFiltered: async (req, res) => {
        const { jenis, updown, event, tipeUkt } = req.body;
        const rantings = req.body.ranting || ['BENDUNGAN', 'DONGKO', 'DURENAN', 'GANDUSARI', 'KAMPAK', 'KARANGAN', 'MUNJUNGAN', 'PANGGUL', 'POGALAN', 'PULE', 'SURUH', 'TRENGGALEK', 'TUGU', 'WATULIMO']
        const rayons = req.body.rayon || []
        let orderCriteria = [];
        const where1 = {
            id_event: event,
            rayon: {
                [Op.in]: rayons
            }
        }
        const where2 = {
            id_event: event,
        }
        const whereClause = rayons?.length === 0 ? where2 : where1;
        switch (jenis) {
            case 'senam':
                orderCriteria.push(['senam', updown === 'downToUp' ? 'ASC' : 'DESC']);
                break;
            case 'jurus':
                orderCriteria.push(['jurus', updown === 'downToUp' ? 'ASC' : 'DESC']);
                break;
            case 'fisik':
                orderCriteria.push(['fisik', updown === 'downToUp' ? 'ASC' : 'DESC']);
                break;
            case 'teknik':
                orderCriteria.push(['teknik', updown === 'downToUp' ? 'ASC' : 'DESC']);
                break;
            case 'sambung':
                orderCriteria.push(['sambung', updown === 'downToUp' ? 'ASC' : 'DESC']);
                break;
            case 'belati':
                orderCriteria.push(['belati', updown === 'downToUp' ? 'ASC' : 'DESC']);
                break;
            case 'kripen':
                orderCriteria.push(['kripen', updown === 'downToUp' ? 'ASC' : 'DESC']);
                break;
            case 'jurus_toya':
                orderCriteria.push(['jurus_toya', updown === 'downToUp' ? 'ASC' : 'DESC']);
                break;
            case 'senam_toya':
                orderCriteria.push(['senam_toya', updown === 'downToUp' ? 'ASC' : 'DESC']);
                break;
            case 'keshan':
                orderCriteria.push(['keshan', updown === 'downToUp' ? 'ASC' : 'DESC']);
                break;
            case 'all':
                orderCriteria.push([
                    Sequelize.literal('(COALESCE(senam, 0) + COALESCE(jurus, 0) + COALESCE(fisik, 0) + COALESCE(teknik, 0) + COALESCE(sambung, 0) + COALESCE(belati, 0) + COALESCE(kripen, 0) + COALESCE(senam_toya, 0) + COALESCE(jurus_toya, 0) + COALESCE(keshan, 0))/10'),
                    updown === 'downToUp' ? 'ASC' : 'DESC'
                ]);
                break;
            default:
                // handle invalid jenis value
                res.status(400).send('Invalid jenis value');
                return;
        }
        const tipe = tipeUkt == "UKCW"
            ? 2 : tipeUkt == "UKT Putih"
                ? 2 : 1
        const attribute1 = ['id_ukt_siswa', 'id_siswa', 'nomor_urut', 'name', 'ranting', 'keshan', 'senam', 'jurus', 'teknik', 'fisik', 'sambung']
        const attribute2 = ['id_ukt_siswa', 'id_siswa', 'nomor_urut', 'name', 'ranting', 'keshan', 'senam', 'senam_toya', 'jurus', 'jurus_toya', 'teknik', 'fisik', 'belati', 'kripen', 'sambung']
        const attribute = tipe == 1 ? attribute1 : attribute2
        ukt_siswa.findAll({
            where: whereClause,
            attribute: attribute,
            include: [
                {
                    model: models.siswa,
                    as: "siswa_ukt_siswa",
                    attributes: ['name', 'nomor_urut'],
                    where: {
                        id_ranting: {
                            [Op.in]: rantings
                        },
                        active: true
                    },
                    include: [
                        {
                            model: models.ranting,
                            as: "siswa_ranting",
                            attributes: ['name'],
                        }
                    ]
                }
            ],
            order: orderCriteria,
        })
            .then(ukt_siswa => {
                const data = ukt_siswa.map(item => {
                    if (!item.siswa_ukt_siswa) return null; // safety

                    if (tipe === 1) {
                        return {
                            id_ukt_siswa: item.id_ukt_siswa,
                            id_siswa: item.id_siswa,
                            ranting: item.siswa_ukt_siswa?.siswa_ranting?.name,
                            nomor_urut: item.siswa_ukt_siswa?.nomor_urut,
                            name: item.siswa_ukt_siswa?.name,
                            rayon: item.rayon,
                            keshan: item.keshan,
                            senam: formatNumber(item.senam),
                            jurus: formatNumber(item.jurus),
                            teknik: formatNumber(item.teknik),
                            fisik: formatNumber(item.fisik),
                            sambung: formatNumber(item.sambung),
                            total: (
                                (
                                    item.keshan +
                                    item.senam +
                                    item.jurus +
                                    item.teknik +
                                    item.fisik +
                                    item.sambung
                                ) / 6
                            ).toFixed(2)
                        }
                    }

                    return {
                        id_ukt_siswa: item.id_ukt_siswa,
                        id_siswa: item.id_siswa,
                        ranting: item.siswa_ukt_siswa?.siswa_ranting?.name,
                        nomor_urut: item.siswa_ukt_siswa?.nomor_urut,
                        name: item.siswa_ukt_siswa?.name,
                        rayon: item.rayon,
                        keshan: item.keshan,
                        senam: formatNumber(item.senam),
                        senam_toya: formatNumber(item.senam_toya),
                        jurus: formatNumber(item.jurus),
                        jurus_toya: formatNumber(item.jurus_toya),
                        teknik: formatNumber(item.teknik),
                        fisik: formatNumber(item.fisik),
                        sambung: formatNumber(item.sambung),
                        belati: formatNumber(item.belati),
                        kripen: formatNumber(item.kripen),
                        total: (
                            (
                                item.keshan +
                                item.senam +
                                item.senam_toya +
                                item.jurus +
                                item.jurus_toya +
                                item.teknik +
                                item.fisik +
                                item.sambung +
                                item.belati +
                                item.kripen
                            ) / 10
                        ).toFixed(2)
                    }
                }).filter(Boolean)

                res.json({
                    count: data.length,
                    data
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                });
            });
    },
    controllerGetByEvent: async (req, res) => {
        const rantings = req.body.ranting || ['BENDUNGAN', 'DONGKO', 'DURENAN', 'GANDUSARI', 'KAMPAK', 'KARANGAN', 'MUNJUNGAN', 'PANGGUL', 'POGALAN', 'PULE', 'SURUH', 'TRENGGALEK', 'TUGU', 'WATULIMO']
        ukt_siswa.findAll({
            include: [
                {
                    model: models.siswa,
                    as: "siswa_ukt_siswa",
                    attributes: ['name', 'tingkatan', "nomor_urut"],
                    where: {
                        id_ranting: {
                            [Op.in]: rantings
                        }
                    },
                    include: [
                        {
                            model: models.ranting,
                            as: "siswa_ranting",
                            attributes: ['name'],
                        }
                    ]
                }
            ],
            where: {
                id_event: req.params.event,
            },
        })
            .then(ukt_siswa => {
                res.json({
                    count: ukt_siswa.length,
                    data: ukt_siswa
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerStatistics: async (req, res) => {
        const attributes = ['keshan', 'senam', 'jurus', 'fisik', 'teknik', 'sambung']
        ukt_siswa.findAll({
            attributes: ['keshan', 'senam', 'jurus', 'fisik', 'teknik', 'sambung']
        })
            .then(result => {
                // Process the data into the desired format
                const options = {
                    series: [
                        {
                            name: 'Kurang',
                            data: [],
                            color: '#FF6A81'
                        },
                        {
                            name: 'Sedang',
                            data: [],
                            color: '#6CE1AE'
                        },
                        {
                            name: 'Cukup Baik',
                            data: [],
                            color: '#48B8F1'
                        },
                        {
                            name: 'Baik',
                            data: [],
                            color: '#BC5EF6'
                        },
                        {
                            name: 'Memuaskan',
                            data: [],
                            color: '#FB934E'
                        },
                        {
                            name: 'Sangat Memuaskan',
                            data: [],
                            color: '#E9E059'
                        },
                    ],
                };
                const tables = {
                    series: [
                        {
                            name: 'Keshan',
                            data: [],
                        },
                        {
                            name: 'Senam',
                            data: [],
                        },
                        {
                            name: 'Jurus',
                            data: [],
                        },
                        {
                            name: 'Fisik',
                            data: [],
                        },
                        {
                            name: 'Teknik',
                            data: [],
                        },
                        {
                            name: 'Sambung',
                            data: [],
                        },
                        {
                            name: 'Rata - rata',
                            data: [],
                        },
                    ],
                };
                let allKurang = 0;
                let allSedang = 0;
                let allCukupBaik = 0;
                let allBaik = 0;
                let allMemuaskan = 0;
                let allSangatMemuaskan = 0;
                for (let i = 0; i < 6; i++) {
                    //untuk mencari data berdasarkan attribut
                    const attribute = attributes[i];
                    let kurang = 0;
                    let sedang = 0;
                    let cukupBaik = 0;
                    let baik = 0;
                    let memuaskan = 0;
                    let sangatMemuaskan = 0;
                    result.map(item => {
                        const value = item[attribute];
                        if (value <= 50) {
                            allKurang++;
                            kurang++;
                        } else if (value > 50 && value < 61) {
                            allSedang++;
                            sedang++;

                        } else if (value > 60 && value < 71) {
                            allCukupBaik++;
                            cukupBaik++;

                        } else if (value > 70 && value < 81) {
                            allBaik++;
                            baik++;

                        } else if (value > 80 && value < 91) {
                            allMemuaskan++;
                            memuaskan++;

                        } else if (value > 90 && value < 101) {
                            allSangatMemuaskan++;
                            sangatMemuaskan++;

                        }
                        // for (let b = 0; b < result.length; b++) {
                        //     // melakukan mapping dan looping untuk memasukkan data dari result

                        // }
                    });


                    let persenKurang = Math.round((kurang / result.length) * 100 * 100) / 100
                    let persenSedang = Math.round((sedang / result.length) * 100 * 100) / 100;
                    let persenCukupBaik = Math.round((cukupBaik / result.length) * 100 * 100) / 100;
                    let persenBaik = Math.round((baik / result.length) * 100 * 100) / 100;
                    let persenMemuaskan = Math.round((memuaskan / result.length) * 100 * 100) / 100;
                    let persenSangatMemuaskan = Math.round((sangatMemuaskan / result.length) * 100 * 100) / 100;

                    kurang > 0 ? options.series[0].data.push(persenKurang) : options.series[0].data.push(0);
                    sedang > 0 ? options.series[1].data.push(persenSedang) : options.series[1].data.push(0);
                    cukupBaik > 0 ? options.series[2].data.push(persenCukupBaik) : options.series[2].data.push(0)
                    baik > 0 ? options.series[3].data.push(persenBaik) : options.series[3].data.push(0)
                    memuaskan > 0 ? options.series[4].data.push(persenMemuaskan) : options.series[4].data.push(0)
                    sangatMemuaskan > 0 ? options.series[5].data.push(persenSangatMemuaskan) : options.series[5].data.push(0)
                    // for (let j = 0; j < 6; j++) {
                    kurang > 0 ? tables.series[i].data.push(persenKurang) : tables.series[i].data.push(0);
                    sedang > 0 ? tables.series[i].data.push(persenSedang) : tables.series[i].data.push(0);
                    cukupBaik > 0 ? tables.series[i].data.push(persenCukupBaik) : tables.series[i].data.push(0)
                    baik > 0 ? tables.series[i].data.push(persenBaik) : tables.series[i].data.push(0)
                    memuaskan > 0 ? tables.series[i].data.push(persenMemuaskan) : tables.series[i].data.push(0)
                    sangatMemuaskan > 0 ? tables.series[i].data.push(persenSangatMemuaskan) : tables.series[i].data.push(0)
                    // }
                }

                let persenKurang = Math.round((allKurang / result.length) * 100 * 100 / 6) / 100;
                let persenSedang = Math.round((allSedang / result.length) * 100 * 100 / 6) / 100;
                let persenCukupBaik = Math.round((allCukupBaik / result.length) * 100 * 100 / 6) / 100;
                let persenBaik = Math.round((allBaik / result.length) * 100 * 100 / 6) / 100;
                let persenMemuaskan = Math.round((allMemuaskan / result.length) * 100 * 100 / 6) / 100;
                let persenSangatMemuaskan = Math.round((allSangatMemuaskan / result.length) * 100 * 100 / 6) / 100;

                allKurang > 0 ? options.series[0].data.push(persenKurang) : options.series[0].data.push(0);
                allSedang > 0 ? options.series[1].data.push(persenSedang) : options.series[1].data.push(0);
                allCukupBaik > 0 ? options.series[2].data.push(persenCukupBaik) : options.series[2].data.push(0)
                allBaik > 0 ? options.series[3].data.push(persenBaik) : options.series[3].data.push(0)
                allMemuaskan > 0 ? options.series[4].data.push(persenMemuaskan) : options.series[4].data.push(0)
                allSangatMemuaskan > 0 ? options.series[5].data.push(persenSangatMemuaskan) : options.series[5].data.push(0)

                allKurang > 0 ? tables.series[6].data.push(persenKurang) : tables.series[6].data.push(0);
                allSedang > 0 ? tables.series[6].data.push(persenSedang) : tables.series[6].data.push(0);
                allCukupBaik > 0 ? tables.series[6].data.push(persenCukupBaik) : tables.series[6].data.push(0)
                allBaik > 0 ? tables.series[6].data.push(persenBaik) : tables.series[6].data.push(0)
                allMemuaskan > 0 ? tables.series[6].data.push(persenMemuaskan) : tables.series[6].data.push(0)
                allSangatMemuaskan > 0 ? tables.series[6].data.push(persenSangatMemuaskan) : tables.series[6].data.push(0)
                res.json({
                    // count: data.length,
                    data: options,
                    tables: tables
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerStatisticsEvent: async (req, res) => {
        const attributes = ['keshan', 'senam', 'jurus', 'fisik', 'teknik', 'sambung']
        const param = req.params.id
        const ranting = req.params.ranting

        ukt_siswa.findAll({
            attributes: attributes,
            include: [
                {
                    model: models.siswa,
                    as: "siswa_ukt_siswa",
                    attributes: ['id_ranting', 'id_event'],
                }
            ],
            where: {
                "$siswa_ukt_siswa.id_event$": param,
                "$siswa_ukt_siswa.id_ranting$": ranting,
            }
        })
            .then(result => {
                // Process the data into the desired format
                const options = {
                    series: [
                        {
                            name: 'Kurang',
                            data: [],
                            color: '#FF6A81'
                        },
                        {
                            name: 'Sedang',
                            data: [],
                            color: '#6CE1AE'
                        },
                        {
                            name: 'Cukup Baik',
                            data: [],
                            color: '#48B8F1'
                        },
                        {
                            name: 'Baik',
                            data: [],
                            color: '#BC5EF6'
                        },
                        {
                            name: 'Memuaskan',
                            data: [],
                            color: '#FB934E'
                        },
                        {
                            name: 'Sangat Memuaskan',
                            data: [],
                            color: '#E9E059'
                        },
                    ],
                };
                const tables = {
                    series: [
                        {
                            name: 'Keshan',
                            data: [],
                        },
                        {
                            name: 'Senam',
                            data: [],
                        },
                        {
                            name: 'Jurus',
                            data: [],
                        },
                        {
                            name: 'Fisik',
                            data: [],
                        },
                        {
                            name: 'Teknik',
                            data: [],
                        },
                        {
                            name: 'Sambung',
                            data: [],
                        },
                        {
                            name: 'Rata - rata',
                            data: [],
                        },
                    ],
                };
                let allKurang = 0;
                let allSedang = 0;
                let allCukupBaik = 0;
                let allBaik = 0;
                let allMemuaskan = 0;
                let allSangatMemuaskan = 0;
                for (let i = 0; i < 6; i++) {
                    //untuk mencari data berdasarkan attribut
                    const attribute = attributes[i];
                    let kurang = 0;
                    let sedang = 0;
                    let cukupBaik = 0;
                    let baik = 0;
                    let memuaskan = 0;
                    let sangatMemuaskan = 0;
                    result.map(item => {
                        const value = item[attribute];
                        if (value <= 50) {
                            allKurang++;
                            kurang++;
                        } else if (value > 50 && value < 61) {
                            allSedang++;
                            sedang++;

                        } else if (value > 60 && value < 71) {
                            allCukupBaik++;
                            cukupBaik++;

                        } else if (value > 70 && value < 81) {
                            allBaik++;
                            baik++;

                        } else if (value > 80 && value < 91) {
                            allMemuaskan++;
                            memuaskan++;

                        } else if (value > 90 && value < 101) {
                            allSangatMemuaskan++;
                            sangatMemuaskan++;

                        }
                        // for (let b = 0; b < result.length; b++) {
                        //     // melakukan mapping dan looping untuk memasukkan data dari result

                        // }
                    });


                    let persenKurang = Math.round((kurang / result.length) * 100 * 100) / 100
                    let persenSedang = Math.round((sedang / result.length) * 100 * 100) / 100;
                    let persenCukupBaik = Math.round((cukupBaik / result.length) * 100 * 100) / 100;
                    let persenBaik = Math.round((baik / result.length) * 100 * 100) / 100;
                    let persenMemuaskan = Math.round((memuaskan / result.length) * 100 * 100) / 100;
                    let persenSangatMemuaskan = Math.round((sangatMemuaskan / result.length) * 100 * 100) / 100;

                    kurang > 0 ? options.series[0].data.push(persenKurang) : options.series[0].data.push(0);
                    sedang > 0 ? options.series[1].data.push(persenSedang) : options.series[1].data.push(0);
                    cukupBaik > 0 ? options.series[2].data.push(persenCukupBaik) : options.series[2].data.push(0)
                    baik > 0 ? options.series[3].data.push(persenBaik) : options.series[3].data.push(0)
                    memuaskan > 0 ? options.series[4].data.push(persenMemuaskan) : options.series[4].data.push(0)
                    sangatMemuaskan > 0 ? options.series[5].data.push(persenSangatMemuaskan) : options.series[5].data.push(0)
                    // for (let j = 0; j < 6; j++) {
                    kurang > 0 ? tables.series[i].data.push(persenKurang) : tables.series[i].data.push(0);
                    sedang > 0 ? tables.series[i].data.push(persenSedang) : tables.series[i].data.push(0);
                    cukupBaik > 0 ? tables.series[i].data.push(persenCukupBaik) : tables.series[i].data.push(0)
                    baik > 0 ? tables.series[i].data.push(persenBaik) : tables.series[i].data.push(0)
                    memuaskan > 0 ? tables.series[i].data.push(persenMemuaskan) : tables.series[i].data.push(0)
                    sangatMemuaskan > 0 ? tables.series[i].data.push(persenSangatMemuaskan) : tables.series[i].data.push(0)
                    // }
                }

                let persenKurang = Math.round((allKurang / result.length) * 100 * 100 / 6) / 100;
                let persenSedang = Math.round((allSedang / result.length) * 100 * 100 / 6) / 100;
                let persenCukupBaik = Math.round((allCukupBaik / result.length) * 100 * 100 / 6) / 100;
                let persenBaik = Math.round((allBaik / result.length) * 100 * 100 / 6) / 100;
                let persenMemuaskan = Math.round((allMemuaskan / result.length) * 100 * 100 / 6) / 100;
                let persenSangatMemuaskan = Math.round((allSangatMemuaskan / result.length) * 100 * 100 / 6) / 100;

                allKurang > 0 ? options.series[0].data.push(persenKurang) : options.series[0].data.push(0);
                allSedang > 0 ? options.series[1].data.push(persenSedang) : options.series[1].data.push(0);
                allCukupBaik > 0 ? options.series[2].data.push(persenCukupBaik) : options.series[2].data.push(0)
                allBaik > 0 ? options.series[3].data.push(persenBaik) : options.series[3].data.push(0)
                allMemuaskan > 0 ? options.series[4].data.push(persenMemuaskan) : options.series[4].data.push(0)
                allSangatMemuaskan > 0 ? options.series[5].data.push(persenSangatMemuaskan) : options.series[5].data.push(0)

                allKurang > 0 ? tables.series[6].data.push(persenKurang) : tables.series[6].data.push(0);
                allSedang > 0 ? tables.series[6].data.push(persenSedang) : tables.series[6].data.push(0);
                allCukupBaik > 0 ? tables.series[6].data.push(persenCukupBaik) : tables.series[6].data.push(0)
                allBaik > 0 ? tables.series[6].data.push(persenBaik) : tables.series[6].data.push(0)
                allMemuaskan > 0 ? tables.series[6].data.push(persenMemuaskan) : tables.series[6].data.push(0)
                allSangatMemuaskan > 0 ? tables.series[6].data.push(persenSangatMemuaskan) : tables.series[6].data.push(0)
                res.json({
                    // count: data.length,
                    data: options,
                    tables: tables
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerStatisticsEventCabang: async (req, res) => {
        const attributes = ['keshan', 'senam', 'jurus', 'fisik', 'teknik', 'sambung']
        const param = req.params.id

        ukt_siswa.findAll({
            attributes: attributes,
            include: [
                {
                    model: models.siswa,
                    as: "siswa_ukt_siswa",
                    attributes: ['id_ranting', 'id_event'],
                }
            ],
            where: {
                "$siswa_ukt_siswa.id_event$": param,
            }
        })
            .then(result => {
                // Process the data into the desired format
                const options = {
                    series: [
                        {
                            name: 'Kurang',
                            data: [],
                            color: '#FF6A81'
                        },
                        {
                            name: 'Sedang',
                            data: [],
                            color: '#6CE1AE'
                        },
                        {
                            name: 'Cukup Baik',
                            data: [],
                            color: '#48B8F1'
                        },
                        {
                            name: 'Baik',
                            data: [],
                            color: '#BC5EF6'
                        },
                        {
                            name: 'Memuaskan',
                            data: [],
                            color: '#FB934E'
                        },
                        {
                            name: 'Sangat Memuaskan',
                            data: [],
                            color: '#E9E059'
                        },
                    ],
                };
                const tables = {
                    series: [
                        {
                            name: 'Keshan',
                            data: [],
                        },
                        {
                            name: 'Senam',
                            data: [],
                        },
                        {
                            name: 'Jurus',
                            data: [],
                        },
                        {
                            name: 'Fisik',
                            data: [],
                        },
                        {
                            name: 'Teknik',
                            data: [],
                        },
                        {
                            name: 'Sambung',
                            data: [],
                        },
                        {
                            name: 'Rata - rata',
                            data: [],
                        },
                    ],
                };
                let allKurang = 0;
                let allSedang = 0;
                let allCukupBaik = 0;
                let allBaik = 0;
                let allMemuaskan = 0;
                let allSangatMemuaskan = 0;
                for (let i = 0; i < 6; i++) {
                    //untuk mencari data berdasarkan attribut
                    const attribute = attributes[i];
                    let kurang = 0;
                    let sedang = 0;
                    let cukupBaik = 0;
                    let baik = 0;
                    let memuaskan = 0;
                    let sangatMemuaskan = 0;
                    result.map(item => {
                        const value = item[attribute];
                        if (value <= 50) {
                            allKurang++;
                            kurang++;
                        } else if (value > 50 && value < 61) {
                            allSedang++;
                            sedang++;

                        } else if (value > 60 && value < 71) {
                            allCukupBaik++;
                            cukupBaik++;

                        } else if (value > 70 && value < 81) {
                            allBaik++;
                            baik++;

                        } else if (value > 80 && value < 91) {
                            allMemuaskan++;
                            memuaskan++;

                        } else if (value > 90 && value < 101) {
                            allSangatMemuaskan++;
                            sangatMemuaskan++;

                        }
                        // for (let b = 0; b < result.length; b++) {
                        //     // melakukan mapping dan looping untuk memasukkan data dari result

                        // }
                    });


                    let persenKurang = Math.round((kurang / result.length) * 100 * 100) / 100
                    let persenSedang = Math.round((sedang / result.length) * 100 * 100) / 100;
                    let persenCukupBaik = Math.round((cukupBaik / result.length) * 100 * 100) / 100;
                    let persenBaik = Math.round((baik / result.length) * 100 * 100) / 100;
                    let persenMemuaskan = Math.round((memuaskan / result.length) * 100 * 100) / 100;
                    let persenSangatMemuaskan = Math.round((sangatMemuaskan / result.length) * 100 * 100) / 100;

                    kurang > 0 ? options.series[0].data.push(persenKurang) : options.series[0].data.push(0);
                    sedang > 0 ? options.series[1].data.push(persenSedang) : options.series[1].data.push(0);
                    cukupBaik > 0 ? options.series[2].data.push(persenCukupBaik) : options.series[2].data.push(0)
                    baik > 0 ? options.series[3].data.push(persenBaik) : options.series[3].data.push(0)
                    memuaskan > 0 ? options.series[4].data.push(persenMemuaskan) : options.series[4].data.push(0)
                    sangatMemuaskan > 0 ? options.series[5].data.push(persenSangatMemuaskan) : options.series[5].data.push(0)
                    // for (let j = 0; j < 6; j++) {
                    kurang > 0 ? tables.series[i].data.push(persenKurang) : tables.series[i].data.push(0);
                    sedang > 0 ? tables.series[i].data.push(persenSedang) : tables.series[i].data.push(0);
                    cukupBaik > 0 ? tables.series[i].data.push(persenCukupBaik) : tables.series[i].data.push(0)
                    baik > 0 ? tables.series[i].data.push(persenBaik) : tables.series[i].data.push(0)
                    memuaskan > 0 ? tables.series[i].data.push(persenMemuaskan) : tables.series[i].data.push(0)
                    sangatMemuaskan > 0 ? tables.series[i].data.push(persenSangatMemuaskan) : tables.series[i].data.push(0)
                    // }
                }

                let persenKurang = Math.round((allKurang / result.length) * 100 * 100 / 6) / 100;
                let persenSedang = Math.round((allSedang / result.length) * 100 * 100 / 6) / 100;
                let persenCukupBaik = Math.round((allCukupBaik / result.length) * 100 * 100 / 6) / 100;
                let persenBaik = Math.round((allBaik / result.length) * 100 * 100 / 6) / 100;
                let persenMemuaskan = Math.round((allMemuaskan / result.length) * 100 * 100 / 6) / 100;
                let persenSangatMemuaskan = Math.round((allSangatMemuaskan / result.length) * 100 * 100 / 6) / 100;

                allKurang > 0 ? options.series[0].data.push(persenKurang) : options.series[0].data.push(0);
                allSedang > 0 ? options.series[1].data.push(persenSedang) : options.series[1].data.push(0);
                allCukupBaik > 0 ? options.series[2].data.push(persenCukupBaik) : options.series[2].data.push(0)
                allBaik > 0 ? options.series[3].data.push(persenBaik) : options.series[3].data.push(0)
                allMemuaskan > 0 ? options.series[4].data.push(persenMemuaskan) : options.series[4].data.push(0)
                allSangatMemuaskan > 0 ? options.series[5].data.push(persenSangatMemuaskan) : options.series[5].data.push(0)

                allKurang > 0 ? tables.series[6].data.push(persenKurang) : tables.series[6].data.push(0);
                allSedang > 0 ? tables.series[6].data.push(persenSedang) : tables.series[6].data.push(0);
                allCukupBaik > 0 ? tables.series[6].data.push(persenCukupBaik) : tables.series[6].data.push(0)
                allBaik > 0 ? tables.series[6].data.push(persenBaik) : tables.series[6].data.push(0)
                allMemuaskan > 0 ? tables.series[6].data.push(persenMemuaskan) : tables.series[6].data.push(0)
                allSangatMemuaskan > 0 ? tables.series[6].data.push(persenSangatMemuaskan) : tables.series[6].data.push(0)
                res.json({
                    // count: data.length,
                    data: options,
                    tables: tables
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerStatisticsRanting: async (req, res) => {
        const attributes = ['keshan', 'senam', 'jurus', 'fisik', 'teknik', 'sambung']
        const param = req.params.id
        const event = req.params.event

        ukt_siswa.findAll({
            attributes: attributes,
            include: [
                {
                    model: models.siswa,
                    as: "siswa_ukt_siswa",
                    attributes: ['id_ranting'],
                }
            ],
            where: {
                // "$siswa_ukt_siswa.id_ranting$": param,
                "$siswa_ukt_siswa.id_event$": event
            }
        })
            .then(result => {
                // Process the data into the desired format
                const options = {
                    series: [
                        {
                            name: 'Kurang',
                            data: [],
                            color: '#FF6A81'
                        },
                        {
                            name: 'Sedang',
                            data: [],
                            color: '#6CE1AE'
                        },
                        {
                            name: 'Cukup Baik',
                            data: [],
                            color: '#48B8F1'
                        },
                        {
                            name: 'Baik',
                            data: [],
                            color: '#BC5EF6'
                        },
                        {
                            name: 'Memuaskan',
                            data: [],
                            color: '#FB934E'
                        },
                        {
                            name: 'Sangat Memuaskan',
                            data: [],
                            color: '#E9E059'
                        },
                    ],
                };
                const tables = {
                    series: [
                        {
                            name: 'Keshan',
                            data: [],
                        },
                        {
                            name: 'Senam',
                            data: [],
                        },
                        {
                            name: 'Jurus',
                            data: [],
                        },
                        {
                            name: 'Fisik',
                            data: [],
                        },
                        {
                            name: 'Teknik',
                            data: [],
                        },
                        {
                            name: 'Sambung',
                            data: [],
                        },
                        {
                            name: 'Rata - rata',
                            data: [],
                        },
                    ],
                };
                let allKurang = 0;
                let allSedang = 0;
                let allCukupBaik = 0;
                let allBaik = 0;
                let allMemuaskan = 0;
                let allSangatMemuaskan = 0;
                for (let i = 0; i < 6; i++) {
                    //untuk mencari data berdasarkan attribut
                    const attribute = attributes[i];
                    let kurang = 0;
                    let sedang = 0;
                    let cukupBaik = 0;
                    let baik = 0;
                    let memuaskan = 0;
                    let sangatMemuaskan = 0;
                    result.map(item => {
                        const value = item[attribute];
                        if (value <= 50) {
                            allKurang++;
                            kurang++;
                        } else if (value > 50 && value < 61) {
                            allSedang++;
                            sedang++;

                        } else if (value > 60 && value < 71) {
                            allCukupBaik++;
                            cukupBaik++;

                        } else if (value > 70 && value < 81) {
                            allBaik++;
                            baik++;

                        } else if (value > 80 && value < 91) {
                            allMemuaskan++;
                            memuaskan++;

                        } else if (value > 90 && value < 101) {
                            allSangatMemuaskan++;
                            sangatMemuaskan++;

                        }
                        // for (let b = 0; b < result.length; b++) {
                        //     // melakukan mapping dan looping untuk memasukkan data dari result

                        // }
                    });


                    let persenKurang = Math.round((kurang / result.length) * 100 * 100) / 100
                    let persenSedang = Math.round((sedang / result.length) * 100 * 100) / 100;
                    let persenCukupBaik = Math.round((cukupBaik / result.length) * 100 * 100) / 100;
                    let persenBaik = Math.round((baik / result.length) * 100 * 100) / 100;
                    let persenMemuaskan = Math.round((memuaskan / result.length) * 100 * 100) / 100;
                    let persenSangatMemuaskan = Math.round((sangatMemuaskan / result.length) * 100 * 100) / 100;

                    kurang > 0 ? options.series[0].data.push(persenKurang) : options.series[0].data.push(0);
                    sedang > 0 ? options.series[1].data.push(persenSedang) : options.series[1].data.push(0);
                    cukupBaik > 0 ? options.series[2].data.push(persenCukupBaik) : options.series[2].data.push(0)
                    baik > 0 ? options.series[3].data.push(persenBaik) : options.series[3].data.push(0)
                    memuaskan > 0 ? options.series[4].data.push(persenMemuaskan) : options.series[4].data.push(0)
                    sangatMemuaskan > 0 ? options.series[5].data.push(persenSangatMemuaskan) : options.series[5].data.push(0)
                    // for (let j = 0; j < 6; j++) {
                    kurang > 0 ? tables.series[i].data.push(persenKurang) : tables.series[i].data.push(0);
                    sedang > 0 ? tables.series[i].data.push(persenSedang) : tables.series[i].data.push(0);
                    cukupBaik > 0 ? tables.series[i].data.push(persenCukupBaik) : tables.series[i].data.push(0)
                    baik > 0 ? tables.series[i].data.push(persenBaik) : tables.series[i].data.push(0)
                    memuaskan > 0 ? tables.series[i].data.push(persenMemuaskan) : tables.series[i].data.push(0)
                    sangatMemuaskan > 0 ? tables.series[i].data.push(persenSangatMemuaskan) : tables.series[i].data.push(0)
                    // }
                }

                let persenKurang = Math.round((allKurang / result.length) * 100 * 100 / 6) / 100;
                let persenSedang = Math.round((allSedang / result.length) * 100 * 100 / 6) / 100;
                let persenCukupBaik = Math.round((allCukupBaik / result.length) * 100 * 100 / 6) / 100;
                let persenBaik = Math.round((allBaik / result.length) * 100 * 100 / 6) / 100;
                let persenMemuaskan = Math.round((allMemuaskan / result.length) * 100 * 100 / 6) / 100;
                let persenSangatMemuaskan = Math.round((allSangatMemuaskan / result.length) * 100 * 100 / 6) / 100;

                allKurang > 0 ? options.series[0].data.push(persenKurang) : options.series[0].data.push(0);
                allSedang > 0 ? options.series[1].data.push(persenSedang) : options.series[1].data.push(0);
                allCukupBaik > 0 ? options.series[2].data.push(persenCukupBaik) : options.series[2].data.push(0)
                allBaik > 0 ? options.series[3].data.push(persenBaik) : options.series[3].data.push(0)
                allMemuaskan > 0 ? options.series[4].data.push(persenMemuaskan) : options.series[4].data.push(0)
                allSangatMemuaskan > 0 ? options.series[5].data.push(persenSangatMemuaskan) : options.series[5].data.push(0)

                allKurang > 0 ? tables.series[6].data.push(persenKurang) : tables.series[6].data.push(0);
                allSedang > 0 ? tables.series[6].data.push(persenSedang) : tables.series[6].data.push(0);
                allCukupBaik > 0 ? tables.series[6].data.push(persenCukupBaik) : tables.series[6].data.push(0)
                allBaik > 0 ? tables.series[6].data.push(persenBaik) : tables.series[6].data.push(0)
                allMemuaskan > 0 ? tables.series[6].data.push(persenMemuaskan) : tables.series[6].data.push(0)
                allSangatMemuaskan > 0 ? tables.series[6].data.push(persenSangatMemuaskan) : tables.series[6].data.push(0)
                res.json({
                    // count: data.length,
                    data: options,
                    tables: tables
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerStatisticsCabang: async (req, res) => {
        const attributes = ['keshan', 'senam', 'jurus', 'fisik', 'teknik', 'sambung']
        const param = req.params.id
        const event = req.params.event
        const cabang = models.cabang;
        cabang.findOne({
            include: [
                {
                    model: models.ranting,
                    as: "cabang_ranting",
                    attributes: ['id_ranting']
                }
            ],
            where: {
                id_cabang: param
            }
        })
            .then(result => {
                console.log(result.cabang_ranting);
                const data = []
                for (let i = 0; i < result.cabang_ranting.length; i++) {
                    data.push(result.cabang_ranting[i].id_ranting)
                }
                console.log(data);
                // console.log(result.cabang_ranting.id_ranting);
                ukt_siswa.findAll({
                    attributes: attributes,
                    include: [
                        {
                            model: models.siswa,
                            as: "siswa_ukt_siswa",
                            attributes: ['id_ranting'],
                            where: {
                                id_ranting: {
                                    [Op.in]: data
                                },
                            }
                        }
                    ],
                })
                    .then(result => {
                        // Process the data into the desired format
                        const options = {
                            series: [
                                {
                                    name: 'Kurang',
                                    data: [],
                                    color: '#FF6A81'
                                },
                                {
                                    name: 'Sedang',
                                    data: [],
                                    color: '#6CE1AE'
                                },
                                {
                                    name: 'Cukup Baik',
                                    data: [],
                                    color: '#48B8F1'
                                },
                                {
                                    name: 'Baik',
                                    data: [],
                                    color: '#BC5EF6'
                                },
                                {
                                    name: 'Memuaskan',
                                    data: [],
                                    color: '#FB934E'
                                },
                                {
                                    name: 'Sangat Memuaskan',
                                    data: [],
                                    color: '#E9E059'
                                },
                            ],
                        };
                        const tables = {
                            series: [
                                {
                                    name: 'Keshan',
                                    data: [],
                                },
                                {
                                    name: 'Senam',
                                    data: [],
                                },
                                {
                                    name: 'Jurus',
                                    data: [],
                                },
                                {
                                    name: 'Fisik',
                                    data: [],
                                },
                                {
                                    name: 'Teknik',
                                    data: [],
                                },
                                {
                                    name: 'Sambung',
                                    data: [],
                                },
                                {
                                    name: 'Rata - rata',
                                    data: [],
                                },
                            ],
                        };
                        let allKurang = 0;
                        let allSedang = 0;
                        let allCukupBaik = 0;
                        let allBaik = 0;
                        let allMemuaskan = 0;
                        let allSangatMemuaskan = 0;
                        for (let i = 0; i < 6; i++) {
                            //untuk mencari data berdasarkan attribut
                            const attribute = attributes[i];
                            let kurang = 0;
                            let sedang = 0;
                            let cukupBaik = 0;
                            let baik = 0;
                            let memuaskan = 0;
                            let sangatMemuaskan = 0;
                            result.map(item => {
                                const value = item[attribute];
                                if (value <= 50) {
                                    allKurang++;
                                    kurang++;
                                } else if (value > 50 && value < 61) {
                                    allSedang++;
                                    sedang++;

                                } else if (value > 60 && value < 71) {
                                    allCukupBaik++;
                                    cukupBaik++;

                                } else if (value > 70 && value < 81) {
                                    allBaik++;
                                    baik++;

                                } else if (value > 80 && value < 91) {
                                    allMemuaskan++;
                                    memuaskan++;

                                } else if (value > 90 && value < 101) {
                                    allSangatMemuaskan++;
                                    sangatMemuaskan++;

                                }
                            });


                            let persenKurang = Math.round((kurang / result.length) * 100 * 100) / 100
                            let persenSedang = Math.round((sedang / result.length) * 100 * 100) / 100;
                            let persenCukupBaik = Math.round((cukupBaik / result.length) * 100 * 100) / 100;
                            let persenBaik = Math.round((baik / result.length) * 100 * 100) / 100;
                            let persenMemuaskan = Math.round((memuaskan / result.length) * 100 * 100) / 100;
                            let persenSangatMemuaskan = Math.round((sangatMemuaskan / result.length) * 100 * 100) / 100;

                            kurang > 0 ? options.series[0].data.push(persenKurang) : options.series[0].data.push(0);
                            sedang > 0 ? options.series[1].data.push(persenSedang) : options.series[1].data.push(0);
                            cukupBaik > 0 ? options.series[2].data.push(persenCukupBaik) : options.series[2].data.push(0)
                            baik > 0 ? options.series[3].data.push(persenBaik) : options.series[3].data.push(0)
                            memuaskan > 0 ? options.series[4].data.push(persenMemuaskan) : options.series[4].data.push(0)
                            sangatMemuaskan > 0 ? options.series[5].data.push(persenSangatMemuaskan) : options.series[5].data.push(0)
                            // for (let j = 0; j < 6; j++) {
                            kurang > 0 ? tables.series[i].data.push(persenKurang) : tables.series[i].data.push(0);
                            sedang > 0 ? tables.series[i].data.push(persenSedang) : tables.series[i].data.push(0);
                            cukupBaik > 0 ? tables.series[i].data.push(persenCukupBaik) : tables.series[i].data.push(0)
                            baik > 0 ? tables.series[i].data.push(persenBaik) : tables.series[i].data.push(0)
                            memuaskan > 0 ? tables.series[i].data.push(persenMemuaskan) : tables.series[i].data.push(0)
                            sangatMemuaskan > 0 ? tables.series[i].data.push(persenSangatMemuaskan) : tables.series[i].data.push(0)
                            // }
                        }

                        let persenKurang = Math.round((allKurang / result.length) * 100 * 100 / 6) / 100;
                        let persenSedang = Math.round((allSedang / result.length) * 100 * 100 / 6) / 100;
                        let persenCukupBaik = Math.round((allCukupBaik / result.length) * 100 * 100 / 6) / 100;
                        let persenBaik = Math.round((allBaik / result.length) * 100 * 100 / 6) / 100;
                        let persenMemuaskan = Math.round((allMemuaskan / result.length) * 100 * 100 / 6) / 100;
                        let persenSangatMemuaskan = Math.round((allSangatMemuaskan / result.length) * 100 * 100 / 6) / 100;

                        allKurang > 0 ? options.series[0].data.push(persenKurang) : options.series[0].data.push(0);
                        allSedang > 0 ? options.series[1].data.push(persenSedang) : options.series[1].data.push(0);
                        allCukupBaik > 0 ? options.series[2].data.push(persenCukupBaik) : options.series[2].data.push(0)
                        allBaik > 0 ? options.series[3].data.push(persenBaik) : options.series[3].data.push(0)
                        allMemuaskan > 0 ? options.series[4].data.push(persenMemuaskan) : options.series[4].data.push(0)
                        allSangatMemuaskan > 0 ? options.series[5].data.push(persenSangatMemuaskan) : options.series[5].data.push(0)

                        allKurang > 0 ? tables.series[6].data.push(persenKurang) : tables.series[6].data.push(0);
                        allSedang > 0 ? tables.series[6].data.push(persenSedang) : tables.series[6].data.push(0);
                        allCukupBaik > 0 ? tables.series[6].data.push(persenCukupBaik) : tables.series[6].data.push(0)
                        allBaik > 0 ? tables.series[6].data.push(persenBaik) : tables.series[6].data.push(0)
                        allMemuaskan > 0 ? tables.series[6].data.push(persenMemuaskan) : tables.series[6].data.push(0)
                        allSangatMemuaskan > 0 ? tables.series[6].data.push(persenSangatMemuaskan) : tables.series[6].data.push(0)
                        res.json({
                            // count: data.length,
                            data: options,
                            tables: tables
                        })
                    })
                    .catch(error => {
                        res.json({
                            message: error.message
                        })
                    })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })

    },
    controllerGetByEventUkt: async (req, res) => {
        let orderCriteria = [[Sequelize.literal('(COALESCE(senam, 0) + COALESCE(jurus, 0) + COALESCE(fisik, 0) + COALESCE(teknik, 0) + COALESCE(sambung, 0) + COALESCE(keshan, 0))/6'), 'DESC']];

        ukt_siswa.findAll({
            where: {
                tipe_ukt: req.params.ukt,
                id_event: req.params.event
            },
            include: [
                {
                    model: models.siswa,
                    as: "siswa_ukt_siswa",
                    attributes: ['name', 'tingkatan', "nomor_urut"],
                    include: [
                        {
                            model: models.ranting,
                            as: "siswa_ranting",
                            attributes: ['name']
                        }
                    ]
                }
            ],
            order: orderCriteria
        })
            .then(ukt_siswa => {
                res.json({
                    count: ukt_siswa.length,
                    data: ukt_siswa
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetByIdSiswa: async (req, res) => {
        ukt_siswa.findOne({
            where: {
                id_siswa: req.params.id
            },
            order: []
        })
            .then(ukt_siswa => {
                res.json({
                    data: ukt_siswa
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetByName: async (req, res) => {
        const getEvent = await models.event.findOne({
            where: {
                id_event: req.params.event
            }
        });
        const tipe = getEvent.tipe_ukt;
        const dataUkt = await ukt_siswa.findAll({
            include: [
                {
                    model: models.siswa,
                    as: "siswa_ukt_siswa",
                    attributes: ['name', 'tingkatan', 'nomor_urut'],
                    include: [
                        {
                            model: models.ranting,
                            as: "siswa_ranting",
                            attributes: ['name']
                        }
                    ]
                }
            ],
            where: {
                id_event: req.params.event,
                "$siswa_ukt_siswa.name$": {
                    [Op.like]: `%${req.params.id}%`
                },
            },
        })
            .then(result => {
                const data = result.map(item => {
                    if (!item.siswa_ukt_siswa) return null; // safety

                    if (tipe === "UKT Hijau" || tipe === "UKT Jambon") {
                        return {
                            id_ukt_siswa: item.id_ukt_siswa,
                            id_siswa: item.id_siswa,
                            nomor_urut: item.siswa_ukt_siswa?.nomor_urut,
                            name: item.siswa_ukt_siswa?.name,
                            ranting: item.rayon,
                            keshan: item.keshan,
                            senam: item.senam,
                            jurus: item.jurus,
                            teknik: formatNumber(item.teknik),
                            fisik: item.fisik,
                            sambung: item.sambung,
                            total: (
                                (
                                    item.keshan +
                                    item.senam +
                                    item.jurus +
                                    item.teknik +
                                    item.fisik +
                                    item.sambung
                                ) / 6
                            ).toFixed(2)
                        }
                    }

                    return {
                        id_ukt_siswa: item.id_ukt_siswa,
                        id_siswa: item.id_siswa,
                        nomor_urut: item.siswa_ukt_siswa?.nomor_urut,
                        name: item.siswa_ukt_siswa?.name,
                        ranting: item.rayon,
                        keshan: item.keshan,
                        senam: item.senam,
                        senam_toya: item.senam_toya,
                        jurus: item.jurus,
                        jurus_toya: item.jurus_toya,
                        teknik: formatNumber(item.teknik),
                        fisik: item.fisik,
                        sambung: item.sambung,
                        belati: item.belati,
                        kripen: item.kripen,
                        total: (
                            (
                                item.keshan +
                                item.senam +
                                item.senam_toya +
                                item.jurus +
                                item.jurus_toya +
                                item.teknik +
                                item.fisik +
                                item.sambung +
                                item.belati +
                                item.kripen
                            ) / 10
                        ).toFixed(2)
                    }
                }).filter(Boolean)
                res.json({
                    data: data
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
            tipe_ukt: req.body.tipe_ukt,
            id_event: req.body.id_event,
            id_siswa: req.body.id_siswa,
            rayon: req.body.rayon,
            keshan: req.body.keshan,
            senam: req.body.senam,
            jurus: req.body.jurus,
            fisik: req.body.fisik > 100 ? 100 : req.body.fisik,
            teknik: req.body.teknik,
            sambung: req.body.sambung
        }
        console.log("ini data data");
        console.log(data);
        ukt_siswa.create(data)
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
    controllerEdit: async (req, res) => {
        let param = {
            id_ukt_siswa: req.params.id
        }
        let data = {
            tipe_ukt: req.body.tipe_ukt,
            id_event: req.body.id_event,
            id_siswa: req.body.id_siswa,
            rayon: req.body.rayon,
            keshan: req.body.keshan,
            senam: req.body.senam,
            jurus: req.body.jurus,
            fisik: req.body.fisik > 100 ? 100 : req.body.fisik,
            teknik: req.body.teknik,
            sambung: req.body.sambung
        }
        ukt_siswa.update(data, { where: param })
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
            id_ukt_siswa: req.params.id
        }
        ukt_siswa.destroy({ where: param })
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
    controllerResetGrade: async (req, res) => {
        const { id_siswa, id_event, tipe_test } = req.body;

        // Allowed grade fields that can be reset
        const allowedFields = [
            'senam', 'jurus', 'fisik', 'teknik', 'sambung', 'keshan',
            'belati', 'kripen', 'senam_toya', 'jurus_toya'
        ];

        if (!id_siswa || !id_event || !tipe_test) {
            return res.status(400).json({ message: 'id_siswa, id_event, dan tipe_test wajib diisi' });
        }

        if (!allowedFields.includes(tipe_test)) {
            return res.status(400).json({ message: 'tipe_test tidak valid' });
        }

        // Build the update payload with just the target field set to null
        const resetData = { [tipe_test]: null };

        try {
            const [affectedRows] = await ukt_siswa.update(resetData, {
                where: {
                    id_siswa: id_siswa,
                    id_event: id_event
                }
            });

            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Data ukt_siswa tidak ditemukan' });
            }

            if (tipe_test === 'keshan') {
                const getSession = await models.session.findOne({
                    where: { id_siswa: id_siswa, id_event: id_event }
                });
                if (getSession) {
                    await models.lembar_jawaban.destroy({ where: { id_session: getSession.id_session } });
                    await models.session.destroy({ where: { id_session: getSession.id_session } });
                }
            } else if (tipe_test === 'senam') {
                const getDetail = await models.senam_detail.findOne({ where: { id_siswa, id_event } });
                if (getDetail) {
                    await models.senam_siswa.destroy({ where: { id_senam_detail: getDetail.id_senam_detail } });
                    await models.senam_detail.destroy({ where: { id_senam_detail: getDetail.id_senam_detail } });
                }
            } else if (tipe_test === 'jurus') {
                const getDetail = await models.jurus_detail.findOne({ where: { id_siswa, id_event } });
                if (getDetail) {
                    await models.jurus_siswa.destroy({ where: { id_jurus_detail: getDetail.id_jurus_detail } });
                    await models.jurus_detail.destroy({ where: { id_jurus_detail: getDetail.id_jurus_detail } });
                }
            } else if (tipe_test === 'teknik') {
                const getDetail = await models.teknik_detail.findOne({ where: { id_siswa, id_event } });
                if (getDetail) {
                    await models.teknik_siswa.destroy({ where: { id_teknik_detail: getDetail.id_teknik_detail } });
                    await models.teknik_detail.destroy({ where: { id_teknik_detail: getDetail.id_teknik_detail } });
                }
            } else if (tipe_test === 'belati') {
                const getDetail = await models.belati_detail.findOne({ where: { id_siswa, id_event } });
                if (getDetail) {
                    await models.belati_siswa.destroy({ where: { id_belati_detail: getDetail.id_belati_detail } });
                    await models.belati_detail.destroy({ where: { id_belati_detail: getDetail.id_belati_detail } });
                }
            } else if (tipe_test === 'kripen') {
                const getDetail = await models.kripen_detail.findOne({ where: { id_siswa, id_event } });
                if (getDetail) {
                    await models.kripen_siswa.destroy({ where: { id_kripen_detail: getDetail.id_kripen_detail } });
                    await models.kripen_detail.destroy({ where: { id_kripen_detail: getDetail.id_kripen_detail } });
                }
            } else if (tipe_test === 'senam_toya') {
                const getDetail = await models.senam_toya_detail.findOne({ where: { id_siswa, id_event } });
                if (getDetail) {
                    await models.senam_toya_siswa.destroy({ where: { id_senam_toya_detail: getDetail.id_senam_toya_detail } });
                    await models.senam_toya_detail.destroy({ where: { id_senam_toya_detail: getDetail.id_senam_toya_detail } });
                }
            } else if (tipe_test === 'jurus_toya') {
                const getDetail = await models.jurus_toya_detail.findOne({ where: { id_siswa, id_event } });
                if (getDetail) {
                    await models.jurus_toya_siswa.destroy({ where: { id_jurus_toya_detail: getDetail.id_jurus_toya_detail } });
                    await models.jurus_toya_detail.destroy({ where: { id_jurus_toya_detail: getDetail.id_jurus_toya_detail } });
                }
            } else if (tipe_test === 'fisik') {
                await models.fisik.destroy({ where: { id_siswa, id_event } });
            } else if (tipe_test === 'sambung') {
                const getSambung = await models.sambung.findAll({ where: { id_event } });
                if (getSambung.length > 0) {
                    const idSambungs = getSambung.map(s => s.id_sambung);
                    await models.detail_sambung.destroy({
                        where: {
                            id_siswa: id_siswa,
                            id_sambung: idSambungs
                        }
                    });
                }
            }

            res.json({
                message: `Nilai ${tipe_test} berhasil direset`
            });
        } catch (error) {
            res.json({
                message: error.message
            });
        }
    },
}