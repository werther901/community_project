const jwt = require("jsonwebtoken"); // 토큰 라이브러리
const bcrypt = require("bcrypt"); // 비밀번호 암호화 라이브러리

require("dotenv").config(); // env

const { Category, Write } = require("../models/index"); // 데이터베이스 모델

// 카테고리 요청 - all
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

// 카테고리 요청 - one
const getCategoryOne = async (req, res) => {
  console.log("res", req.body.num);
  let num = req.body.num;
  let categoryname = await Category.findOne({
    where: { category_id: Number(num) },
  }).catch((err) => console.log(err));

  //console.log("category", categoryname.dataValues.name);
  res.send({ name: categoryname.dataValues.name });
};

//전체 포스트 요청 - all
const allPost = async (req, res) => {
  let allpost = await Write.findAll({}).catch((err) => console.log(err));
  console.log("allpost", allpost);
  res.send({ allpost });
};

module.exports = {
  getCategory,
  getCategoryOne,
  allPost,
};
