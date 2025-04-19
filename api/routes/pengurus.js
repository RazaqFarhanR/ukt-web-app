//import library
const express = require('express');
const bodyParser = require('body-parser');
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
app.use(bodyParser.urlencoded({extended: true}));

//import model
const models = require('../src/models/index');
const { sequelize, Op } = require("sequelize");
const pengurus = models.pengurus;
const ranting = models.ranting;

//import auth
const auth = require("../auth")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "BelajarNodeJSItuMenyengankan";

const localStorage = process.env.LOCAL_STORAGE
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
//endpoint get data pengurus
app.get("/", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting"), (req,res) => {
    const imagePath = "http://localhost:8080/image/"
    pengurus.findAll({    
      include: [
        {
          model: ranting,
          as: 'pengurus_ranting',
          attributes: ['name']
        }
      ]
    })
    .then(pengurus => {
        const pengurus_with_image_url = pengurus.map((tk) => ({
            ...tk.toJSON(),
            image: `${imagePath}${tk.foto}`,
          }));
        res.json({
            count: pengurus_with_image_url.length,
            data: pengurus_with_image_url
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})
//endpoint get data pengurus berdasarkan name dan id_ranting
app.post("/name_dan_ranting", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang", "pengurus ranting"), (req,res) => {
    const name = req.body.name;
    const id_ranting = req.body.id_ranting;
    pengurus.findAll({
        where: {
            name: {
                [Op.like]: '%'+name+'%'
            },
            id_ranting: {
                [Op.like]: '%'+id_ranting+'%'
            }
        }
    })
    .then(pengurus => {
        res.json({
            count: pengurus.length,
            data: pengurus
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })    
})

//endpoint untuk menyimpan data pengurus, METHOD POST, function create
app.post("/", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang"), upload2.single('foto'), async (req,res) =>{
    const hash = await bcrypt.hash(req.body.password, salt);
    let data ={
        NIW: req.body.niw,
        jabatan: req.body.jabatan,
        name: req.body.name,
        id_role: req.body.id_role,
        id_ranting: req.body.id_ranting,
        id_cabang: req.body.id_cabang,
        username: req.body.username,
        password: hash,
        foto: req.file.filename,
        no_wa: req.body.no_wa
    }
    pengurus.create(data)
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
}) 

app.post("/niw", async (req, res) => {
  try {
    let niw = await pengurus.findAll({
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

//endpoint untuk mengupdate data user, METHOD: PUT, fuction: UPDATE
app.put("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang"), upload2.single("foto"), async (req, res) => {
  const password = req.body.password != null ? req.body.password : "freestyle"
  const hash = await bcrypt.hash(password, salt);
  try {
    let param = {
      id_pengurus: req.params.id,
    };
    let result = await pengurus.findAll({
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
        username: req.body.username,
        password: hash,
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
      pengurus
        .update(password != null ? data : dataNoPsw, { where: param })
        .then((result) => {
          res.json({
            message: "data has been updated",
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

//endpoint untuk menghapus data pengurus,METHOD: DELETE, function: destroy
app.delete("/:id", Auth, verifyRoles("admin", "super admin", "admin ranting", "admin cabang", "pengurus cabang"), (req,res) => {
    let param = {
        id_pengurus : req.params.id
    }
    pengurus.destroy({where: param})
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
})

//endpoint login user (authorization), METHOD: POST, function: findOne
app.post("/auth", async (req, res) => {
    let data = {
      username: req.body.username,
      password: req.body.password,
    };
  
    //cari data user yang username dan password sama dengan input
    try {
      let result = await pengurus.findAll({ where: {
          username: req.body.username
      } });
      if (result) {
        //ditemukan
        //set payload from data
        console.log("oi" + req.body.password)
        const match = await bcrypt.compare(req.body.password, result[0].password);
        if (!match) return res.status(400).json({ msg: "password salah" });
        if (result[0].id_role === "penguji ranting" || "pengurus cabang") {
          const idUser = result[0].id_penguji;
          const role = result[0].id_role;
          const id = randomUUID();
          // generate token based on payload and secret_key
          let localToken = jwt.sign({ idUser, role }, process.env.ACCESS_TOKEN_SECRET);
  
          const data = await pengurus.findAll({
            where: {
              username: req.body.username,
            },
            include: [
              {
                model: ranting,
                as: 'pengurus_ranting',
                attributes: ['name']
              }
            ]
          });
          res.json({
            logged: true,
            data: data[0],
            token: localToken,
          });
        } else {
          res.status(404).json({ msg: "Kamu Bukan Pengurus" });
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