'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 1. age 컬럼을 birth로 이름 변경
    await queryInterface.renameColumn("user", "age", "birth");

    // 2. birth 컬럼 타입을 DATEONLY로 변경
    await queryInterface.changeColumn("user", "birth", {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    // 1. birth 컬럼을 다시 age로 변경
    await queryInterface.renameColumn("user", "birth", "age");

    // 2. age 컬럼 타입을 INTEGER로 되돌리기
    await queryInterface.changeColumn("user", "age", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  }
};
