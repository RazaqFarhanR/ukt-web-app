//import library
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
const { randomUUID } = require("crypto");
const Auth = require('../middleware/Auth.js');
const verifyRoles = require("../middleware/verifyRoles")

//implementasi
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//import model
const models = require("../src/models/index");
const user = models.user;
const ranting = models.ranting;

//import auth
const jwt = require("jsonwebtoken");
const localStorage = process.env.LOCAL_STORAGE
const getImage = process.env.GET_IMAGE;
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

//endpoint get data semua user
app.get("/", (req, res) => {
  const imagePath = getImage;

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
});
app.get("/:id", Auth, verifyRoles("super admin", "admin"),(req, res) => {
  const imagePath = getImage;
  user
    .findOne({
      where:{
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
});

//endpoint untuk menyimpan data user, METHOD POST, function create
app.post("/", Auth, verifyRoles("super admin", "admin"), upload2.single("foto"), async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, salt);

  let data = {
    NIW: req.body.niw,
    username: req.body.username,
    name: req.body.name,
    id_role: req.body.id_role,
    id_ranting: req.body.id_ranting,
    foto: req.file.filename,
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
});

//endpoint untuk mengupdate data user, METHOD: PUT, fuction: UPDATE
app.put("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang"), upload2.single("foto"), async (req, res) => {
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
      await user
        .update(req.body.password == null ? dataNoPsw : data, { where: param })
        .then((result) => {
          const imagePath = getImage;
            user
              .findOne({
                where:{
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
      res.status(404).json({ msg: "User not found" });
    }
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
});

//endpoint untuk menghapus data user,METHOD: DELETE, function: destroy
app.delete("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting"), (req, res) => {
  let param = {
    id_user: req.params.id,
  };
  user
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

app.post("/niw", Auth, verifyRoles("admin", "super admin", "admin ranting"), async (req, res) => {
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
    res.status(404).json({ msg: error.message });
  }
})

//endpoint login user (authorization), METHOD: POST, function: findOne
app.post("/auth", async (req, res) => {
  //cari data user yang username dan password sama dengan input
  try {
    let result = await user.findAll({
      where: {
        username: req.body.username,
      },
    });
    if (result) {
      //ditemukan
      //set payload from data
      console.log("oi" + req.body.password);
      const match = await bcrypt.compare(req.body.password, result[0].password);
      if (!match) return res.status(400).json({ msg: "password salah" });
      if (result[0].id_role === "admin" || "super admin" || "admin ranting") {
        const idUser = result[0].id_user;
        const role = result[0].id_role;
        console.log(role);
        const id = randomUUID();

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
        res.status(404).json({ msg: "Kamu Bukan Admin" });
      }
    } else {
      //tidak ditemukan
      res.json({
        logged: false,
        message: "Invalid username or password",
      });
    }
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
});

module.exports = app;
