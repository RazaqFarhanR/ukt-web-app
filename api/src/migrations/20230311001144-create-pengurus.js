'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pengurus', {
      id_pengurus: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      NIW: {
        type: Sequelize.STRING
      },
      jabatan: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      id_role: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "role",
          key: "id_role"
        }
      },
      id_ranting: {
        type: Sequelize.STRING
      },
      id_cabang: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: "cabang",
          key: "id_cabang"
        }
      },
      username: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      foto: {
        type: Sequelize.STRING,
        allowNull: true
      },
      no_wa: {
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
    await queryInterface.dropTable('pengurus');
  }
};