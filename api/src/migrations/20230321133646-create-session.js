'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('session', {
      id_session: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_lembar_soal: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "lembar_soal",
          key: "id_lembar_soal"
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
      id_event: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "event",
          key: "id_event"
        }
      },
      nilai: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      waktu_pengerjaan: {
        type: Sequelize.INTEGER
      },
      start: {
        type: Sequelize.DATE
      },
      finish: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('session');
  }
};