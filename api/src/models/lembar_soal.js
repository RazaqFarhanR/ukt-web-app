'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class lembar_soal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.soal, {
        foreignKey: "id_lembar_soal",
        as: "lembar_soal_ujian"
      })
      this.hasMany(models.session, {
        foreignKey: "id_lembar_soal",
        as: "lembar_session"
      })
      this.belongsTo(models.ranting, {
        foreignKey: "id_ranting",
        as: "lembar_ranting"
      })
    }
  }
  lembar_soal.init({
    id_lembar_soal: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: false,
      allowNull: false
    },
    
    id_ranting: DataTypes.STRING,
    tipe_ukt: DataTypes.ENUM('UKT Jambon','UKT Hijau','UKT Putih','UKCW'),
    waktu_pengerjaan: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'lembar_soal',
    tableName: 'lembar_soal',
  });
  return lembar_soal;
};