const jwt = require("jsonwebtoken"); // 토큰 라이브러리
const bcrypt = require("bcrypt"); // 비밀번호 암호화 라이브러리

require("dotenv").config(); // env

const { Write } = require("../models/index"); // 데이터베이스 모델

//글 등록하기
const getPost = async (req, res) => {
  let info = {
    title: req.body.title,
    userId: req.body.password,
    category: req.body.category,
    like_cnt: 0,
    photo_address: "imgsrc",
  };

  //const user = await User.create(info).catch((err) => console.log(err));
  //res.status(200).send(user);
};

module.exports = {
  getPost,
};
