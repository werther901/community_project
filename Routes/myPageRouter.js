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

// 유저가 작성한 글 표시
router.post("/view_mypost", myPageController.user_view_mypost);

// 회원 정보 수정
router.put("/edit_userInfo", myPageController.edit_userInfo);

// 회원 탈퇴
router.delete("/leave_user", myPageController.leave_user);

module.exports = router;