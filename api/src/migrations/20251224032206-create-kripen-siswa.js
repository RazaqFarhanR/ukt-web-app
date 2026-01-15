'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('kripen_siswa', {
      id_kripen_siswa: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_kripen_detail: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "kripen_detail",
          key: "id_kripen_detail"
        }
      },
      id_kripen: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "kripen",
          key: "id_kripen"
        }
      },
      predikat: {
        type: Sequelize.BOOLEAN,
        allowNull: true
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
    await queryInterface.dropTable('kripen_siswa');
  }
};