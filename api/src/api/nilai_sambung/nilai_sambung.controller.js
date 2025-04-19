const models = require('../../models/index');
const nilaiSambung = models.nilai_sambung;

module.exports = {
    controllerGetAll: async (req, res) => {
        nilaiSambung.findAll({})
            .then(result => {
                res.json({
                    logged: true,
                    data: result
                })
            })
            .catch(error => {
                res.json({
                    meesage: error.message
                })
            })
    },
    controllerAdd: async (req, res) => {
        let data = {
            tipe: req.body.tipe,
            name: req.body.name,
            nilai1: req.body.nilai1,
            nilai2: req.body.nilai2
        }
        nilaiSambung.create(data)
            .then(result => {
                res.json({
                    logged: true,
                    message: "data has been inserted"
                })
            })
            .catch(error => {
                res.json({
                    logged: false,
                    message: error.message
                })
            })
    },
    controllerEdit: async (req, res) => {
        let param = {
            id_nilai_sambung: req.params.id
        }
        let data = {
            tipe: req.body.tipe,
            name: req.body.name,
            nilai1: req.body.nilai1,
            nilai2: req.body.nilai2
        }
        nilaiSambung.update(data, { where: param })
            .then(result => {
                res.json({
                    logged: true,
                    message: "data has been inserted"
                })
            })
            .catch(error => {
                res.json({
                    logged: false,
                    message: error.message
                })
            })
    },
    controllerDelete: async (req, res) => {
        let param = {
            id_nilai_sambung: req.params.id
        }
        nilaiSambung.destroy({ where: param })
            .then(result => {
                res.json({
                    logged: true,
                    massege: "data has been deleted"
                })
            })
            .catch(error => {
                res.json({
                    logged: false,
                    message: error.message
                })
            })
    },
}