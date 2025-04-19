'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class senam_siswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.senam, {
        foreignKey: "id_senam",
        as: "siswa_senam"
      })
      this.belongsTo(models.senam_detail, {
        foreignKey: "id_senam_detail",
        as: "siswa_senam_detail"
      })
      
    }
  }
  senam_siswa.init({
    id_senam_siswa: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    id_senam_detail: DataTypes.INTEGER,
    id_senam: DataTypes.INTEGER,
    predikat: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'senam_siswa',
    tableName: 'senam_siswa',
  });
  return senam_siswa;
};