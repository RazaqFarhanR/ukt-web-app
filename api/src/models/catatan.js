'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class catatan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.ranting, {
        foreignKey: "id_ranting",
        as: "ranting"
      })
      this.belongsTo(models.cabang, {
        foreignKey: "id_cabang",
        as: "cabang"
      })
    }
  }
  catatan.init({
    id_catatan: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    id_cabang: {
      allowNull: true,
      type: DataTypes.STRING
    },
    id_ranting: {
      allowNull: true,
      type: DataTypes.STRING
    },
    text: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'catatan',
    tableName: 'catatan',
  });
  return catatan;
};