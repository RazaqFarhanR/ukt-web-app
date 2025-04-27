require('dotenv').config();
const fs = require("fs");
const csv = require('csv-parser');
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);

const jwt = require("jsonwebtoken")

// const localStorage = process.env.LOCAL_STORAGE
const imagePath = process.env.GET_IMAGE
const localStorage = process.env.LOCAL_STORAGE + "/";

const models = require('../../models/index');
const { Sequelize, Op, where } = require("sequelize");
const penguji = models.penguji;
const cabang = models.cabang;
const ranting = models.ranting;

const d = new Date("2025-04-20");


module.exports = {
    controllerGetAll: async (req, res) => {

        penguji
            .findAll({
                where: {
                    createdAt: { [Op.gt]: d }
                },
                include: [
                    {
                        model: cabang,
                        as: "penguji_cabang",
                        attributes: ['name']
                    },
                    {
                        model: ranting,
                        as: "penguji_ranting",
                        attributes: ['name']
                    }
                ]
            })
            .then((penguji) => {
                // Map over the tipe_kamar array and add the image URL to each object
                const penguji_with_image_url = penguji.map((tk) => ({
                    ...tk.toJSON(),
                    image: `${imagePath}${tk.foto}`,
                }));
                res.json({
                    count: penguji_with_image_url.length,
                    data: penguji_with_image_url,
                });
            })
            .catch((error) => {
                res.json({
                    message: error.message,
                });
            });
    },
    controllerGetById: async (req, res) => {

        penguji
            .findOne({
                include: [
                    {
                        model: cabang,
                        as: "penguji_cabang",
                        attributes: ['name']
                    },
                    {
                        model: ranting,
                        as: "penguji_ranting",
                        attributes: ['name']
                    }
                ],
                where: {
                    id_penguji: req.params.id,
                    createdAt: { [Op.gt]: d }
                }
            })
            .then((penguji) => {
                // Map over the tipe_kamar array and add the image URL to each object
                const foto = penguji.foto
                res.json({
                    data: penguji,
                    image: imagePath + foto,
                });
            })
            .catch((error) => {
                res.json({
                    message: error.message,
                });
            });
    },
    controllerGetByNIW: async (req, res) => {
        try {
            let result = await penguji.findAll({
                where: {
                    NIW: req.params.id,
                    createdAt: { [Op.gt]: d }
                },
                attributes: ['id_penguji', 'NIW']
            });
            if (result.length > 0) {
                //ditemukan
                //set payload from data
                console.log("oi" + result)
                res.json({
                    data: result
                })
            } else {
                //tidak ditemukan
                res.json({
                    logged: false,
                    message: "NIW tidak cocok dengan akun penguji manapun",
                });
            }

        } catch (e) {
            res.status(404).json({ msg: e.message });
        }
    },
    controllerGetCountPenguji: async (req, res) => {
        penguji.findAll({
            where: { createdAt: { [Op.gt]: d } },
            attributes: ['id_ranting',  [Sequelize.fn('COUNT', Sequelize.col('id_ranting')), 'count']],
            group: ['id_ranting']
        })
            .then(result => {
                res.json({
                    count: result.length,
                    data: result
                });
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
    controllerGetByRanting: async (req, res) => {
        try {
            let result = await penguji.findAll({
                where: {
                    id_ranting: req.body.id_ranting,
                    id_role: req.body.id_role,
                    createdAt: { [Op.gt]: d }   
                }
            });
            if (result) {
                res.json({
                    count: result.length,
                    data: result
                })
            } else {
                //tidak ditemukan
                res.json({
                    logged: false,
                    message: "data ranting tidak ditemukan",
                });
            }

        } catch (e) {
            res.status(404).json({ msg: e.message });
        }
    },
    controllerGetByNameAndRanting: async (req, res) => {
        const name = req.body.name;
        const id_ranting = req.body.id_ranting;
        penguji
            .findAll({
                where: {
                    name: {
                        [Op.like]: "%" + name + "%",
                    },
                    id_ranting: {
                        [Op.like]: "%" + id_ranting + "%",
                    },
                    createdAt: { [Op.gt]: d }
                },
            })
            .then((penguji) => {
                res.json({
                    count: penguji.length,
                    data: penguji,
                });
            })
            .catch((error) => {
                res.json({
                    message: error.message,
                });
            });
    },
    controllerGetRantingFiltered: async (req, res) => {
        const rantings = req.body.ranting || ['BENDUNGAN', 'DONGKO', 'DURENAN', 'GANDUSARI', 'KAMPAK', 'KARANGAN', 'MUNJUNGAN', 'PANGGUL', 'POGALAN', 'PULE', 'SURUH', 'TRENGGALEK', 'TUGU', 'WATULIMO']
        penguji
            .findAll({
                where: {
                    id_role: {
                        [Op.like]: "%" + "penguji ranting" + "%",
                    },
                    id_ranting: {
                        [Op.in]: rantings
                    },
                    createdAt: { [Op.gt]: d }
                },
            })
            .then((penguji) => {
                res.json({
                    count: penguji.length,
                    data: penguji,
                });
            })
            .catch((error) => {
                res.json({
                    message: error.message,
                });
            });
    },
    controllerAdd: async (req, res) => {
        const Ranting = models.ranting;
        const hash = await bcrypt.hash(req.body.password, salt);
        try {
            if (req.body.id_ranting) {
                const ranting = await Ranting.findOne({
                    where: { id_ranting: req.body.id_ranting },
                });
                if (ranting) {
                    const data = {
                        NIW: req.body.niw,
                        name: req.body.name,
                        id_role: req.body.id_role,
                        id_ranting: req.body.id_ranting,
                        id_cabang: ranting.id_cabang, // set id_cabang based on the corresponding value in the ranting table
                        username: req.body.username,
                        foto: req.file?.filename,
                        password: hash,
                        no_wa: req.body.no_wa,
                    };
                    const result = await penguji.create(data);
                    res.json({
                        message: "data has been inserted",
                    });
                } else {
                    res.json({
                        message: "ranting not found"
                    })
                }
            } else if (!req.body.id_ranting) {
                const data = {
                    NIW: req.body.niw,
                    name: req.body.name,
                    id_role: req.body.id_role,
                    id_cabang: req.body.id_cabang,
                    foto: req.file.filename, // set id_cabang based on the corresponding value in the ranting table
                    username: req.body.username,
                    password: req.body.password,
                    no_wa: req.body.no_wa,
                };
                const result = await penguji.create(data);
                res.json({
                    message: "data has been inserted",
                });
            } else {
                req.json({
                    message: "error"
                })
            }
        } catch (error) {
            res.json(error);
        }
    },

    controllerCsv: async (req, res) => {
        let results = []
        fs.createReadStream(localStorage + req.file.filename)
            .pipe(csv({ headers: false }))
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                const promises = [];
                
                for (const data of results) {
                    const values = Object.values(data);
                    const hash = await bcrypt.hash(values[7], salt);
                    const newData = {
                        NIW: values[0],
                        name: values[1],
                        id_role: values[2],
                        id_ranting: values[3],
                        id_cabang: 'jatim',
                        username: values[5],
                        foto: "default.png",
                        password:  hash,
                        no_wa: values[8],
                    };
                    promises.push(penguji.create(newData));
                }

                Promise.all(promises)
                    .then(() => {
                        const csvPath = localStorage + req.file.filename;
                        fs.unlink(csvPath, (err) => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            console.log('csv deleted successfully');
                        })
                        res.json({ message: 'Data has been inserted' })
                    })
                    .catch((error) => {
                        res.json({ message: error.message })
                    })
            });
    },

    controllerAuth: async (req, res) => {
        try {
          const { username, password } = req.body;
      
          // Validasi input
          if (!username || !password) {
            return res.status(400).json({ msg: "Username dan password wajib diisi" });
          }
      
          const users = await penguji.findAll({
            where: { 
              username,
              createdAt: { [Op.gt]: d }
            },
            include: [
              {
                model: ranting,
                as: "penguji_ranting",
                attributes: ["name"],
              },
            ],
          });
      
          if (!users || users.length === 0) {
            return res.status(401).json({ msg: "Username tidak ditemukan" });
          }
      
          let matchedUser = null;
          for (let user of users) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
              matchedUser = user;
              break;
            }
          }
      
          if (!matchedUser) {
            return res.status(401).json({ msg: "Password salah" });
          }
      
          const allowedRoles = ["penguji cabang", "penguji ranting"];
          if (!allowedRoles.includes(matchedUser.id_role)) {
            return res.status(403).json({ msg: "Kamu bukan penguji yang berwenang" });
          }
      
          const token = jwt.sign(
            { idUser: matchedUser.id_penguji, role: matchedUser.id_role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1d" }
          );

          res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            // maxAge: 10 * 60 * 1000,
            maxAge: 24 * 60 * 60 * 1000,
          });
      
          const userResponse = {
            id: matchedUser.id_penguji,
            username: matchedUser.username,
            role: matchedUser.id_role,
            ranting: matchedUser.penguji_ranting?.name || null,
          };
      
          return res.status(200).json({
            success: true,
            message: "Login berhasil",
            data: userResponse,
            logged: true,
            token,
          });
      
        } catch (error) {
          console.error("Login error:", error);
          return res.status(500).json({ msg: "Terjadi kesalahan pada server" });
        }
    },      
    controllerEdit: async (req, res) => {
        const password = req.body.password == null ? 'check' : req.body.password
        const hash = await bcrypt.hash(password, salt);
        try {
            let param = {
                id_penguji: req.params.id,
            };
            let result = await penguji.findAll({
                where: param
            });
            if (result.length > 0) {
                let data = {
                    NIW: req.body.niw,
                    jabatan: req.body.jabatan,
                    name: req.body.name,
                    id_role: req.body.id_role,
                    id_ranting: req.body.id_ranting,
                    id_cabang: req.body.id_cabang,
                    foto: req.file?.filename,
                    username: req.body.username,
                    password: hash,
                    no_wa: req.body.no_wa,
                };
                let dataNoPsw = {
                    NIW: req.body.niw,
                    jabatan: req.body.jabatan,
                    name: req.body.name,
                    id_role: req.body.id_role,
                    id_ranting: req.body.id_ranting,
                    id_cabang: req.body.id_cabang,
                    foto: req.file?.filename,
                    username: req.body.username,
                    no_wa: req.body.no_wa,
                }
                if (req.file) {
                    const imagePath = localStorage + "/" + result[0].foto;
                    fs.unlink(imagePath, (err) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        console.log('User image deleted successfully');
                    });
                    data.foto = req.file.filename;
                }
                penguji
                    .update(req.body.password == null ? dataNoPsw : data, { where: param })
                    .then((result) => {
                        const imagePath = process.env.GET_IMAGE
                        penguji
                            .findOne({
                                include: [
                                    {
                                        model: cabang,
                                        as: "penguji_cabang",
                                        attributes: ['name']
                                    },
                                    {
                                        model: ranting,
                                        as: "penguji_ranting",
                                        attributes: ['name']
                                    }
                                ],
                                where: {
                                    id_penguji: req.params.id
                                }
                            })
                            .then((penguji) => {
                                // Map over the tipe_kamar array and add the image URL to each object
                                const foto = penguji.foto
                                res.json({
                                    data: penguji,
                                    image: `${imagePath}${foto}`,
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
                res.status(404).json({ msg: "User not found" });
            }
        } catch (error) {
            res.status(404).json({ msg: error.message });
        }
    },
    controllerDelete: async (req, res) => {
        let param = {
            id_penguji: req.params.id
        }
        penguji.findOne({
            where: param
        })
            .then(result => {
                if (result.foto) {
                    const imagePath = localStorage + "/" + result.foto;
                    fs.unlink(imagePath, (err) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        console.log('User image deleted successfully');
                    });
                }
                penguji.destroy({ where: param })
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
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    },
}