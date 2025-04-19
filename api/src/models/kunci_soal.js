'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class kunci_soal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.soal, {
        foreignKey: "id_soal",
        as: "soal"
      })
    }
  }
  kunci_soal.init({
    id_kunci_soal: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: false,
      allowNull: false
    },
    id_soal: DataTypes.STRING,
    opsi: DataTypes.ENUM('opsi1', 'opsi2', 'opsi3', 'opsi4')
  }, {
    sequelize,
    modelName: 'kunci_soal',
    tableName: 'kunci_soal'
  });
  return kunci_soal;
};