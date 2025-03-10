'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      // address, phoneNumber, gender, birth의 null 허용
      queryInterface.changeColumn('user', 'address', {
        type: Sequelize.STRING(255),
        allowNull: true,
      }),
      queryInterface.changeColumn('user', 'phoneNumber', {
        type: Sequelize.STRING(45),
        allowNull: true,
      }),
      queryInterface.changeColumn('user', 'gender', {
        type: Sequelize.STRING(10),
        allowNull: true,
      }),
      queryInterface.changeColumn('user', 'birth', {
        type: Sequelize.STRING(20),
        allowNull: true,
      }),
      // signup_method 컬럼 추가
      // queryInterface.addColumn('user', 'signup_method', {
      //   type: Sequelize.STRING(20),
      //   allowNull: false,
      //   defaultValue: 'local', // 기본값은 일반 회원가입
      // }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      // 기존 상태로 되돌리기
      queryInterface.changeColumn('user', 'address', {
        type: Sequelize.STRING(255),
        allowNull: false,
      }),
      queryInterface.changeColumn('user', 'phoneNumber', {
        type: Sequelize.STRING(45),
        allowNull: false,
      }),
      queryInterface.changeColumn('user', 'gender', {
        type: Sequelize.STRING(10),
        allowNull: false,
      }),
      queryInterface.changeColumn('user', 'age', {
        type: Sequelize.INTEGER,
        allowNull: false,
      }),
      // signup_method 삭제
      queryInterface.removeColumn('user', 'signup_method'),
    ]);
  }
};
