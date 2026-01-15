'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class belati_siswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.belati, {
        foreignKey: "id_belati",
        as: "siswa_belati"
      })
      this.belongsTo(models.belati_detail, {
        foreignKey: "id_belati_detail",
        as: "siswa_belati_detail"
      })
      
    }
  }
  belati_siswa.init({
    id_belati_siswa: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    id_belati_detail: DataTypes.INTEGER,
    id_belati: DataTypes.INTEGER,
    predikat: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'belati_siswa',
    tableName: 'belati_siswa',
  });
  return belati_siswa;
};