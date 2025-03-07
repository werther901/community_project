'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("user", [
      {
        userId: "test@email.com",
        password: "$2b$10$O6nRdcradXfmUwj6VvVkruxoVs6jRtUBJUisQz7QTGL8gd7vqA/gi",
        name: "홍길동",
        address: "서울 어딘가",
        phoneNumber: "010-1234-5678",
        gender: "M",
        birth: "1999-01-01",
      },
      {
        userId: "test2@email.com",
        password: "$2b$10$mPRPvoz.hElScXh9574OxuOU4jxNibK6RRFzD0eMHyAtcl9z2KmHO",
        name: "김영희",
        address: "인천 어딘가",
        phoneNumber: "010-2222-3333",
        gender: "F",
        birth: "1996-07-10",
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
