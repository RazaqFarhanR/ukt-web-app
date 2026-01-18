const models = require('../../models/index');
const ranting = models.ranting;

module.exports = {
    controllerGetAll: async (req, res) => {
        ranting.findAll()
            .then(ranting => {
                res.json({
                    count: ranting.length,
                    data: ranting
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetAllSelect: async (req, res) => {
        ranting.findAll(
            { attributes: ['id_ranting', 'name'] }
        )
            .then(ranting => {
                ranting.map(r => {
                    r.dataValues.label = r.name;
                    r.dataValues.value = r.id_ranting;
                })
                res.json({
                    count: ranting.length,
                    data: ranting
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetAllPublic: async (req, res) => {
        ranting.findAll(
            {
                attributes: ['name']
            }
        )
            .then(ranting => {
                res.json({
                    count: ranting.length,
                    data: ranting
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetById: async (req, res) => {
        ranting.findAll({ where: { id_ranting: req.params.id } })
            .then(ranting => {
                res.json({
                    count: ranting.length,
                    data: ranting
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
            id_cabang: req.body.id_cabang,
            id_ranting: req.body.name,
            name: req.body.name,
        }
        ranting.create(data)
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
            id_ranting: req.params.id
        }
        let data = {
            id_cabang: req.body.id_cabang,
            id_ranting: req.body.id_ranting,
            name: req.body.name,
        }
        ranting.update(data, { where: param })
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
            id_ranting: req.params.id
        }
        ranting.destroy({ where: param })
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