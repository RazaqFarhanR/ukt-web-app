'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ukt', {
      id_ukt: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tipe_ukt: {
        allowNull: false,
        type: Sequelize.ENUM('UKT Jambon','UKT Hijau','UKT Putih','UKCW')
      },
      keshan: {
        type: Sequelize.INTEGER
      },
      senam: {
        type: Sequelize.INTEGER
      },
      jurus: {
        type: Sequelize.INTEGER
      },
      teknik: {
        type: Sequelize.INTEGER
      },
      sambung: {
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
    await queryInterface.dropTable('ukt');
  }
};