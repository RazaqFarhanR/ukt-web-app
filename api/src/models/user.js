"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.role, {
        foreignKey: "id_role",
        as: "user_role"
      })
      this.belongsTo(models.ranting, {
        foreignKey: "id_ranting",
        as: "user_ranting",
      });
    }
  }
  user.init(
    {
      id_user: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      NIW: DataTypes.STRING,
      username: DataTypes.STRING,
      name: DataTypes.STRING,
      id_role: DataTypes.STRING,
      id_ranting: DataTypes.STRING,     
      foto: DataTypes.STRING,
      password: DataTypes.STRING,
      no_wa: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "user",
      tableName: "user",
    }
  );
  return user;
};
