'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.user, {
        foreignKey: "id_role",
        as: "user_role"
      })
      this.hasMany(models.siswa, {
        foreignKey: "id_role",
        as: "siswa_role"
      })
      this.hasMany(models.penguji, {
        foreignKey: "id_role",
        as: "penguji"
      })
      this.hasMany(models.pengurus, {
        foreignKey: "id_role",
        as: "pengurus"
      })
    }
  }
  role.init({
    id_role: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'role',
    tableName: 'role'
  });
  return role;
};