'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class teknik extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.teknik_siswa, {
        foreignKey: "id_teknik",
        as: "siswa_teknik"
      })
    }
  }
  teknik.init({
    id_teknik: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    tipe_ukt: DataTypes.ENUM('UKT Jambon','UKT Hijau','UKT Putih','UKCW'),
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'teknik',
    tableName: 'teknik'
  });
  return teknik;
};