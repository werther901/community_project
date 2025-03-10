const jwt = require("jsonwebtoken"); // 토큰 라이브러리
const bcrypt = require("bcrypt"); // 비밀번호 암호화 라이브러리

require("dotenv").config(); // env

const { User, Category, Write } = require("../models/index"); // 데이터베이스 모델

//write 페이지 이동
const write = async (req, res) => {
  res.render("write");
};

// 카테고리 요청
const getCategory = async (req, res) => {
  let categoryname = await Category.findAll({}).catch((err) =>
    console.log(err)
  );
  let cate = []; //카테고리 이름
  categoryname.map((item) => {
    cate.push(item.dataValues);
  });
  // console.log("category", cate);
  res.send({ category: cate });
};

//글 등록하기
const getPost = async (req, res) => {
  const imgsrc = req.file ? req.file.path : null;

  let info = {
    userId: req.body.userId,
    title: req.body.title,
    category: req.body.category,
    likes_cnt: 0,
    photo_address: imgsrc,
    comment: req.body.comment,
  };

  const user = await Write.create(info).catch((err) => console.log(err));
  res.send({ user });
};

//수정 버튼
const postmodify = async (req, res) => {
  console.log("req", req.body.posturl);
  const posturl = req.body.posturl;
  const user = await Write.findOne({ where: { comment_id: posturl } });
  res.send({ user });
};

module.exports = { getCategory, getPost, write, postmodify };
