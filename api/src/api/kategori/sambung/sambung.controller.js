const models = require('../../../models/index');
const sambung = models.sambung;
const detail_sambung = models.detail_sambung;
const siswa = models.siswa;


module.exports = {
  controllerGetAll: async (req, res) => {
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
  },
  controllerSearch: async (req, res) => {
    sambung.findAll({
      include: [
        {
          model: models.siswa,
          as: "sambung_siswa",
          attributes: ['nomor_urut', 'name'],
          where: {
            [Op.or]: [
              { name: { [Op.like]: `%${req.params.id}%` } },
              { nomor_urut: { [Op.like]: `%${req.params.id}%` } }
            ]
          }
        },
      ]
    })
      .then(result => {
        res.json({
          count: result.length,
          data: result
        })
      })
      .catch(error => {
        res.json({
          message: error.message
        })
      })
  },
  controllerGetByUkt: async (req, res) => {
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
            attributes: ['name', 'tipe_ukt'],
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
  },
  controllerGetByUktEvent: async (req, res) => {
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
                attributes: ["name", "nomor_urut"],
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
            attributes: ['name', 'tipe_ukt'],
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
  },
  controllerAdd: async (req, res) => {
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
        const insertedDetailIds = [];

        for (let i = 0; i < 2; i++) {
          if (data[i]) {
            let dataDetail = detail_sambung.build(data[i]);
            await dataDetail.save();

            // Assuming id_detail_sambung is a property of dataDetail
            const generatedId = dataDetail.id_detail_sambung;
            insertedDetailIds.push(generatedId);
          } else {
            console.log(`data ${i} tidak ditemukan`);
          }
        }

        const response = {
          message: "data has been inserted",
          data: {
            id_siswa1: req.body.id_siswa1,
            id_siswa2: req.body.id_siswa2,
            id_sambung: id_sambung,
          },
        };

        res.json(response);

      })
      .catch((error) => {
        res.json({
          message: error.message,
        });
      });
  },
  controllerEdit: async (req, res) => {
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
          detail_sambung.update(data[i], { where: { id_detail_sambung: id } });
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
  },
  controllerDelete: async (req, res) => {
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

          const id = sambung[0].detail_sambung[i].id_detail_sambung;
          detail_sambung.destroy({ where: { id_detail_sambung: id } });
        }
        const sambung1 = models.sambung;
        sambung1.destroy({ where: { id_sambung: req.params.id } })
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
  },
}