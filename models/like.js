const { DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Like",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id'
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      comment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'write',
          key: 'comment_id'
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      is_liked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      tableName: "like",
      timestamps: false,
      indexes: [
        {
          // unique: true,
          fields: ["user_id", "comment_id"],
        }
      ]
    }
  );
};