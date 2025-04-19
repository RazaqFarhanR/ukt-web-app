const models = require('../../../../models/index');
const senam = models.senam;
const { Op, Sequelize } = require("sequelize");

module.exports = {
    controllerGetAll: async (req, res) => {
        senam.findAll({
            attributes: ['tipe_ukt', 'id_senam', 'name'],
        })
            .then(senam => {
                res.json({
                    count: senam.length,
                    data: senam
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetByUkt: async (req, res) => {
        let limitSenam = 0;
        if (req.params.id === "UKT Jambon") {
            limitSenam = 15
        } else if (req.params.id === "UKT Hijau") {
            limitSenam = 30;
        } else if (req.params.id === "UKT Putih") {
            limitSenam = 35;
        } else if (req.params.id === "UKCW") {
            limitSenam = 45
        }
        senam.findAll({
            where: {
                tipe_ukt: req.params.id
            },
            order: [
                Sequelize.fn('RAND')
            ],
            attributes: ['id_senam', 'name'],
            limit: limitSenam
        })
            .then(senam => {
                res.json({
                    limit: limitSenam,
                    tipe_ukt: req.params.id,
                    data: senam
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
        senam.create(data)
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
            id_senam: req.params.id
        }
        let data = {
            tipe_ukt: req.body.tipe_ukt,
            name: req.body.name
        }
        senam.update(data, { where: param })
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
            id_senam: req.params.id
        }
        senam.destroy({ where: param })
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