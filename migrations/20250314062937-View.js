"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("view", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true, // 1부터 자동 증가
        primaryKey: true, // 기본 키 설정
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "user", // 참조할 테이블 (DB 테이블명 기준)
          key: "id", // 참조할 컬럼
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      comment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "write", // 참조할 테이블 (DB 테이블명 기준)
          key: "comment_id", // 참조할 컬럼
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });

    // 유니크 제약조건을 user_id와 comment_id에 적용하여 복합 기본키처럼 동작하도록 설정
    await queryInterface.addIndex("view", ["user_id", "comment_id"], {
      unique: true, // 두 컬럼 조합에 대해 유니크 제약 추가
      name: "unique_user_comment_view",
    });
  },

  async down(queryInterface, Sequelize) {
    // 테이블 삭제
    await queryInterface.dropTable("view");
  },
};
