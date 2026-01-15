'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('belati_siswa', {
      id_belati_siswa: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_belati_detail: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "belati_detail",
          key: "id_belati_detail"
        }
      },
      id_belati: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "belati",
          key: "id_belati"
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
    await queryInterface.dropTable('belati_siswa');
  }
};