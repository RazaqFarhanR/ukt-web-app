const models = require('../../models/index');
const cabang = models.cabang;

module.exports = {
    controllerGetAll: async (req, res) => {
        cabang.findAll()
            .then(cabang => {
                res.json({
                    count: cabang.length,
                    data: cabang
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
            id_cabang: req.body.name,
            name: req.body.name
        }
        cabang.create(data)
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
            id_cabang: req.params.id
        }
        let data = {
            id_cabang: req.body.name,
            name: req.body.name
        }
        cabang.update(data, { where: param })
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
            id_cabang: req.params.id
        }
        cabang.destroy({ where: param })
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