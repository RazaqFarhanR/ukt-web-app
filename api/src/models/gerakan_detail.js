'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class gerakan_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.sambung, {
        foreignKey: "id_sambung",
        as: "gdetail_sambung"
      })
      this.hasMany(models.gerakan, {
        foreignKey: "id_detail",
        as: "gerak_detail"
      })
    }
  }
  gerakan_detail.init({
    id_detail: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_sambung: DataTypes.INTEGER,
    name: DataTypes.STRING,
    posisi: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'gerakan_detail',
    tableName: 'gerakan_detail',
  });
  return gerakan_detail;
};