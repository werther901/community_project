const express = require("express");
const router = express.Router();
const userController = require("../Controller/UserController");

router.post("/categoryselcet", userController.getCategoryOne);

module.exports = router;
