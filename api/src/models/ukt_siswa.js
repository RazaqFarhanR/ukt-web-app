'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ukt_siswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.event, {
        foreignKey: "id_event",
        as: "event_ukt_siswa"
      })
      this.belongsTo(models.siswa, {
        foreignKey: "id_siswa",
        as: "siswa_ukt_siswa"
      })
    }
  }
  ukt_siswa.init({
    id_ukt_siswa: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    tipe_ukt: DataTypes.ENUM('UKT Jambon', 'UKT Hijau', 'UKT Putih', 'UKCW'),
    id_event: DataTypes.INTEGER,
    id_siswa: {
      type: DataTypes.INTEGER,
      unique: true
    },
    rayon: DataTypes.STRING,
    keshan: DataTypes.INTEGER,
    senam: DataTypes.DOUBLE,
    jurus: DataTypes.DOUBLE,
    fisik: DataTypes.DOUBLE,
    teknik: DataTypes.DOUBLE,
    belati: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    kripen: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    senam_toya: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    jurus_toya: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    sambung: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ukt_siswa',
    tableName: 'ukt_siswa',
  });
  return ukt_siswa;
};