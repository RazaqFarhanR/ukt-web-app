'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sambung extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.detail_sambung, {
        foreignKey: "id_sambung",
        as: "detail_sambung"
      })
      this.hasMany(models.gerakan_detail, {
        foreignKey: "id_sambung",
        as: "detail_gerak"
      })
      this.belongsTo(models.event, {
        foreignKey: "id_event",
        as: "event_sambung"
      })
      this.belongsTo(models.penguji, {
        foreignKey: "id_penguji",
        as: "penguji_sambung"
      })
    }
  }
  sambung.init({
    id_sambung: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    id_event: DataTypes.INTEGER,
    id_penguji: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'sambung',
    tableName: 'sambung',
  });
  return sambung;
};