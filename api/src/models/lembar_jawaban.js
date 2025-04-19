'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class lembar_jawaban extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.soal, {
        foreignKey: "id_soal",
        as: "soal_ujian"
      })
    }
  }
  lembar_jawaban.init({
    id_lembar_jawaban: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    id_session: DataTypes.INTEGER,
    id_siswa: DataTypes.INTEGER,
    id_soal: DataTypes.STRING,
    answer: DataTypes.ENUM('benar', 'salah', 'kosong')
  }, {
    sequelize,
    modelName: 'lembar_jawaban',
    tableName: 'lembar_jawaban'
  });
  return lembar_jawaban;
};