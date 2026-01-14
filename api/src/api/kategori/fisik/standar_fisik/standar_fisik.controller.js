const models = require('../../../../models/index');
const standar_fisik = models.standar_fisik;

module.exports = {
    controllerGetAll: async (req, res) => {
        standar_fisik
            .findAll({
                order: [['tipe_ukt', 'ASC'], ['peserta', 'ASC']],
            })
            .then((standar_fisik) => {
                res.json(standar_fisik);
            })
            .catch((error) => {
                res.json({
                    message: error.message,
                });
            });
    },
    controllerGetCountByTipeUkt: async (req, res) => {
        standar_fisik
            .findAll({
                order: [['tipe_ukt', 'ASC'], ['peserta', 'ASC']],
            })
            .then((standar_fisik) => {
                res.json(standar_fisik);
            })
            .catch((error) => {
                res.json({
                    message: error.message,
                });
            });
    },
    controllerGetByPeserta: async (req, res) => {
        standar_fisik
            .findOne({
                where: {
                    tipe_ukt: req.body.tipe_ukt,
                    peserta: req.body.peserta
                },
                order: [['tipe_ukt', 'ASC'], ['peserta', 'ASC']],
            })
            .then((standar_fisik) => {
                res.json(standar_fisik);
            })
            .catch((error) => {
                res.json({
                    message: error.message,
                });
            });
    },
    controllerGetByPesertaJenisLatihan: async (req, res) => {
        standar_fisik
            .findOne({
                where: {
                    tipe_ukt: req.body.tipe_ukt,
                    peserta: req.body.peserta
                },
                order: [['tipe_ukt', 'ASC'], ['peserta', 'ASC']],
            })
            .then((standar_fisik) => {
                res.json(standar_fisik);
            })
            .catch((error) => {
                res.json({
                    message: error.message,
                });
            });
    },
    controllerGetByJenisLatihan: async (req, res) => {
        standar_fisik
            .findAll({
                where: {
                    tipe_ukt: req.params.id,
                },
                order: [["peserta", "ASC"]],
            })
            .then((standar_fisik) => {
                let mft = {
                    jenis: "mft",
                    Remaja_lk: standar_fisik[0].mft,
                    Remaja_prpn: standar_fisik[1].mft,
                    Privat_lk: standar_fisik[2].mft,
                    Privat_prpn: standar_fisik[3].mft,
                }
                let pushUp = {
                    jenis: "push_up",
                    Remaja_lk: standar_fisik[0].push_up,
                    Remaja_prpn: standar_fisik[1].push_up,
                    Privat_lk: standar_fisik[2].push_up,
                    Privat_prpn: standar_fisik[3].push_up,
                }
                let spirPerutAtas = {
                    jenis: "spir_perut_atas",
                    Remaja_lk: standar_fisik[0].spir_perut_atas,
                    Remaja_prpn: standar_fisik[1].spir_perut_atas,
                    Privat_lk: standar_fisik[2].spir_perut_atas,
                    Privat_prpn: standar_fisik[3].spir_perut_atas,
                }
                let spirPerutBawah = {
                    jenis: "spir_perut_bawah",
                    Remaja_lk: standar_fisik[0].spir_perut_bawah,
                    Remaja_prpn: standar_fisik[1].spir_perut_bawah,
                    Privat_lk: standar_fisik[2].spir_perut_bawah,
                    Privat_prpn: standar_fisik[3].spir_perut_bawah,
                }
                let spirDada = {
                    jenis: "spir_dada",
                    Remaja_lk: standar_fisik[0].spir_dada,
                    Remaja_prpn: standar_fisik[1].spir_dada,
                    Privat_lk: standar_fisik[2].spir_dada,
                    Privat_prpn: standar_fisik[3].spir_dada,
                }
                let spirPaha = {
                    jenis: "spir_paha",
                    Remaja_lk: standar_fisik[0].spir_paha,
                    Remaja_prpn: standar_fisik[1].spir_paha,
                    Privat_lk: standar_fisik[2].spir_paha,
                    Privat_prpn: standar_fisik[3].spir_paha,
                }
                let spirPahaBawah = {
                    jenis: "spir_paha_bawah",
                    Remaja_lk: standar_fisik[0].spir_paha_bawah,
                    Remaja_prpn: standar_fisik[1].spir_paha_bawah,
                    Privat_lk: standar_fisik[2].spir_paha_bawah,
                    Privat_prpn: standar_fisik[3].spir_paha_bawah,
                }
                let plank = {
                    jenis: "plank",
                    Remaja_lk: standar_fisik[0].plank,
                    Remaja_prpn: standar_fisik[1].plank,
                    Privat_lk: standar_fisik[2].plank,
                    Privat_prpn: standar_fisik[3].plank,
                }
                const response = {
                    mft: mft,
                    push_up: pushUp,
                    spir_perut_atas: spirPerutAtas,
                    spir_perut_bawah: spirPerutBawah,
                    spir_dada: spirDada,
                    spir_paha: spirPaha,
                    spir_paha_bawah: spirPahaBawah,
                    plank: plank,
                }

                res.json(response);
            })
            .catch((error) => {
                res.json({
                    message: error.message,
                });
            });
    },
    controllerGetByMft: async (req, res) => {
        standar_fisik
            .findAll({
                where: {
                    tipe_ukt: req.params.id,
                },
                order: [["peserta", "ASC"]],
                attributes: ['mft']
            })
            .then((standar_fisik) => {
                res.json({
                    jenis: "mft",
                    Remaja_lk: standar_fisik[0].mft,
                    Remaja_prpn: standar_fisik[1].mft,
                    Privat_lk: standar_fisik[2].mft,
                    Privat_prpn: standar_fisik[3].mft,
                });
            })
            .catch((error) => {
                res.json({
                    message: error.message,
                });
            });
    },
    controllerGetByPushUp: async (req, res) => {
        standar_fisik
            .findAll({
                where: {
                    tipe_ukt: req.params.id,
                },
                order: [["peserta", "ASC"]],
                attributes: ['push_up']
            })
            .then((standar_fisik) => {
                res.json({
                    jenis: "push_up",
                    Remaja_lk: standar_fisik[0].push_up,
                    Remaja_prpn: standar_fisik[1].push_up,
                    Privat_lk: standar_fisik[2].push_up,
                    Privat_prpn: standar_fisik[3].push_up,
                });
            })
            .catch((error) => {
                res.json({
                    message: error.message,
                });
            });
    },
    controllerGetBySpirPerutAtas: async (req, res) => {
        standar_fisik
            .findAll({
                where: {
                    tipe_ukt: req.params.id,
                },
                order: [["peserta", "ASC"]],
                attributes: ['spir_perut_atas']
            })
            .then((standar_fisik) => {
                res.json({
                    jenis: "spir_perut_atas",
                    Remaja_lk: standar_fisik[0].spir_perut_atas,
                    Remaja_prpn: standar_fisik[1].spir_perut_atas,
                    Privat_lk: standar_fisik[2].spir_perut_atas,
                    Privat_prpn: standar_fisik[3].spir_perut_atas,
                });
            })
            .catch((error) => {
                res.json({
                    message: error.message,
                });
            });
    },
    controllerGetBySpirPerutBawah: async (req, res) => {
        standar_fisik
            .findAll({
                where: {
                    tipe_ukt: req.params.id,
                },
                order: [["peserta", "ASC"]],
                attributes: ['spir_perut_bawah']
            })
            .then((standar_fisik) => {
                res.json({
                    jenis: "spir_perut_bawah",
                    Remaja_lk: standar_fisik[0].spir_perut_bawah,
                    Remaja_prpn: standar_fisik[1].spir_perut_bawah,
                    Privat_lk: standar_fisik[2].spir_perut_bawah,
                    Privat_prpn: standar_fisik[3].spir_perut_bawah,
                });
            })
            .catch((error) => {
                res.json({
                    message: error.message,
                });
            });
    },
    controllerGetBySpirDada: async (req, res) => {
        standar_fisik
            .findAll({
                where: {
                    tipe_ukt: req.params.id,
                },
                order: [["peserta", "ASC"]],
                attributes: ['spir_dada']
            })
            .then((standar_fisik) => {
                res.json({
                    jenis: "spir_dada",
                    Remaja_lk: standar_fisik[0].spir_dada,
                    Remaja_prpn: standar_fisik[1].spir_dada,
                    Privat_lk: standar_fisik[2].spir_dada,
                    Privat_prpn: standar_fisik[3].spir_dada,
                });
            })
            .catch((error) => {
                res.json({
                    message: error.message,
                });
            });
    },
    controllerGetByPlank: async (req, res) => {
        standar_fisik
            .findAll({
                where: {
                    tipe_ukt: req.params.id,
                },
                order: [["peserta", "ASC"]],
                attributes: ['plank']
            })
            .then((standar_fisik) => {
                res.json({
                    jenis: "plank",
                    Remaja_lk: standar_fisik[0].plank,
                    Remaja_prpn: standar_fisik[1].plank,
                    Privat_lk: standar_fisik[2].plank,
                    Privat_prpn: standar_fisik[3].plank,
                });
            })
            .catch((error) => {
                res.json({
                    message: error.message,
                });
            });
    },
    controllerAdd: async (req, res) => {
        let data = {
            tipe_ukt: req.body.tipe_ukt,
            peserta: req.body.peserta,
            mft: req.body.mft,
            push_up: req.body.push_up,
            spir_perut_atas: req.body.spir_perut_atas,
            spir_perut_bawah: req.body.spir_perut_bawah,
            spir_dada: req.body.spir_dada,
            spir_paha: req.body.spir_paha,
            plank: req.body.plank,
        };
        standar_fisik
            .create(data)
            .then((result) => {
                res.json({
                    message: "data has been inserted",
                });
            })
            .catch((error) => {
                res.json({
                    message: error.message,
                });
            });
    },
    controllerEdit: async (req, res) => {
        let param = {
            id_standar_fisik: req.params.id,
        };
        let data = {
            tipe_ukt: req.body.tipe_ukt,
            peserta: req.body.peserta,
            mft: req.body.mft,
            push_up: req.body.push_up,
            spir_perut_atas: req.body.spir_perut_atas,
            spir_perut_bawah: req.body.spir_perut_bawah,
            spir_dada: req.body.spir_dada,
            spir_paha: req.body.spir_paha,
            plank: req.body.plank,
        };
        standar_fisik
            .update(data, { where: param })
            .then((result) => {
                res.json({
                    message: "data has been updated",
                });
            })
            .catch((error) => {
                res.json({
                    message: error.message,
                });
            });
    },
    controllerEditMft: async (req, res) => {
        let data = [
            {
                mft: req.body.mft_remaja_laki,
            },
            {
                mft: req.body.mft_remaja_perempuan,
            },
            {
                mft: req.body.mft_privat_laki,
            },
            {
                mft: req.body.mft_privat_perempuan,
            },
        ];
        standar_fisik
            .findAll({
                where: {
                    tipe_ukt: req.params.id,
                },
                order: [["peserta", "ASC"]],
            })
            .then((result) => {
                for (let i = 0; i < 4; i++) {
                    console.log(result[i].id_standar_fisik);
                    console.log(result[i].peserta);
                    const idStandarFisik = result[i].id_standar_fisik;
                    standar_fisik.update(data[i], {
                        where: { id_standar_fisik: idStandarFisik },
                    });
                }
                res.json({
                    message: "data has been updated",
                });
            })
            .catch((e) => {
                res.json({
                    message: e.message,
                });
            });
    },
    controllerEditPushUp: async (req, res) => {
        let data = [
            {
                push_up: req.body.push_up_remaja_laki,
            },
            {
                push_up: req.body.push_up_remaja_perempuan,
            },
            {
                push_up: req.body.push_up_privat_laki,
            },
            {
                push_up: req.body.push_up_privat_perempuan,
            },
        ];
        standar_fisik
            .findAll({
                where: {
                    tipe_ukt: req.params.id,
                },
                order: [["peserta", "ASC"]],
            })
            .then((result) => {
                for (let i = 0; i < 4; i++) {
                    console.log(result[i].id_standar_fisik);
                    console.log(result[i].peserta);
                    const idStandarFisik = result[i].id_standar_fisik;
                    standar_fisik.update(data[i], {
                        where: { id_standar_fisik: idStandarFisik },
                    });
                }
                res.json({
                    message: "data has been updated",
                });
            })
            .catch((e) => {
                res.json({
                    message: e.message,
                });
            });
    },
    controllerEditSpirPerutAtas: async (req, res) => {
        let data = [
            {
                spir_perut_atas: req.body.spir_perut_atas_remaja_laki,
            },
            {
                spir_perut_atas: req.body.spir_perut_atas_remaja_perempuan,
            },
            {
                spir_perut_atas: req.body.spir_perut_atas_privat_laki,
            },
            {
                spir_perut_atas: req.body.spir_perut_atas_privat_perempuan,
            },
        ];
        standar_fisik
            .findAll({
                where: {
                    tipe_ukt: req.params.id,
                },
                order: [["peserta", "ASC"]],
            })
            .then((result) => {
                for (let i = 0; i < 4; i++) {
                    console.log(result[i].id_standar_fisik);
                    console.log(result[i].peserta);
                    const idStandarFisik = result[i].id_standar_fisik;
                    standar_fisik.update(data[i], {
                        where: { id_standar_fisik: idStandarFisik },
                    });
                }
                res.json({
                    message: "data has been updated",
                });
            })
            .catch((e) => {
                res.json({
                    message: e.message,
                });
            });
    },
    controllerEditSpirPerutBawah: async (req, res) => {
        let data = [
            {
                spir_perut_bawah: req.body.spir_perut_bawah_remaja_laki,
            },
            {
                spir_perut_bawah: req.body.spir_perut_bawah_remaja_perempuan,
            },
            {
                spir_perut_bawah: req.body.spir_perut_bawah_privat_laki,
            },
            {
                spir_perut_bawah: req.body.spir_perut_bawah_privat_perempuan,
            },
        ];
        standar_fisik
            .findAll({
                where: {
                    tipe_ukt: req.params.id,
                },
                order: [["peserta", "ASC"]],
            })
            .then((result) => {
                for (let i = 0; i < 4; i++) {
                    console.log(result[i].id_standar_fisik);
                    console.log(result[i].peserta);
                    const idStandarFisik = result[i].id_standar_fisik;
                    standar_fisik.update(data[i], {
                        where: { id_standar_fisik: idStandarFisik },
                    });
                }
                res.json({
                    message: "data has been updated",
                });
            })
            .catch((e) => {
                res.json({
                    message: e.message,
                });
            });
    },
    controllerEditSpirDada: async (req, res) => {
        let data = [
            {
                spir_dada: req.body.spir_dada_remaja_laki,
            },
            {
                spir_dada: req.body.spir_dada_remaja_perempuan,
            },
            {
                spir_dada: req.body.spir_dada_privat_laki,
            },
            {
                spir_dada: req.body.spir_dada_privat_perempuan,
            },
        ];
        standar_fisik
            .findAll({
                where: {
                    tipe_ukt: req.params.id,
                },
                order: [["peserta", "ASC"]],
            })
            .then((result) => {
                for (let i = 0; i < 4; i++) {
                    console.log(result[i].id_standar_fisik);
                    console.log(result[i].peserta);
                    const idStandarFisik = result[i].id_standar_fisik;
                    standar_fisik.update(data[i], {
                        where: { id_standar_fisik: idStandarFisik },
                    });
                }
                res.json({
                    message: "data has been updated",
                });
            })
            .catch((e) => {
                res.json({
                    message: e.message,
                });
            });
    },
    controllerEditSpirPaha: async (req, res) => {
        let data = [
            {
                spir_paha: req.body.spir_paha_remaja_laki,
            },
            {
                spir_paha: req.body.spir_paha_remaja_perempuan,
            },
            {
                spir_paha: req.body.spir_paha_privat_laki,
            },
            {
                spir_paha: req.body.spir_paha_privat_perempuan,
            },
        ];
        standar_fisik
            .findAll({
                where: {
                    tipe_ukt: req.params.id,
                },
                order: [["peserta", "ASC"]],
            })
            .then((result) => {
                for (let i = 0; i < 4; i++) {
                    console.log(result[i].id_standar_fisik);
                    console.log(result[i].peserta);
                    const idStandarFisik = result[i].id_standar_fisik;
                    standar_fisik.update(data[i], {
                        where: { id_standar_fisik: idStandarFisik },
                    });
                }
                res.json({
                    message: "data has been updated",
                });
            })
            .catch((e) => {
                res.json({
                    message: e.message,
                });
            });
    },
    controllerEditPlank: async (req, res) => {
        let data = [
            {
                plank: req.body.plank_remaja_laki,
            },
            {
                plank: req.body.plank_remaja_perempuan,
            },
            {
                plank: req.body.plank_privat_laki,
            },
            {
                plank: req.body.plank_privat_perempuan,
            },
        ];
        standar_fisik
            .findAll({
                where: {
                    tipe_ukt: req.params.id,
                },
                order: [["peserta", "ASC"]],
            })
            .then((result) => {
                for (let i = 0; i < 4; i++) {
                    console.log(result[i].id_standar_fisik);
                    console.log(result[i].peserta);
                    const idStandarFisik = result[i].id_standar_fisik;
                    standar_fisik.update(data[i], {
                        where: { id_standar_fisik: idStandarFisik },
                    });
                }
                res.json({
                    message: "data has been updated",
                });
            })
            .catch((e) => {
                res.json({
                    message: e.message,
                });
            });
    },
    controllerDelete: async (req, res) => {
        let param = {
            id_standar_fisik: req.params.id,
        };
        standar_fisik
            .destroy({ where: param })
            .then((result) => {
                res.json({
                    massege: "data has been deleted",
                });
            })
            .catch((error) => {
                res.json({
                    message: error.message,
                });
            });
    },
}