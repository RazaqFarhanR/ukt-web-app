const models = require('../../../../models/index');
const kripen_siswa = models.kripen_siswa;

module.exports = {
    controllerGetAll: async (req, res) => {
        kripen_siswa.findAll()
            .then(kripen_siswa => {
                res.json({
                    count: kripen_siswa.length,
                    data: kripen_siswa
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetBytipeUkt: async (req, res) => {
        kripen_siswa.findAll({
            attributes: ['id_kripen_siswa', 'id_kripen_detail'],
            include: [
                {
                    model: models.kripen_detail,
                    attributes: ['name', 'tipe_ukt'],
                    as: "siswa_kripen",
                    required: false
                }
            ],
            where: {
                tipe_ukt: req.params.id
            }
        })
            .then(kripen => {
                res.json({
                    count: kripen.length,
                    data: kripen
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetByRanting: async (req, res) => {
        kripen_siswa.findAll({
            where: {
                ranting: req.params.id
            }
        })
            .then(kripen_siswa => {
                res.json({
                    count: kripen_siswa.length,
                    data: kripen_siswa
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetByIdSiswa: async (req, res) => {
        kripen_siswa.findAll({
            attributes: ['id_kripen_siswa','id_siswa','id_kripen', 'predikat'],
            where: {
                id_siswa: req.params.id
            },
            include: [
                {
                    model: models.kripen,
                    attributes: ['name','tipe_ukt'],
                    as: "siswa_kripen",
                    required: false
                }
            ]
        })
        .then(kripen => {
            console.log(kripen[0].predikat)
            const nilai = []
            for(let i=0; i < kripen.length; i++) {
                if(kripen[i].predikat == true){
                  nilai.push('true');
                }
            }
            console.log(nilai.length);
            res.json({
                count: kripen.length,
                kripen_benar: nilai.length,
                data: kripen
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
    },
    controllerAdd: async (req, res) => {
        let data ={
            id_kripen_detail: req.body.id_kripen_detail,
            id_kripen: req.body.id_kripen,
            predikat: req.body.predikat
        }
        kripen_siswa.create(data)
        .then(result => {
            res.json({
                message: "data has been inserted"
            })
        })
        .catch(error =>{
            res.json({
                message: error.message
            })
        })
    },
    controllerEdit: async (req, res) => {
        let param = {
            id_kripen_siswa : req.params.id
        }
        let data ={
            id_kripen_detail: req.body.id_kripen_detail,
            id_kripen: req.body.id_kripen,
            predikat: req.body.predikat
        }
        kripen_siswa.update(data, {where: param})
        .then(result => {
            res.json({
                message : "data has been updated"
            })
        })
        .catch(error => {
            res.json({
                message  : error.message
            })
        })
    },
    controllerDelete: async (req, res) => {
       let param = {
            id_kripen_siswa : req.params.id
        }
        kripen_siswa.destroy({where: param})
        .then(result => {
            res.json({
                massege : "data has been deleted"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
    },
    controllerDeleteWithDetail: async (req, res) => {
        let param = {
            id_kripen_detail : req.params.id
        }
        kripen_siswa.findAll({where: param})
        .then(result => {
            for(let i=0; i<result.length; i++){
                let data = result[i].dataValues.id_kripen
                kripen_siswa.destroy({where: {
                    id_kripen: data
                }})
            }
            res.json({
                massege : "data has been deleted"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
    },
}