const express = require("express");
const router = express.Router();
const PostController = require("../Controller/PostContoller");

router.get("/", PostController.postMove);

module.exports = router;
