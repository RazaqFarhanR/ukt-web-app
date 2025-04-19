'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('detail_sambung', {
      id_detail_sambung: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_sambung: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "sambung",
          key: "id_sambung"
        }
      },
      posisi: {
        type: Sequelize.INTEGER
      },
      id_siswa: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "siswa",
          key: "id_siswa"
        }
      },
      nilai: {
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
    await queryInterface.dropTable('detail_sambung');
  }
};