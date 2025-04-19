'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class fisik extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.siswa, {
        foreignKey: "id_siswa",
        as: "siswa_fisik"
      })
      this.belongsTo(models.event, {
        foreignKey: "id_event",
        as: "event_fisik"
      })
      this.belongsTo(models.penguji, {
        foreignKey: "id_penguji",
        as: "penguji_fisik"
      })
    }
  }
  fisik.init({
    id_fisik: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    id_siswa: {
      type: DataTypes.INTEGER,
      primaryKey: false,
      allowNull: false
    },
    id_penguji: DataTypes.INTEGER,
    id_event: DataTypes.INTEGER,
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
    modelName: 'fisik',
    tableName: 'fisik'
  });
  return fisik;
};