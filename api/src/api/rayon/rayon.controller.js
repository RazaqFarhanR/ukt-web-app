const models = require('../../models/index');
const rayon = models.rayon;

module.exports = {
    controllerGetAll: async (req, res) => {
        rayon.findAll()
            .then(rayon => {
                res.json({
                    count: rayon.length,
                    data: rayon
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
            id_ranting: req.body.id_ranting,
            name: req.body.name,
            alamat: req.body.alamat,
            tanggal: req.body.tanggal
        }
        rayon.create(data)
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
            id_rayon: req.params.id
        }
        let data = {
            id_ranting: req.body.id_ranting,
            name: req.body.name,
            alamat: req.body.alamat,
            tanggal: req.body.tanggal
        }
        rayon.update(data, { where: param })
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
            id_rayon: req.params.id
        }
        rayon.destroy({ where: param })
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