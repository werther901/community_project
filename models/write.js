const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Write = sequelize.define(
    "Write",
    {
      comment_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true, // 1부터 자동 증가
        primaryKey: true, // 기본 키 설정
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      category: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "category",
          key: "category_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      likes_cnt: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      photo_address: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      view_cnt: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0, // 기본값 0 설정
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW, // 기본값 설정
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW, // 기본값 설정
        onUpdate: DataTypes.NOW, // 업데이트 시 자동 갱신
      },
    },
    {
      tableName: "write",
      timestamps: true,
      timezone: "+09:00"
    }
  );
  Write.associate = (models) => {
    Write.belongsTo(models.User, { foreignKey: "userId", targetKey: "id" });
    Write.belongsTo(models.Category, {
      foreignKey: "category",
      targetKey: "category_id",
    });
  };

  return Write;
};
