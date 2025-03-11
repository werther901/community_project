const express = require("express");
const router = express.Router();
const PostController = require("../Controller/PostContoller");

router.get("/", PostController.postMove);

//페이지 로드 시
router.post("/viewpost", PostController.ViewPost);

//삭제 버튼 클릭
router.delete("/delete/:id", PostController.deleteData);
module.exports = router;
