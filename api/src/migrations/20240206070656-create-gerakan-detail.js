'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('gerakan_detail', {
      id_detail: {
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
      name: {
        type: Sequelize.STRING
      },
      posisi: {
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
    await queryInterface.dropTable('gerakan_detail');
  }
};