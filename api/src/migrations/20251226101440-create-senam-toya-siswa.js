'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('senam_toya_siswa', {
      id_senam_toya_siswa: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_senam_toya_detail: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "senam_toya_detail",
          key: "id_senam_toya_detail"
        }
      },
      id_senam_toya: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "senam_toya",
          key: "id_senam_toya"
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
    await queryInterface.dropTable('senam_toya_siswa');
  }
};