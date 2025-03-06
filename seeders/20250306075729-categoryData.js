"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert("category", [
      {
        category_id: 1,
        name: "자유게시판",
      },
      {
        category_id: 2,
        name: "맛집",
      },
      {
        category_id: 3,
        name: "뉴스",
      },
      {
        category_id: 4,
        name: "게임",
      },
      {
        category_id: 5,
        name: "운동",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
