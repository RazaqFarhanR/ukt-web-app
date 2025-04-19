'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ukt_siswa', {
      id_ukt_siswa: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tipe_ukt: {
        type: Sequelize.ENUM('UKT Jambon','UKT Hijau','UKT Putih','UKCW')
      },
      id_event: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "event",
          key: "id_event"
        }
      },
      id_siswa: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: "siswa",
          key: "id_siswa"
        }
      },
      rayon: {
        type: Sequelize.STRING
      },
      keshan: {
        type: Sequelize.INTEGER
      },
      senam: {
        type: Sequelize.DOUBLE
      },
      jurus: {
        type: Sequelize.DOUBLE
      },
      fisik: {
        type: Sequelize.DOUBLE
      },
      teknik: {
        type: Sequelize.DOUBLE
      },
      sambung: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ukt_siswa');
  }
};