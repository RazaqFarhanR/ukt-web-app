'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('soal', {
      id_soal: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      id_lembar_soal: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "lembar_soal",
          key: "id_lembar_soal"
        }
      },
      pertanyaan: {
        type: Sequelize.STRING
      },
      opsi1: {
        type: Sequelize.STRING
      },
      opsi2: {
        type: Sequelize.STRING
      },
      opsi3: {
        type: Sequelize.STRING
      },
      opsi4: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('soal');
  }
};