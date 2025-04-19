const models = require('../../models/index');
const lembar_jawaban = models.lembar_jawaban;

module.exports = {
    controllerGetByIdSession: async (req, res) => {
        let data = {
            id_session: req.params.id,
        }
    
        await lembar_jawaban.findAll({
            where: data,
            order: [
                ['createdAt', 'ASC']
            ]
        })
        .then(result => {
            res.json({
                message: "successfuly",
                data: result
            })
        })
        .catch(error =>{
            res.json({
                message: error.message
            })
        })
    },
    controllerCheckAnswer: async (req, res) => {
        let data = {
            id_session: req.body.id_session,
            id_siswa: req.body.id_siswa,
        }
    
        await lembar_jawaban.findOne({where: data})
        .then(result => {
            res.json({
                message: "successfuly",
                data: result
            })
        })
        .catch(error =>{
            res.json({
                message: error.message
            })
        })
    },
    controllerAdd: async (req, res) => {
        let data = {
            id_session: req.body.id_session,
            id_siswa: req.body.id_siswa,
            id_soal: req.body.id_soal,
        }
    
        const cekData = await lembar_jawaban.findOne({where: data})
        
        if (!cekData) {
            lembar_jawaban.create(data)
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
        }else{
            res.json({
                message: "data sudah ada"
            })
        }
    },
    controllerEdit: async (req, res) => {
        let param = {
            id_session: req.body.id_session,
            id_siswa: req.body.id_siswa,
            id_soal: req.body.id_soal,
        }
    
        let data = {
            answer: req.body.answer
        }
        lembar_jawaban.update(data, {where: param})
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
    controllerDeleteByIdSession: async (req, res) => {
        let param = {
            id_session: req.params.id,
        }
    
        lembar_jawaban.destroy({where: param})
        .then(result => {
            res.json({
                massege : "data has been deleted"
            })
        })
        .catch(error =>{
            res.json({
                message: error.message
            })
        })
    },
}