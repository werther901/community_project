const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Category",
    {
      category_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,  // 1부터 자동 증가
        primaryKey: true,     // 기본 키 설정
      },
      name: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
    },
    {
      tableName: "category",
      timestamps: false,
    }
  );
};