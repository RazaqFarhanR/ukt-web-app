'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.siswa, {
        foreignKey: "id_event",
        as: "siswa_event"
      })
      this.hasMany(models.teknik_detail, {
        foreignKey: "id_event",
        as: "event_teknik"
      })
      this.hasMany(models.jurus_detail, {
        foreignKey: "id_event",
        as: "event_jurus"
      })
      this.hasMany(models.senam_detail, {
        foreignKey: "id_event",
        as: "event_senam"
      })
      this.hasMany(models.fisik, {
        foreignKey: "id_event",
        as: "event_fisik"
      })
      this.hasMany(models.sambung, {
        foreignKey: "id_event",
        as: "event_sambung"
      })
    }
  }
  event.init({
    id_event: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_ranting: DataTypes.STRING,
    name: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    tanggal: DataTypes.DATE,
    tipe_ukt: DataTypes.ENUM('UKT Jambon','UKT Hijau','UKT Putih','UKCW'),
  }, {
    sequelize,
    modelName: 'event',
    tableName: 'event'
  });
  return event;
};