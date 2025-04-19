'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pengurus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.role, {
        foreignKey: "id_role",
        as: "pengurus"
      })
      this.belongsTo(models.cabang, {
        foreignKey: "id_cabang",
        as: "pengurus_cabang"
      })
      this.belongsTo(models.ranting, {
        foreignKey: "id_ranting",
        as: "pengurus_ranting"
      })
    }
  }
  pengurus.init({
    id_pengurus: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    NIW: DataTypes.STRING,
    jabatan: DataTypes.STRING,
    name: DataTypes.STRING,
    id_role: DataTypes.STRING,
    id_ranting: {
      type: DataTypes.STRING,
      allowNull: true
    },
    id_cabang: {
      type: DataTypes.STRING,
      allowNull: true
    },
    username: DataTypes.STRING,
    foto: DataTypes.STRING,
    password: DataTypes.STRING,
    no_wa: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'pengurus',
    tableName: 'pengurus'
  });
  return pengurus;
};