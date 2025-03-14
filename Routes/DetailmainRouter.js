const express = require("express");
const router = express.Router();
const CategoryController = require("../Controller/CategoryContoller");

router.post("/categoryselcet", CategoryController.getCategoryOne);
router.post("/allPost", CategoryController.allPost); //전체 포스트 검색
router.post("/allPost_pagi", CategoryController.Pagi);
module.exports = router;
