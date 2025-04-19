'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class standarSenam extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  standarSenam.init({
    id_standar_fisik: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    tipe_ukt: DataTypes.ENUM('UKT Jambon','UKT Hijau','UKT Putih','UKCW'),
    peserta: DataTypes.ENUM('Remaja - Laki laki','Remaja - Perempuan','Privat - Laki laki','Privat - Perempuan'),
    mft: DataTypes.DOUBLE,
    push_up: DataTypes.INTEGER,
    spir_perut_atas: DataTypes.INTEGER,
    spir_perut_bawah: DataTypes.INTEGER,
    spir_dada: DataTypes.INTEGER,
    spir_paha: DataTypes.INTEGER,
    plank: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'standar_fisik',
    tableName: 'standar_fisik',
  });
  return standarSenam;
};