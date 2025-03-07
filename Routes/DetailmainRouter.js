const express = require("express");
const router = express.Router();
const CategoryController = require("../Controller/CategoryContoller");

router.post("/categoryselcet", CategoryController.getCategoryOne);

module.exports = router;
