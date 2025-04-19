const models = require('../../../../models/index');
const teknik_siswa = models.teknik_siswa;

module.exports = {
    controllerGetAll: async (req, res) => {
        teknik_siswa.findAll()
            .then(teknik_siswa => {
                res.json({
                    count: teknik_siswa.length,
                    data: teknik_siswa
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetByTipeUkt: async (req, res) => {
        teknik_siswa.findAll({
            where: {
                tipe_ukt: req.params.id
            }
        })
            .then(teknik_siswa => {
                res.json({
                    count: teknik_siswa.length,
                    data: teknik_siswa
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetByDetail: async (req, res) => {
        teknik_siswa.findAll({
            where: {
                id_teknik_detail: req.params.id
            }
        })
            .then(teknik_siswa => {
                res.json({
                    count: teknik_siswa.length,
                    data: teknik_siswa
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
            id_teknik_detail: req.body.id_teknik_detail,
            id_teknik: req.body.id_teknik,
            predikat: req.body.predikat
        }
        teknik_siswa.create(data)
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
            id_teknik_siswa: req.params.id
        }
        let data = {
            id_teknik_detail: req.body.id_teknik_detail,
            id_teknik: req.body.id_teknik,
            predikat: req.body.predikat
        }
        teknik_siswa.update(data, { where: param })
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
            id_teknik_siswa: req.params.id
        }
        teknik_siswa.destroy({ where: param })
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