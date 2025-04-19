'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class teknik_siswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.teknik, {
        foreignKey: "id_teknik",
        as: "siswa_teknik"
      })
      this.belongsTo(models.teknik_detail, {
        foreignKey: "id_teknik_detail",
        as: "siswa_teknik_detail"
      })
      
    }
  }
  teknik_siswa.init({
    id_teknik_siswa: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_teknik: DataTypes.INTEGER,
    id_teknik_detail: DataTypes.INTEGER,
    predikat: DataTypes.ENUM('KURANG','CUKUP','BAIK')
  }, {
    sequelize,
    modelName: 'teknik_siswa',
    tableName: 'teknik_siswa',
  });
  return teknik_siswa;
};