'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class teknik_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.siswa, {
        foreignKey: "id_siswa",
        as: "teknik_siswa"
      })
      this.belongsTo(models.penguji, {
        foreignKey: "id_penguji",
        as: "penguji_teknik"
      })
      this.belongsTo(models.event, {
        foreignKey: "id_event",
        as: "event_teknik"
      })
      this.hasMany(models.teknik_siswa, {
        foreignKey: "id_teknik_detail",
        as: "siswa_teknik_detail"
      })
    }
  }
  teknik_detail.init({
    id_teknik_detail: {
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
    modelName: 'teknik_detail',
    tableName: 'teknik_detail',
  });
  return teknik_detail;
};