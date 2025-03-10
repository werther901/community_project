const express = require("express");
const router = express.Router();
const PostController = require("../Controller/PostContoller");

router.get("/", PostController.postMove);

//페이지 로드 시
router.post("/viewpost", PostController.ViewPost);
module.exports = router;
