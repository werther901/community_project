'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 1. 조회수 컬럼 추가
    await queryInterface.addColumn("write", "view_cnt", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0, // 기본값 0 설정
    });

    // 2. comment 컬럼 type 변경
    await queryInterface.changeColumn("write", "comment", {
      type: Sequelize.TEXT,
      allowNull: false,
    });

    // 3. 타임스탬프 추가
    await queryInterface.addColumn("write", "createdAt", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });

    await queryInterface.addColumn("write", "updatedAt", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("write", "view_cnt", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0, // 기본값 0 설정
    });

    await queryInterface.changeColumn("write", "comment", {
      type: Sequelize.STRING(255),
      allowNull: false,
    });

    await queryInterface.removeColumn("write", "createdAt");

    await queryInterface.removeColumn("write", "updatedAt");
  }
};
