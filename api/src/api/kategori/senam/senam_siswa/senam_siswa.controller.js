const models = require('../../../../models/index');
const senam_siswa = models.senam_siswa;

module.exports = {
    controllerGetAll: async (req, res) => {
        senam_siswa.findAll()
            .then(senam_siswa => {
                res.json({
                    count: senam_siswa.length,
                    data: senam_siswa
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetBytipeUkt: async (req, res) => {
        senam_siswa.findAll({
            attributes: ['id_senam_siswa', 'id_senam_detail'],
            include: [
                {
                    model: models.senam_detail,
                    attributes: ['name', 'tipe_ukt'],
                    as: "siswa_senam",
                    required: false
                }
            ],
            where: {
                tipe_ukt: req.params.id
            }
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
    controllerGetByRanting: async (req, res) => {
        senam_siswa.findAll({
            where: {
                ranting: req.params.id
            }
        })
            .then(senam_siswa => {
                res.json({
                    count: senam_siswa.length,
                    data: senam_siswa
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetByIdSiswa: async (req, res) => {
        senam_siswa.findAll({
            attributes: ['id_senam_siswa','id_siswa','id_senam', 'predikat'],
            where: {
                id_siswa: req.params.id
            },
            include: [
                {
                    model: models.senam,
                    attributes: ['name','tipe_ukt'],
                    as: "siswa_senam",
                    required: false
                }
            ]
        })
        .then(senam => {
            console.log(senam[0].predikat)
            const nilai = []
            for(let i=0; i < senam.length; i++) {
                if(senam[i].predikat == true){
                  nilai.push('true');
                }
            }
            console.log(nilai.length);
            res.json({
                count: senam.length,
                senam_benar: nilai.length,
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
        let data ={
            id_senam_detail: req.body.id_senam_detail,
            id_senam: req.body.id_senam,
            predikat: req.body.predikat
        }
        senam_siswa.create(data)
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
            id_senam_siswa : req.params.id
        }
        let data ={
            id_senam_detail: req.body.id_senam_detail,
            id_senam: req.body.id_senam,
            predikat: req.body.predikat
        }
        senam_siswa.update(data, {where: param})
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
            id_senam_siswa : req.params.id
        }
        senam_siswa.destroy({where: param})
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
            id_senam_detail : req.params.id
        }
        senam_siswa.findAll({where: param})
        .then(result => {
            for(let i=0; i<result.length; i++){
                let data = result[i].dataValues.id_senam
                senam_siswa.destroy({where: {
                    id_senam: data
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