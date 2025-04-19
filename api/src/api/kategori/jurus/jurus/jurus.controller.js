const models = require('../../../../models/index');
const jurus = models.jurus;

module.exports = {
    controllerGetAll: async (req, res) => {
        jurus.findAll()
            .then(jurus => {
                res.json({
                    count: jurus.length,
                    data: jurus
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetByTipeUkt: async (req, res) => {
        jurus.findAll({
            where: {
                tipe_ukt: req.params.id
            },
            attributes: ['id_jurus', 'name']
        })
            .then(jurus => {
                res.json({
                    count: jurus.length,
                    tipe_ukt: req.params.id,
                    data: jurus
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
            name: req.body.name
        }
        jurus.create(data)
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
            id_jurus: req.params.id
        }
        let data = {
            tipe_ukt: req.body.tipe_ukt,
            name: req.body.name
        }
        jurus.update(data, { where: param })
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
            id_jurus: req.params.id
        }
        jurus.destroy({ where: param })
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