'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class kripen_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.siswa, {
        foreignKey: "id_siswa",
        as: "kripen_siswa"
      })
      this.belongsTo(models.event, {
        foreignKey: "id_event",
        as: "event_kripen"
      })
      this.hasMany(models.kripen_siswa, {
        foreignKey: "id_kripen_detail",
        as: "siswa_kripen_detail"
      })
      this.belongsTo(models.penguji, {
        foreignKey: "id_penguji",
        as: "penguji_kripen"
      })
    }
  }
  kripen_detail.init({
    id_kripen_detail: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    id_penguji: DataTypes.INTEGER,
    id_event: DataTypes.INTEGER,
    id_siswa: DataTypes.INTEGER,
    tipe_ukt: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'kripen_detail',
    tableName: 'kripen_detail',
  });
  return kripen_detail;
};