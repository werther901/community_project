module.exports = (sequelize, DataTypes) => {
  const View = sequelize.define(
    "View",
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      comment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "write",
          key: "comment_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    {
      timestamps: false,
    },
    {
      tableName: "views",
      timestamps: false,
      indexes: [
        {
          // unique: true,
          fields: ["user_id", "comment_id"],
        },
      ],
    }
  );
  return View;
};
