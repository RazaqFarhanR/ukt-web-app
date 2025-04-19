'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lembar_jawaban', {
      id_lembar_jawaban: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      id_session: {
        type: Sequelize.INTEGER
      },
      id_siswa: {
        type: Sequelize.INTEGER
      },
      id_soal: {
        type: Sequelize.STRING
      },
      answer: {
        type: Sequelize.ENUM('benar', 'salah', 'kosong'),
        defaultValue:('kosong')
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
    await queryInterface.dropTable('lembar_jawaban');
  }
};