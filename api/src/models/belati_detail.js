'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class belati_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.siswa, {
        foreignKey: "id_siswa",
        as: "belati_siswa"
      })
      this.belongsTo(models.event, {
        foreignKey: "id_event",
        as: "event_belati"
      })
      this.hasMany(models.belati_siswa, {
        foreignKey: "id_belati_detail",
        as: "siswa_belati_detail"
      })
      this.belongsTo(models.penguji, {
        foreignKey: "id_penguji",
        as: "penguji_belati"
      })
    }
  }
  belati_detail.init({
    id_belati_detail: {
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
    modelName: 'belati_detail',
    tableName: 'belati_detail',
  });
  return belati_detail;
};