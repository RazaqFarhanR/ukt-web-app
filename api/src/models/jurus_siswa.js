'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class jurus_siswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.jurus, {
        foreignKey: "id_jurus",
        as: "jurus"
      })
      this.belongsTo(models.jurus_detail, {
        foreignKey: "id_jurus_detail",
        as: "siswa_jurus_detail"
      })
      
    }
  }
  jurus_siswa.init({
    id_jurus_siswa: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    id_jurus_detail: DataTypes.INTEGER,
    id_jurus: DataTypes.INTEGER,
    predikat: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'jurus_siswa',
    tableName: 'jurus_siswa',
  });
  return jurus_siswa;
};