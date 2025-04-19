const models = require('../../models/index');
const ukt = models.ukt;

module.exports = {
    controllerGetAll: async (req, res) => {
        ukt.findAll()
            .then(ukt => {
                res.json({
                    count: ukt.length,
                    data: ukt
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
            keshan: req.body.keshan,
            senam: req.body.senam,
            jurus: req.body.jurus,
            fisik: req.body.fisik,
            teknik: req.body.teknik,
            sambung: req.body.sambung
        }
        ukt.create(data)
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
            id_ukt: req.params.id
        }
        let data = {
            tipe_ukt: req.body.tipe_ukt,
            keshan: req.body.keshan,
            senam: req.body.senam,
            jurus: req.body.jurus,
            fisik: req.body.fisik,
            teknik: req.body.teknik,
            sambung: req.body.sambung
        }
        ukt.update(data, { where: param })
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
            id_ukt: req.params.id
        }
        ukt.destroy({ where: param })
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