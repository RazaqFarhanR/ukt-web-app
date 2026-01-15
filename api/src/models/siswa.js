'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class siswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.role, {
        foreignKey: "id_role",
        as: "siswa_role"
      })
      this.belongsTo(models.ranting, {
        foreignKey: "id_ranting",
        as: "siswa_ranting"
      })
      this.belongsTo(models.event, {
        foreignKey: "id_event",
        as: "siswa_event"
      })
      this.hasMany(models.senam_detail, {
        foreignKey: "id_siswa",
        as: "senam_siswa"
      })
      this.hasMany(models.jurus_detail, {
        foreignKey: "id_siswa",
        as: "jurus_siswa"
      })
      this.hasMany(models.teknik_detail, {
        foreignKey: "id_siswa",
        as: "siswa_teknik"
      })
      this.hasMany(models.fisik, {
        foreignKey: "id_siswa",
        as: "siswa_fisik"
      })
      this.hasMany(models.ukt_siswa, {
        foreignKey: "id_siswa",
        as: "siswa_ukt_siswa"
      })
      this.hasMany(models.detail_sambung, {
        foreignKey: "id_siswa",
        as: "sambung_siswa"
      })
      this.hasMany(models.gerakan, {
        foreignKey: "id_siswa",
        as: "gerakan_siswa"
      })
      this.hasMany(models.belati_detail, {
        foreignKey: "id_siswa",
        as: "belati_siswa"
      })
      this.hasMany(models.kripen_detail, {
        foreignKey: "id_siswa",
        as: "kripen_siswa"
      })
      this.hasMany(models.jurus_toya_detail, {
        foreignKey: "id_siswa",
        as: "jurus_toya_siswa"
      })
      this.hasMany(models.senam_toya_detail, {
        foreignKey: "id_siswa",
        as: "senam_toya_siswa"
      })
    }
  }
  siswa.init({
    id_siswa: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_event: DataTypes.INTEGER,
    nomor_urut: {
      type: DataTypes.INTEGER,
      unique: true
    },
    name: DataTypes.STRING,
    id_role: DataTypes.STRING,
    jenis_kelamin: DataTypes.ENUM('Laki laki','Perempuan'),
    jenis_latihan: DataTypes.ENUM('Remaja','Privat'),
    peserta: DataTypes.ENUM('Remaja - Laki laki','Remaja - Perempuan','Privat - Laki laki','Privat - Perempuan'),
    tipe_ukt: DataTypes.ENUM('UKT Jambon','UKT Hijau','UKT Putih','UKCW'),
    id_ranting: DataTypes.STRING,
    rayon: DataTypes.STRING,
    tingkatan: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'siswa',
    tableName: 'siswa'
  });
  return siswa;
};