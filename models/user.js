const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true, // 1부터 자동 증가
        primaryKey: true, // 기본 키 설정
      },
      userId: {
        type: DataTypes.STRING(45),
        allowNull: false,
        // unique: true,  // userId는 중복 방지
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      birth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      signup_method: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      tableName: "user",
      timestamps: false,
    }
  );
};
