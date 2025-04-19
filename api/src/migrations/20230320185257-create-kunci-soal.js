'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('kunci_soal', {
      id_kunci_soal: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      id_soal: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "soal",
          key: "id_soal"
        }
      },
      opsi: {
        type: Sequelize.ENUM('opsi1', 'opsi2', 'opsi3', 'opsi4')
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
    await queryInterface.dropTable('kunci_soal');
  }
};