'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class detail_sambung extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.sambung, {
        foreignKey: "id_sambung",
        as: "detail_sambung"
      })
      this.belongsTo(models.siswa, {
        foreignKey: "id_siswa",
        as: "sambung_siswa"
      })
      this.hasMany(models.gerakan, {
        foreignKey: "id_gerakan",
        as: "detail_gerakan"
      })
    }
  }
  detail_sambung.init({
    id_detail_sambung: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    id_sambung: DataTypes.INTEGER,
    posisi: DataTypes.INTEGER,
    id_siswa: DataTypes.INTEGER,
    nilai: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'detail_sambung',
    tableName: 'detail_sambung',
  });
  return detail_sambung;
};