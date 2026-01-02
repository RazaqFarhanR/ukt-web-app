//import library
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
const { randomUUID } = require('crypto');
require('dotenv').config();
const Auth = require('../middleware/Auth.js');
const verifyRoles = require("../middleware/verifyRoles");

//implementasi
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//import model
const models = require("../src/models/index");
const { Op } = require("sequelize");
const penguji = models.penguji;

//import auth
const auth = require("../auth")
const jwt = require("jsonwebtoken")

const localStorage = process.env.LOCAL_STORAGE
const cabang = models.cabang;
const ranting = models.ranting;

//konfigurasi proses upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // set file storage
    cb(null, localStorage);
  },
  filename: (req, file, cb) => {
    // generate file name
    cb(null, "foto-" + Date.now() + path.extname(file.originalname));
  },
});

let upload2 = multer({ storage: storage });

//endpoint ditulis disini
//endpoint get data penguji
app.get("/", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req, res) => {
  const imagePath = "http://localhost:8080/image/"

  penguji
    .findAll({
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
});
app.get("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), (req, res) => {
  const imagePath = "http://localhost:8080/image/"

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
        image: imagePath + foto,
      });
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
});

app.get("/NIW/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji cabang", "penguji ranting"), async (req, res) => {
  try {
    let result = await penguji.findAll({
      where: {
        NIW: req.params.id
      },
      attributes: ['id_penguji','NIW']
    });
    if (result.length > 0 ) {
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
    res.status(404).json({ message: e.message });
  }
})

//endpoint get data penguji cabang berdasarkan nama dan ranting
app.post("/name_dan_ranting", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji ranting"), (req, res) => {
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
});

app.post("/", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting"), upload2.single("foto"), async (req, res) => {
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
          foto: req.file.filename,
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
    res.json({
      message: error.message,
    });
  }
});

//endpoint untuk mengupdate data user, METHOD: PUT, fuction: UPDATE
app.put("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting", "penguji ranting", "penguji cabang"), upload2.single("foto"), async (req, res) => {
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
      let dataNoPsw ={
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
        const imagePath = localStorage + "/" +  result[0].foto;
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
          const imagePath = "http://localhost:8080/image/"
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
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

//endpoint untuk menghapus data penguji,METHOD: DELETE, function: destroy
app.delete("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting"), (req, res) => {
  let param = {
    id_penguji: req.params.id,
  };
  penguji
    .destroy({ where: param })
    .then((result) => {
      res.json({
        massege: "data has been deleted",
      });
    })
    .catch((error) => {
      res.json({
        message: error.message,
      });
    });
});

//endpoint login user (authorization), METHOD: POST, function: findOne
app.post("/auth", async (req, res) => {
  let data = {
    username: req.body.username,
    password: req.body.password,
  };

  //cari data user yang username dan password sama dengan input
  try {
    let result = await penguji.findAll({ where: {
        username: req.body.username
    } });
    if (result) {
      //ditemukan
      //set payload from data
      console.log("oi" + req.body.password)
      const match = await bcrypt.compare(req.body.password, result[0].password);
      if (!match) return res.status(400).json({ message: "password salah" });
      if (result[0].id_role === "penguji cabang" || "penguji ranting") {
        const idUser = result[0].id_penguji;
        const role = result[0].id_role;
        const id = randomUUID();
        // generate token based on payload and secret_key
        let localToken = jwt.sign({ idUser, role }, process.env.ACCESS_TOKEN_SECRET);

        const data = await penguji.findAll({
          where: {
            username: req.body.username,
          },
          include: [
            {
              model: ranting,
              as: "penguji_ranting",
              attributes: ['name'],
            }
          ]
        });
        res.json({
          logged: true,
          data: data[0],
          token: localToken,
        });
      } else {
        res.status(404).json({ message: "Kamu Bukan Penguji" });
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
});


module.exports = app;
