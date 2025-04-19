'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ranting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.penguji, {
        foreignKey: "id_ranting",
        as: "penguji_ranting"
      })
      this.hasMany(models.pengurus, {
        foreignKey: "id_ranting",
        as: "pengurus_ranting"
      })
      this.hasMany(models.user, {
        foreignKey: "id_ranting",
        as: "user_ranting"
      })
      this.hasMany(models.siswa, {
        foreignKey: "id_ranting",
        as: "siswa_ranting"
      })
      this.hasMany(models.lembar_soal, {
        foreignKey: "id_ranting",
        as: "lembar_ranting"
      })
      this.belongsTo(models.cabang, {
        foreignKey: "id_cabang",
        as: "cabang_ranting"
      })
    }
  }
  ranting.init({
    id_ranting: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    id_cabang: DataTypes.STRING,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ranting',
    tableName: 'ranting'
  });
  return ranting;
};