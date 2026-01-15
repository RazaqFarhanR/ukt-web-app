'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
     await queryInterface.addColumn('penguji', 'active', {
      type: Sequelize.BOOLEAN,
      default: true,
      allowNull: true
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('siswa');
  }
};