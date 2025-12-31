const models = require('../../../../models/index');
const belati_siswa = models.belati_siswa;

module.exports = {
    controllerGetAll: async (req, res) => {
        belati_siswa.findAll()
            .then(belati_siswa => {
                res.json({
                    count: belati_siswa.length,
                    data: belati_siswa
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetBytipeUkt: async (req, res) => {
        belati_siswa.findAll({
            attributes: ['id_belati_siswa', 'id_belati_detail'],
            include: [
                {
                    model: models.belati_detail,
                    attributes: ['name', 'tipe_ukt'],
                    as: "siswa_belati",
                    required: false
                }
            ],
            where: {
                tipe_ukt: req.params.id
            }
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
    controllerGetByRanting: async (req, res) => {
        belati_siswa.findAll({
            where: {
                ranting: req.params.id
            }
        })
            .then(belati_siswa => {
                res.json({
                    count: belati_siswa.length,
                    data: belati_siswa
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetByIdSiswa: async (req, res) => {
        belati_siswa.findAll({
            attributes: ['id_belati_siswa','id_siswa','id_belati', 'predikat'],
            where: {
                id_siswa: req.params.id
            },
            include: [
                {
                    model: models.belati,
                    attributes: ['name','tipe_ukt'],
                    as: "siswa_belati",
                    required: false
                }
            ]
        })
        .then(belati => {
            console.log(belati[0].predikat)
            const nilai = []
            for(let i=0; i < belati.length; i++) {
                if(belati[i].predikat == true){
                  nilai.push('true');
                }
            }
            console.log(nilai.length);
            res.json({
                count: belati.length,
                belati_benar: nilai.length,
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
        let data ={
            id_belati_detail: req.body.id_belati_detail,
            id_belati: req.body.id_belati,
            predikat: req.body.predikat
        }
        belati_siswa.create(data)
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
            id_belati_siswa : req.params.id
        }
        let data ={
            id_belati_detail: req.body.id_belati_detail,
            id_belati: req.body.id_belati,
            predikat: req.body.predikat
        }
        belati_siswa.update(data, {where: param})
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
            id_belati_siswa : req.params.id
        }
        belati_siswa.destroy({where: param})
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
            id_belati_detail : req.params.id
        }
        belati_siswa.findAll({where: param})
        .then(result => {
            for(let i=0; i<result.length; i++){
                let data = result[i].dataValues.id_belati
                belati_siswa.destroy({where: {
                    id_belati: data
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