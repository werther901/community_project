'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("write", {
      comment_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "user", // 참조할 테이블 (DB 테이블명 기준)
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      category: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "category", // 참조할 테이블 (DB 테이블명 기준)
          key: "category_id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      likes_cnt: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      photo_address: {
        type: Sequelize.STRING(255),
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("write");
  }
};
