'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class jurus_toya_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.siswa, {
        foreignKey: "id_siswa",
        as: "jurus_toya_siswa"
      })
      this.belongsTo(models.event, {
        foreignKey: "id_event",
        as: "event_jurus_toya"
      })
      this.hasMany(models.jurus_toya_siswa, {
        foreignKey: "id_jurus_toya_detail",
        as: "siswa_jurus_toya_detail"
      })
      this.belongsTo(models.penguji, {
        foreignKey: "id_penguji",
        as: "penguji_jurus_toya"
      })
    }
  }
  jurus_toya_detail.init({
    id_jurus_toya_detail: {
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
    modelName: 'jurus_toya_detail',
    tableName: 'jurus_toya_detail',
  });
  return jurus_toya_detail;
};