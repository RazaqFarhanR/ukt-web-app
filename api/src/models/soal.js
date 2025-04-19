'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class soal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.lembar_soal, {
        foreignKey: "id_lembar_soal",
        as: "lembar_soal_ujian"
      })
      this.hasOne(models.kunci_soal, {
        foreignKey: "id_soal",
        as: "kunci_soal"
      })
    }
  }
  soal.init({
    id_soal: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: false,
      allowNull: false
    },
    id_lembar_soal: DataTypes.STRING,
    paket: DataTypes.INTEGER,
    pertanyaan: DataTypes.STRING,
    opsi1: DataTypes.STRING,
    opsi2: DataTypes.STRING,
    opsi3: DataTypes.STRING,
    opsi4: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'soal',
    tableName: 'soal',
  });
  return soal;
};