'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ukt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ukt.init({
    id_ukt: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    tipe_ukt: DataTypes.ENUM('UKT Jambon','UKT Hijau','UKT Putih','UKCW'),
    keshan: DataTypes.INTEGER,
    senam: DataTypes.INTEGER,
    jurus: DataTypes.INTEGER,
    teknik: DataTypes.INTEGER,
    sambung: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ukt',
    tableName: 'ukt',
  });
  return ukt;
};