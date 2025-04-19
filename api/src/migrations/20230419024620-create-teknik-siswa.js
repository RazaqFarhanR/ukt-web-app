'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('teknik_siswa', {
      id_teknik_siswa: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_teknik: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "teknik",
          key: "id_teknik"
        }
      },
      id_teknik_detail: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "teknik_detail",
          key: "id_teknik_detail"
        }
      },
      predikat: {
        type: Sequelize.ENUM('KURANG','CUKUP','BAIK')
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
    await queryInterface.dropTable('teknik_siswa');
  }
};