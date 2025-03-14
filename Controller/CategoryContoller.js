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

  if (num !== 0) {
    let categoryname = await Category.findOne({
      where: { category_id: Number(num) },
    }).catch((err) => console.log(err));
    console.log("catename", categoryname);

    res.send({
      cate_id: categoryname.dataValues.category_id,
      name: categoryname.dataValues.name,
    });
  }
};

//전체 포스트 요청 - all
const allPost = async (req, res) => {
  let pageNum = req.body.pageNum;
  let category = req.body.category;
  if (pageNum > 1) {
    offset = 5 * (pageNum - 1);
  } else if (pageNum <= 1) {
    offset = 0;
  }
  //console.log("page", pageNum);

  if (category === 0) {
    let allpost = await Write.findAll({
      offset: offset,
      limit: 5,
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    }).catch((err) => console.log(err));
    console.log("allpost", allpost);
    res.send({ allpost });
  } else {
    let allpost = await Write.findAll({
      offset: offset,
      limit: 5,
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
      where: { category: category },
    }).catch((err) => console.log(err));
    console.log("allpost", allpost);
    res.send({ allpost });
  }
};

//페이지네이션 숫자에 따라 반환되는 테이블 내용
const Pagi = async (req, res) => {
  //console.log("req data", req.body.category);
  let category_num = req.body.category;
  if (category_num === 0) {
    //전체 게시판 선택할 경우
    let allpost = await Write.findAll({
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    }).catch((err) => console.log(err));
    res.send({ allpost });
  } else {
    //category가 선택이 가능한 경우 -> 전체게시판 이외 선택
    let allpost = await Write.findAll({
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
      where: { category: category_num },
    }).catch((err) => console.log(err));
    //console.log("allpost", allpost);
    res.send({ allpost });
  }
};
module.exports = {
  getCategory,
  getCategoryOne,
  allPost,
  Pagi,
};
