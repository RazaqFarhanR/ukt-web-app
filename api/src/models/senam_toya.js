'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class senam_toya extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.senam_toya_siswa, {
        foreignKey: "id_senam_toya",
        as: "siswa_senam_toya"
      })
    }
  }
  senam_toya.init({
    id_senam_toya: {
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
    modelName: 'senam_toya',
    tableName: 'senam_toya'
  });
  return senam_toya;
};