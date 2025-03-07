const jwt = require("jsonwebtoken"); // 토큰 라이브러리
const bcrypt = require("bcrypt"); // 비밀번호 암호화 라이브러리

require("dotenv").config(); // env

const { Write } = require("../models/index"); // 데이터베이스 모델

const postMove = async (req, res) => {
  res.render("post");
};

module.exports = {
  postMove,
};
