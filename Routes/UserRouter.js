const express = require("express");
const router = express.Router();
const userController = require("../Controller/UserController");

// 메인페이지 이동
router.get("/", userController.main);
// 회원가입 페이지 이동
router.get("/signup", userController.signup);
// 로그인 페이지 이동
router.get("/login", userController.login);

//카테고리 선택 페이지 이동
router.get("/detailmain", userController.detailmain);

// 이메일 중복 검사
router.get("/idCheck", userController.idCheck);

// 회원가입 처리
router.post("/signup", userController.signupProcess);

// 로그인 처리
router.post("/login", userController.loginProcess);

// 로그인 검증
router.post("/verify", userController.verifyProcess);

//카테고리 선택
router.post("/category", userController.getCategory);

module.exports = router;
