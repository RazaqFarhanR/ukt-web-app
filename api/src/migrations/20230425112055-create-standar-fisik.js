'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('standar_fisik', {
      id_standar_fisik: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tipe_ukt: {
        allowNull: false,
        type: Sequelize.ENUM('UKT Jambon','UKT Hijau','UKT Putih','UKCW')
      },
      peserta: {
        allowNull: false,
        type: Sequelize.ENUM('Remaja - Laki laki','Remaja - Perempuan','Privat - Laki laki','Privat - Perempuan')
      },
      mft: {
        type: Sequelize.DOUBLE
      },
      push_up: {
        type: Sequelize.INTEGER
      },
      spir_perut_atas: {
        type: Sequelize.INTEGER
      },
      spir_perut_bawah: {
        type: Sequelize.INTEGER
      },
      spir_dada: {
        type: Sequelize.INTEGER
      },
      plank: {
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
    await queryInterface.dropTable('standar_fisik');
  }
};