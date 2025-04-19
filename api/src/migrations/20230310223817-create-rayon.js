'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rayon', {
      id_rayon: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_ranting: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "ranting",
          key: "id_ranting"
        }
      },
      name: {
        type: Sequelize.STRING
      },
      alamat: {
        type: Sequelize.STRING
      },
      tanggal: {
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
    await queryInterface.dropTable('rayon');
  }
};