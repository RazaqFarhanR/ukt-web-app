'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class jurus_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.siswa, {
        foreignKey: "id_siswa",
        as: "jurus_siswa"
      })
      this.belongsTo(models.penguji, {
        foreignKey: "id_penguji",
        as: "penguji_jurus"
      })
      this.belongsTo(models.event, {
        foreignKey: "id_event",
        as: "event_jurus"
      })
      this.hasMany(models.jurus_siswa, {
        foreignKey: "id_jurus_detail",
        as: "siswa_jurus_detail"
      })
    }
  }
  jurus_detail.init({
    id_jurus_detail: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    id_penguji: DataTypes.INTEGER,
    id_siswa: DataTypes.INTEGER,
    id_event: DataTypes.INTEGER,
    tipe_ukt: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'jurus_detail',
    tableName: 'jurus_detail',
  });
  return jurus_detail;
};