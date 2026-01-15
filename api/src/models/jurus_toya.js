'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class jurus_toya extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.jurus_toya_siswa, {
        foreignKey: "id_jurus_toya",
        as: "siswa_jurus_toya"
      })
    }
  }
  jurus_toya.init({
    id_jurus_toya: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'jurus_toya',
    tableName: 'jurus_toya'
  });
  return jurus_toya;
};