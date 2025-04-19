'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sambung', {
      id_sambung: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_event: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "event",
          key: "id_event"
        }
      },
      id_penguji: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "penguji",
          key: "id_penguji"
        }
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
    await queryInterface.dropTable('sambung');
  }
};