'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class senam_toya_siswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.senam_toya, {
        foreignKey: "id_senam_toya",
        as: "siswa_senam_toya"
      })
      this.belongsTo(models.senam_toya_detail, {
        foreignKey: "id_senam_toya_detail",
        as: "siswa_senam_toya_detail"
      })
      
    }
  }
  senam_toya_siswa.init({
    id_senam_toya_siswa: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    id_senam_toya_detail: DataTypes.INTEGER,
    id_senam_toya: DataTypes.INTEGER,
    predikat: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'senam_toya_siswa',
    tableName: 'senam_toya_siswa',
  });
  return senam_toya_siswa;
};