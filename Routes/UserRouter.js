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

// 이메일 중복 검사
router.get("/idCheck", userController.idCheck);

// 회원가입 처리
router.post("/signup", userController.signupProcess);

// 로그인 처리
router.post("/login", userController.loginProcess);

// naver 로그인
router.get("/naver_login", userController.naverLogin);

// kakao 로그인
router.get("/kakao_login", userController.kakaoLogin);

// 아이디 찾기 페이지
router.get("/findid", userController.find_id_page);

// 비번 찾기 페이지
// router.get("/findpw", userController.find_pw_page);

// 아이디 찾기
router.get("/find_id", userController.find_id);

// 비번 찾기
// router.get("/find_pw", userController.find_pw);

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

//맛집 이야기 글 불러오기
router.post("/bestfoodpost", userController.bestFood);

//전체 게시물 탐색
router.post("/allpost", userController.allpost);

//자유 게시판 탐색
router.post("/categorypost", userController.categorypost);

//자유 게시판 탐색
router.post("/categorypost_news", userController.categorypost_news);

//검색 기능
router.post("/detailmain/searchstr", userController.search);

//user 찾기 기능
router.post("/detailmain/userstr", userController.Userstr);

module.exports = router;
