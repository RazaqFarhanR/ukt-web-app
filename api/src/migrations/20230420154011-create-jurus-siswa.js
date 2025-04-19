'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('jurus_siswa', {
      id_jurus_siswa: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_jurus_detail: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "jurus_detail",
          key: "id_jurus_detail"
        }
      },
      id_jurus: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "jurus",
          key: "id_jurus"
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
    await queryInterface.dropTable('jurus_siswa');
  }
};