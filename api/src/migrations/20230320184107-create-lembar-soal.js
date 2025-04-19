'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lembar_soal', {
      id_lembar_soal: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      id_ranting: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "ranting",
          key: "id_ranting"
        }
      },
      tipe_ukt: {
        type: Sequelize.ENUM('UKT Jambon','UKT Hijau','UKT Putih','UKCW')
      },
      waktu_pengerjaan: {
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
    await queryInterface.dropTable('lembar_soal');
  }
};