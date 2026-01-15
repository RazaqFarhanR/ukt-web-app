'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('ukt_siswa', 'belati', {
      type: Sequelize.DOUBLE,
      allowNull: true,
      defaultValue: 0
    });
    await queryInterface.addColumn('ukt_siswa', 'kripen', {
      type: Sequelize.DOUBLE,
      allowNull: true,
      defaultValue: 0
    });
    await queryInterface.addColumn('ukt_siswa', 'senam_toya', {
      type: Sequelize.DOUBLE,
      allowNull: true,
      defaultValue: 0
    });
    await queryInterface.addColumn('ukt_siswa', 'jurus_toya', {
      type: Sequelize.DOUBLE,
      allowNull: true,
      defaultValue: 0
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ukt_siswa');
  }
};
