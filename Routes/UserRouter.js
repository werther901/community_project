const express = require("express");
const router = express.Router();
const userController = require("../Controller/UserController");

// 메인페이지 이동
router.get("/", userController.main);
// 회원가입 페이지 이동
router.get("/signup", userController.signup);
// 로그인 페이지 이동
router.get("/login", userController.login);

// 카테고리 선택 페이지 이동
router.get("/detailmain", userController.detailmain);

// 마이페이지 이동
// router.get("/mypage", userController.mypage);

// 이메일 중복 검사
router.get("/idCheck", userController.idCheck);

// 회원가입 처리
router.post("/signup", userController.signupProcess);

// 로그인 처리
router.post("/login", userController.loginProcess);

// naver 로그인
router.get("/naver_login", userController.naverLogin);

// kakao 로그인
router.get("/kakao_login", userController.kakaoLogin)

// 로그인 검증
router.post("/verify", userController.verifyProcess);

//카테고리 선택
router.post("/category", userController.getCategory);

// naver 로그인 처리
router.post("/naver_login", userController.naverLoginProcess);

// kakao 로그인 처리
router.post("/kakao_login", userController.kakaoLoginProcess);

//최신 글 불러오기
router.post("/recentpost", userController.recentPost);


module.exports = router;
