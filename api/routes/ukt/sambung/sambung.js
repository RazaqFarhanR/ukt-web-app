//import library
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const Auth = require("../../../middleware/Auth.js");
const verifyRoles = require("../../../middleware/verifyRoles.js");
//implementasi
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//import model
const models = require("../../../src/models/index");
const sambung = models.sambung;
const detail_sambung = models.detail_sambung;
const siswa = models.siswa;

//endpoint ditulis disini

//endpoint get data sambung
app.get(
  "/",
  Auth,
  verifyRoles(
    "admin",
    "super admin",
    "admin ranting",
    "pengurus cabang",
    "pengurus ranting",
    "penguji"
  ),
  (req, res) => {
    sambung
      .findAll({
        include: [
          {
            model: detail_sambung,
            as: "detail_sambung",
            attributes: ["posisi", "id_siswa", "nilai"],
            include: [
              {
                model: siswa,
                as: "sambung_siswa",
                attributes: ["name"],
              },
            ],
          },
        ],
      })
      .then((sambung) => {
        res.json({
          count: sambung.length,
          data: sambung,
        });
      })
      .catch((error) => {
        res.json({
          message: error.message,
        });
      });
  }
);

// -- GET BY TIPE_UKT -- /
app.get(
  "/ukt/:id",
  Auth,
  verifyRoles(
    "admin",
    "super admin",
    "admin ranting",
    "pengurus cabang",
    "pengurus ranting",
    "penguji"
  ),
  (req, res) => {
    sambung
      .findAll({
        include: [
          {
            model: detail_sambung,
            as: "detail_sambung",
            attributes: ["posisi", "id_siswa", "nilai"],
            include: [
              {
                model: siswa,
                as: "sambung_siswa",
                attributes: ["name"],
              },
            ],
          },
          {
            model: models.penguji,
            as: "penguji_sambung",
            attributes: ['name']
          },
          {
            model: models.event,
            as: "event_sambung",
            attributes: ['name','tipe_ukt'],
            where: {
              tipe_ukt: req.params.id
            }
          }
        ],
      })
      .then((sambung) => {
        res.json({
          count: sambung.length,
          data: sambung,
        });
      })
      .catch((error) => {
        res.json({
          message: error.message,
        });
      });
  }
);
app.get(
  "/ukt/:id/:event",
  Auth,
  verifyRoles(
    "admin",
    "super admin",
    "admin ranting",
    "pengurus cabang",
    "pengurus ranting",
    "penguji"
  ),
  (req, res) => {
    sambung
      .findAll({
        include: [
          {
            model: detail_sambung,
            as: "detail_sambung",
            attributes: ["posisi", "id_siswa", "nilai"],
            include: [
              {
                model: siswa,
                as: "sambung_siswa",
                attributes: ["name","nomor_urut"],
              },
            ],
          },
          {
            model: models.penguji,
            as: "penguji_sambung",
            attributes: ['name']
          },
          {
            model: models.event,
            as: "event_sambung",
            attributes: ['name','tipe_ukt'],
            where: {
              id_event: req.params.event,
              tipe_ukt: req.params.id
            }
          }
        ],
      })
      .then((sambung) => {
        res.json({
          count: sambung.length,
          data: sambung,
        });
      })
      .catch((error) => {
        res.json({
          message: error.message,
        });
      });
  }
);

//endpoint untuk menyimpan data sambung, METHOD POST, function create
app.post(
  "/",
  Auth,
  verifyRoles(
    "admin",
    "super admin",
    "admin ranting",
    "pengurus cabang",
    "pengurus ranting",
    "penguji cabang",
    "penguji ranting"
  ),
  (req, res) => {
    let data = {
      id_event: req.body.id_event,
      id_penguji: req.body.id_penguji,
    };
    sambung
      .create(data)
      .then(async (result) => {
        console.log(result.dataValues.id_sambung);
        let id_sambung = result.dataValues.id_sambung;
        let data = [
          {
            id_sambung: id_sambung,
            posisi: 1,
            id_siswa: req.body.id_siswa1,
            nilai: req.body.nilai1,
          },
          {
            id_sambung: id_sambung,
            posisi: 2,
            id_siswa: req.body.id_siswa2,
            nilai: req.body.nilai2,
          },
        ];
        for (let i = 0; i < 2; i++) {
          if (data[i]) {
            let dataDetail = detail_sambung.build(data[i]);
            await dataDetail.save();
          } else {
            console.log(`data ${i} tidak ditemukan`);
          }
        }
        const response = {
          message: "data has been inserted",
          data: {
            id_siswa1: req.body.id_siswa1,
            id_siswa2: req.body.id_siswa2,
          },
        };
        res.json(response);
      })
      .catch((error) => {
        res.json({
          message: error.message,
        });
      });
  }
);

//endpoint untuk mengupdate data sambung, METHOD: PUT, fuction: UPDATE
app.put(
  "/:id",
  Auth,
  verifyRoles(
    "admin",
    "super admin",
    "admin ranting",
    "pengurus cabang",
    "pengurus ranting",
    "penguji"
  ),
  (req, res) => {
    sambung
      .findAll({
        where: { id_sambung: req.params.id },
        include: [
          {
            model: detail_sambung,
            as: "detail_sambung",
            attributes: ["id_detail_sambung", "posisi", "id_siswa", "nilai"],
            include: [
              {
                model: siswa,
                as: "sambung_siswa",
                attributes: ["name"],
              },
            ],
          },
        ],
      })
      .then((sambung) => {
        for (let i = 0; i < 2; i++) {
          console.log(sambung[0].detail_sambung[i].id_detail_sambung);
          let data = [
            {
              posisi: 1,
              nilai: req.body.nilai1,
            },
            {
                posisi: 2,
                nilai: req.body.nilai2
            }
          ];
          const id = sambung[0].detail_sambung[i].id_detail_sambung;
          detail_sambung.update(data[i], {where: {id_detail_sambung: id}});
        }
        const response = {
            message: "data has been updated",
            data: {
              id_siswa1: req.body.id_siswa1,
              id_siswa2: req.body.id_siswa2,
            },
          };
          res.json(response);
      })
      .catch((error) => {
        res.json({
          message: error.message,
        });
      });
  }
);

//endpoint untuk menghapus data sambung,METHOD: DELETE, function: destroy
app.delete(
  "/:id",
  Auth,
  verifyRoles(
    "admin",
    "super admin",
    "admin ranting",
    "pengurus cabang",
    "pengurus ranting",
    "penguji"
  ),
  (req, res) => {
    sambung
      .findAll({
        where: {id_sambung: req.params.id},
        include: [
          {
            model: detail_sambung,
            as: "detail_sambung",
            attributes: ["id_detail_sambung","posisi", "id_siswa", "nilai"],
            include: [
              {
                    model: siswa,
                as: "sambung_siswa",
                attributes: ["name"],
              },
            ],
          },
        ],
      })
      .then((sambung) => {
        for (let i = 0; i < 2; i++) {
            console.log(sambung[0].detail_sambung[i].id_detail_sambung);

            const id = sambung[0].detail_sambung[i].id_detail_sambung;
            detail_sambung.destroy({where: {id_detail_sambung: id}});
        }
        const sambung1 = models.sambung;
        sambung1.destroy({where: {id_sambung:req.params.id}})
        .then((result) => {
            res.json({
                message: 'data has been deleted'
            })
        })
      })
      .catch((error) => {
        res.json({
          message: error.message,
        });
      });
  }
);

module.exports = app;
