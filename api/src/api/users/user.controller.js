require('dotenv').config();
const fs = require("fs");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);

const jwt = require("jsonwebtoken");

const localStorage = process.env.LOCAL_STORAGE
const imagePath = process.env.GET_IMAGE

const models = require("../../models/index")
const user = models.user
const ranting = models.ranting;

module.exports = {
    controllerGetAll: async (req, res) => {

        user
            .findAll({
                include: [
                    {
                        model: ranting,
                        as: "user_ranting",
                        attributes: ['name'],
                        required: false,
                    }
                ]
            })
            .then((user) => {
                // Map over the tipe_kamar array and add the image URL to each object
                const user_with_image_url = user.map((tk) => ({
                    ...tk.toJSON(),
                    image: `${imagePath}${tk.foto}`,
                }));
                res.json({
                    count: user_with_image_url.length,
                    data: user_with_image_url,
                });
            })
            .catch((error) => {
                res.json({
                    message: error.message,
                });
            });
    },
    controllerGetById: async (req, res) => {
        user
            .findOne({
                where: {
                    id_user: req.params.id
                },
                include: [
                    {
                        model: ranting,
                        as: "user_ranting",
                        attributes: ['name'],
                        required: false,
                    }
                ]
            })
            .then((user) => {
                res.json({
                    data: user,
                    image: imagePath + user.foto
                });
            })
            .catch((error) => {
                res.json({
                    message: error.message,
                });
            });
    },
    controllerAdd: async (req, res) => {
        const hash = await bcrypt.hash(req.body.password, salt);

        let data = {
            NIW: req.body.niw,
            username: req.body.username,
            name: req.body.name,
            id_role: req.body.id_role,
            id_ranting: req.body.id_ranting,
            foto: req.file?.filename,
            password: hash,
            no_wa: req.body.no_wa,
        };
        user
            .create(data)
            .then((result) => {
                res.json({
                    message: "data has been inserted",
                });
            })
            .catch((error) => {
                res.json({
                    message: error.message,
                });
            });
    },
    controllerNiw: async (req, res) => {
        try {
            let niw = await user.findAll({
                where: {
                    NIW: req.body.niw
                }
            });
            res.json({
                data: niw
            })
        } catch (e) {
            res.status(404).json({ message: error.message });
        }
    },
    controllerAuth: async (req, res) => {
        try {
            const username = req.body.username;
            let result = await user.findAll({
                where: {
                    username: username,
                },
            });
            if (result) {
                const match = await bcrypt.compare(req.body.password, result[0].password);
                if (!match) return res.status(400).json({ message: "password salah" });
                if (result[0].id_role === "admin" || "super admin" || "admin ranting") {
                    const idUser = result[0].id_user;
                    const role = result[0].id_role;

                    // generate token based on payload and secret_key
                    let localToken = jwt.sign({ idUser, role }, process.env.ACCESS_TOKEN_SECRET);

                    const data = await user.findAll({
                        where: {
                            username: req.body.username,
                        },
                        include: [
                            {
                                model: ranting,
                                attributes: ['name'],
                                as: "user_ranting"
                            }
                        ]
                    });
                    res.json({
                        logged: true,
                        data: data[0],
                        token: localToken,
                    });
                } else {
                    res.status(404).json({ message: "Kamu Bukan Admin" });
                }
            } else {
                //tidak ditemukan
                res.json({
                    logged: false,
                    message: "Invalid username or password",
                });
            }
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    },
    controllerEdit: async (req, res) => {
        const password = req.body.password == null ? 'check' : req.body.password
        const hash = await bcrypt.hash(password, salt);
        try {
            let param = {
                id_user: req.params.id,
            };
            let result = await user.findAll({
                where: param
            });
            if (result.length > 0) {
                let data = {
                    NIW: req.body.niw,
                    username: req.body.username,
                    name: req.body.name,
                    id_role: req.body.id_role,
                    id_ranting: req.body.id_ranting,
                    foto: req.file?.filename,
                    password: hash,
                    no_wa: req.body.no_wa,
                };
                let dataNoPsw = {
                    NIW: req.body.niw,
                    username: req.body.username,
                    name: req.body.name,
                    id_role: req.body.id_role,
                    id_ranting: req.body.id_ranting,
                    foto: req.file?.filename,
                    no_wa: req.body.no_wa,
                };
                if (req.file) {
                    const oldImagePath = path.join(localStorage, result[0].foto);
                    
                    if (result[0].foto !== 'default.png') {
                        fs.unlink(oldImagePath, (err) => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            // console.log('User image deleted successfully');
                        });
                        data.foto = req.file.filename;
                    } else {
                        // console.log('Skipping delete for default.png');
                    }
                }
                await user
                    .update(req.body.password == null ? dataNoPsw : data, { where: param })
                    .then((result) => {
                        const imagePath = process.env.GET_IMAGE
                        user
                            .findOne({
                                where: {
                                    id_user: req.params.id
                                },
                                include: [
                                    {
                                        model: ranting,
                                        as: "user_ranting",
                                        attributes: ['name'],
                                        required: false,
                                    }
                                ]
                            })
                            .then((user) => {
                                res.json({
                                    data: user,
                                    image: imagePath + user.foto
                                });
                            })
                            .catch((error) => {
                                res.json({
                                    message: error.message,
                                });
                            });
                    })
                    .catch((error) => {
                        res.json({
                            message: error.message,
                        });
                    });
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    },
    controllerDelete: async (req, res) => {
        let param = {
            id_user: req.params.id,
        };
        user
            .destroy({ where: param })
            .then((result) => {
                if (result.foto) {
                    const oldImagePath = localStorage + result.foto;
                    
                    if (result.foto !== 'default.png') {                    
                        fs.unlink(oldImagePath, (err) => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            // console.log('User image deleted successfully');
                        });
                    } else {
                        // console.log('Skipping delete for default.png');
                    }
                }
                res.json({
                    massege: "data has been deleted",
                });
            })
            .catch((error) => {
                res.json({
                    message: error.message,
                });
            });
    },
}