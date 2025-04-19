'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.lembar_soal, {
        foreignKey: "id_lembar_soal",
        as: "lembar_session"
      })
      this.belongsTo(models.siswa, {
        foreignKey: "id_siswa",
        as: "keshan_siswa"
      })
      this.hasMany(models.lembar_jawaban, {
        foreignKey: "id_session",
        as: "lembar_jawaban"
      })
    }
  }
  session.init({
    id_session: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    id_lembar_soal: DataTypes.INTEGER,
    id_siswa: DataTypes.INTEGER,
    id_event: DataTypes.INTEGER,
    nilai: DataTypes.INTEGER,
    waktu_pengerjaan: DataTypes.INTEGER,
    start: DataTypes.DATE,
    finish: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'session',
    tableName: 'session',
  });
  return session;
};