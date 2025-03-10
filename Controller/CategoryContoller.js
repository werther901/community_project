const jwt = require("jsonwebtoken"); // 토큰 라이브러리
const bcrypt = require("bcrypt"); // 비밀번호 암호화 라이브러리

require("dotenv").config(); // env

const { Category, Write, User } = require("../models/index"); // 데이터베이스 모델

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
  console.log("res num", req.body.num);
  let num = req.body.num;
  let categoryname = await Category.findOne({
    where: { category_id: Number(num) },
  }).catch((err) => console.log(err));
  res.send({
    cate_id: categoryname.dataValues.category_id,
    name: categoryname.dataValues.name,
  });
};

//전체 포스트 요청 - all
const allPost = async (req, res) => {
  /*findAll를 통해 전체 데이터를 가져옴 
  -> userId는 User Table에 있는 id값을 기준으로 name 가져오기*/

  let allpost = await Write.findAll({
    //userId: await User.findOne({where : {id : } }),
    include: [
      {
        model: User, // User 모델과 조인
        attributes: ["name"], // User 테이블에서 name 값만 가져옴
      },
    ],
    raw: true, // 🔥 JOIN된 데이터를 평탄화 (User가 배열로 나오지 않음)
    nest: true, // 🔥 JSON 구조 유지
  }).catch((err) => console.log(err));
  console.log("allpost", allpost);
  res.send({ allpost });
};

module.exports = {
  getCategory,
  getCategoryOne,
  allPost,
};
