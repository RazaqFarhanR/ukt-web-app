'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class senam extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.senam_siswa, {
        foreignKey: "id_senam",
        as: "siswa_senam"
      })
    }
  }
  senam.init({
    id_senam: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    tipe_ukt: DataTypes.ENUM('UKT Jambon','UKT Hijau','UKT Putih','UKCW'),
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'senam',
    tableName: 'senam'
  });
  return senam;
};