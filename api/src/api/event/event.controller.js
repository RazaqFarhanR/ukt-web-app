const models = require('../../models/index');
const event = models.event;

module.exports = {
    controllerGetAll: async (req, res) => {
        event.findAll()
            .then(event => {
                res.json({
                    count: event.length,
                    data: event
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetByTipeUktRanting: async (req, res) => {
        event.findAll({
            where: {
                tipe_ukt: req.params.id,
                id_ranting: req.params.ranting,
                is_active: true
            }
        })
            .then(event => {
                res.json({
                    count: event.length,
                    data: event
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetByTipeUkt: async (req, res) => {
        event.findAll({
            where: {
                tipe_ukt: req.params.id,
                is_active: true
            }
        })
            .then(event => {
                res.json({
                    count: event.length,
                    data: event
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetByTipeUktSearch: async (req, res) => {
        event.findAll({
            where: {
                tipe_ukt: req.params.id,
                is_active: true
            },
            attribute: ['id_event','name', 'tipe_ukt']
        })
            .then(event => {
                const transformedEvents = event.map(item => {
                    return {
                        value: item.id_event, // Assuming 'name' is the property you want as value
                        label: item.name // Assuming 'label' is the property you want as label
                    };
                });      
                res.json({
                    count: transformedEvents.length,
                    data: transformedEvents
                });
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetByTipeUktPUBLIC: async (req, res) => {
        event.findAll({
            where: {
                tipe_ukt: req.params.id,
                is_active: true
            }
        })
            .then(event => {
                res.json({
                    count: event.length,
                    data: event
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
            name: req.body.name,
            tanggal: req.body.tanggal,
            id_ranting: req.body.id_ranting,
            tipe_ukt: req.body.tipe_ukt,
            is_active: req.body.is_active
        }
        event.create(data)
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
            id_event: req.params.id
        }
        let data = {
            name: req.body.name,
            tanggal: req.body.tanggal,
            id_ranting: req.body.id_ranting,
            tipe_ukt: req.body.tipe_ukt,
            is_active: req.body.is_active
        }
        event.update(data, { where: param })
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
            id_event: req.params.id
        }
        event.destroy({ where: param })
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