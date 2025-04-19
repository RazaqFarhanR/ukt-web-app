'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class jurus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.jurus_siswa, {
        foreignKey: "id_jurus",
        as: "jurus"
      })
    }
  }
  jurus.init({
    id_jurus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    tipe_ukt: DataTypes.ENUM('UKT Jambon','UKT Hijau','UKT Putih','UKCW'),
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'jurus',
    tableName: 'jurus'
  });
  return jurus;
};