'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('jurus_toya_siswa', {
      id_jurus_toya_siswa: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_jurus_toya_detail: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "jurus_toya_detail",
          key: "id_jurus_toya_detail"
        }
      },
      id_jurus_toya: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "jurus_toya",
          key: "id_jurus_toya"
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
    await queryInterface.dropTable('jurus_toya_siswa');
  }
};