const models = require('../../../../models/index');
const belati = models.belati;
const { Op, Sequelize } = require("sequelize");

module.exports = {
    controllerGetAll: async (req, res) => {
        belati.findAll({
            attributes: ['tipe_ukt', 'id_belati', 'name'],
        })
            .then(belati => {
                res.json({
                    count: belati.length,
                    data: belati
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetByUkt: async (req, res) => {
        let limitbelati = 0;
        if (req.params.id === "UKT Jambon") {
            limitbelati = 15
        } else if (req.params.id === "UKT Hijau") {
            limitbelati = 30;
        } else if (req.params.id === "UKT Putih") {
            limitbelati = 35;
        } else if (req.params.id === "UKCW") {
            limitbelati = 45
        }
        belati.findAll({
            where: {
                tipe_ukt: req.params.id
            },
            order: [
                Sequelize.fn('RAND')
            ],
            attributes: ['id_belati', 'name'],
            limit: limitbelati
        })
            .then(belati => {
                res.json({
                    limit: limitbelati,
                    tipe_ukt: req.params.id,
                    data: belati
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
        belati.create(data)
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
            id_belati: req.params.id
        }
        let data = {
            tipe_ukt: req.body.tipe_ukt,
            name: req.body.name
        }
        belati.update(data, { where: param })
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
            id_belati: req.params.id
        }
        belati.destroy({ where: param })
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