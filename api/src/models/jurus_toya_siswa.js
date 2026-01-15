'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class jurus_toya_siswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.jurus_toya, {
        foreignKey: "id_jurus_toya",
        as: "siswa_jurus_toya"
      })
      this.belongsTo(models.jurus_toya_detail, {
        foreignKey: "id_jurus_toya_detail",
        as: "siswa_jurus_toya_detail"
      })
      
    }
  }
  jurus_toya_siswa.init({
    id_jurus_toya_siswa: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    id_jurus_toya_detail: DataTypes.INTEGER,
    id_jurus_toya: DataTypes.INTEGER,
    predikat: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'jurus_toya_siswa',
    tableName: 'jurus_toya_siswa',
  });
  return jurus_toya_siswa;
};