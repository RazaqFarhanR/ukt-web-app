'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cabang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.penguji, {
        foreignKey: "id_cabang",
        as: "penguji_cabang"
      })
      this.hasMany(models.pengurus, {
        foreignKey: "id_cabang",
        as: "pengurus_cabang"
      })
      this.hasMany(models.ranting, {
        foreignKey: "id_cabang",
        as: "cabang_ranting"
      })
    }
  }
  cabang.init({
    id_cabang: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'cabang',
    tableName: 'cabang'
  });
  return cabang;
};