const express = require("express");
const router = express.Router();
const myPageController = require("../Controller/myPageController");

// 마이페이지 이동
router.get("/", myPageController.mypage);
// 좋아요 한 글 페이지 이동
router.get("/likedpage", myPageController.likedPage);
// 내가 작성한 글 페이지 이동
router.get("/view_mypost", myPageController.view_mypost);

// 유저가 좋아요 한 글 표시
router.post("/user_liked", myPageController.user_liked_post);

module.exports = router;