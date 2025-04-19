'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('fisik', {
      id_fisik: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id_penguji: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "penguji",
          key: "id_penguji"
        }
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
        references: {
          model: "siswa",
          key: "id_siswa"
        }
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
    await queryInterface.dropTable('fisiks');
  }
};