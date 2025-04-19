const models = require('../../models/index');
const catatan = models.catatan;

module.exports = {
    controllerGetAll: async (req, res) => {
        catatan.findAll()
            .then(catatan => {
                res.json({
                    logged: true,
                    count: catatan.length,
                    data: catatan
                })
            })
            .catch(error => {
                res.json({
                    logged: false,
                    message: error.message
                })
            })
    },
    controllerGetCabang: async (req, res) => {
        catatan.findOne({
            where: {
                id_cabang: req.params.id
            }
        })
            .then(catatan => {
                res.json({
                    logged: true,
                    count: catatan.length,
                    data: catatan
                })
            })
            .catch(error => {
                res.json({
                    logged: false,
                    message: error.message
                })
            })
    },
    controllerGetRanting: async (req, res) => {
        catatan.findOne({
            where: {
                id_ranting: req.params.id
            }
        })
            .then(catatan => {
                res.json({
                    logged: true,
                    count: catatan.length,
                    data: catatan
                })
            })
            .catch(error => {
                res.json({
                    logged: false,
                    message: error.message
                })
            })
    },
    controllerAdd: async (req, res) => {
        let data = {
            id_cabang: req.body.id_cabang,
            id_ranting: req.body.id_ranting,
            text: req.body.text
        }
        catatan.create(data)
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
            id_catatan: req.params.id
        }
        let data = {
            id_cabang: req.body.id_cabang,
            id_ranting: req.body.id_ranting,
            text: req.body.text
        }
        catatan.update(data, { where: param })
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
            id_catatan: req.params.id
        }
        catatan.destroy({ where: param })
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