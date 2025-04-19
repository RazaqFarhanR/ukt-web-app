'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('senam_siswa', {
      id_senam_siswa: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_senam_detail: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "senam_detail",
          key: "id_senam_detail"
        }
      },
      id_senam: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "senam",
          key: "id_senam"
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
    await queryInterface.dropTable('senam_siswa');
  }
};