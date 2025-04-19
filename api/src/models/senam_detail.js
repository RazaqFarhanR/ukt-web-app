'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class senam_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.siswa, {
        foreignKey: "id_siswa",
        as: "senam_siswa"
      })
      this.belongsTo(models.event, {
        foreignKey: "id_event",
        as: "event_senam"
      })
      this.hasMany(models.senam_siswa, {
        foreignKey: "id_senam_detail",
        as: "siswa_senam_detail"
      })
      this.belongsTo(models.penguji, {
        foreignKey: "id_penguji",
        as: "penguji_senam"
      })
    }
  }
  senam_detail.init({
    id_senam_detail: {
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
    modelName: 'senam_detail',
    tableName: 'senam_detail',
  });
  return senam_detail;
};