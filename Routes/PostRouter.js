const express = require("express");
const router = express.Router();
const PostController = require("../Controller/PostContoller");

router.get("/", PostController.postMove);

//페이지 로드 시
router.post("/viewpost", PostController.ViewPost);

//삭제 버튼 클릭
router.delete("/delete/:id", PostController.deleteData);

//이전 글 & 다음 글 버튼 클릭
router.post("/movePost", PostController.movePost);

//like 테이블에서의 user 탐색
router.post("/checkuser", PostController.findUser);

//좋아요 버튼 클릭
router.post("/like_adduser", PostController.addUser);
//좋아요 버튼 취소
router.delete("/like_deleteuser", PostController.deleteUser);

module.exports = router;
