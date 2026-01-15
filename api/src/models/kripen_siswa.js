'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class kripen_siswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.kripen, {
        foreignKey: "id_kripen",
        as: "siswa_kripen"
      })
      this.belongsTo(models.kripen_detail, {
        foreignKey: "id_kripen_detail",
        as: "siswa_kripen_detail"
      })
      
    }
  }
  kripen_siswa.init({
    id_kripen_siswa: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    id_kripen_detail: DataTypes.INTEGER,
    id_kripen: DataTypes.INTEGER,
    predikat: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'kripen_siswa',
    tableName: 'kripen_siswa',
  });
  return kripen_siswa;
};