'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class gerakan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.nilai_sambung, {
        foreignKey: "id_nilai_sambung",
        as: "gerakan_nilai_sambung"
      })
      this.belongsTo(models.gerakan_detail, {
        foreignKey: "id_detail",
        as: "gerakan_detail"
      })
    }
  }
  gerakan.init({
    id_gerakan: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    id_nilai: DataTypes.INTEGER,
    id_detail: DataTypes.INTEGER,
    green: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'gerakan',
    tableName: 'gerakan'
  });
  return gerakan;
};