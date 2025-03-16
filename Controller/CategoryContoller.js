const jwt = require("jsonwebtoken"); // 토큰 라이브러리
const bcrypt = require("bcrypt"); // 비밀번호 암호화 라이브러리
const sequelize = require("sequelize"); //시퀄라이즈
const Op = sequelize.Op; //포함 여부를 알기 위해 사용
require("dotenv").config(); // env

const { Category, Write, User } = require("../models/index"); // 데이터베이스 모델

// 카테고리 요청 - all
const getCategory = async (req, res) => {
  let categoryname = await Category.findAll({
    order: [["comment_id", "desc"]],
  }).catch((err) => console.log(err));
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

//전체 포스트 요청 - all (pagemove 클릭)
const allPost = async (req, res) => {
  console.log("rdsfdffdsfsdfeq", req.body);
  let pageNum = req.body.pageNum;
  let category = req.body.category;
  let search = req.body.search_url;
  let select = req.body.select_url;
  let user = Number(req.body.user_url);

  if (pageNum > 1) {
    offset = 5 * (pageNum - 1);
  } else if (pageNum <= 1) {
    offset = 0;
  }

  if (category === 0 && !search && !select && !user) {
    //전체 게시판일 경우
    let total = await Write.findAll({});
    let allpost = await Write.findAll({
      offset: offset,
      limit: 5,
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
      order: [["comment_id", "desc"]],
    }).catch((err) => console.log(err));
    //console.log("allpost", allpost);
    res.send({ allpost, total });
  } else if (category !== 0 && !search && !select && !user) {
    let total = await Write.findAll({ where: { category: category } });
    let allpost = await Write.findAll({
      offset: offset,
      limit: 5,
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
      order: [["comment_id", "desc"]],
      where: { category: category },
    }).catch((err) => console.log(err));
    //console.log("allpost", allpost);
    res.send({ allpost, total });
  } else if (search && select && !user) {
    //search와 select가 있는 경우
    if (select === "title") {
      let total = await Write.findAll({
        where: {
          title: {
            [Op.like]: `%${search}%`,
          },
        },
      });
      let allpost = await Write.findAll({
        offset: offset,
        limit: 5,
        include: [
          {
            model: User, // User 모델과 조인
            attributes: ["name"], // User 테이블에서 name 값만 가져옴
          },
        ],
        where: {
          title: {
            [Op.like]: `%${search}%`,
          },
        },
        order: [["comment_id", "desc"]],
      }).catch((err) => console.log(err));
      res.send({ allpost, total });
    } else if (select === "comment") {
      //select가 comment인 경우

      //전체 길이 반환용
      let total = await Write.findAll({
        where: {
          comment: {
            [Op.like]: `%${search}%`,
          },
        },
      });

      //해당 데이터 반환용
      let allpost = await Write.findAll({
        offset: offset,
        limit: 5,
        include: [
          {
            model: User, // User 모델과 조인
            attributes: ["name"], // User 테이블에서 name 값만 가져옴
          },
        ],
        where: {
          comment: {
            [Op.like]: "%" + search + "%",
          },
        },
        order: [["comment_id", "desc"]],
      }).catch((err) => console.log(err));

      res.send({ allpost, total });
    } else if (select === "user") {
      let data_result = [];
      let data = await User.findAll({
        attributes: ["name", "id"],
        where: {
          name: {
            [Op.like]: "%" + search + "%",
          },
        },
        raw: true,
      }).catch((err) => console.log(err));

      data.map((item) => {
        data_result.push(item.id);
      });

      //console.log("data : ", data[0].id);
      //전체 길이 반환용
      let total = await Write.findAll({
        where: {
          userId: data_result,
        },
      });

      //전체 데이터 반환용
      let allpost = await Write.findAll({
        include: [
          {
            model: User, // User 모델과 조인
            attributes: ["name"], // User 테이블에서 name 값만 가져옴
          },
        ],
        where: {
          userId: data_result,
        },
        order: [["comment_id", "desc"]],
      }).catch((err) => console.log(err));
      res.send({ allpost, total });
    }
  } else if (user) {
    let total = await Write.findAll({ where: { userId: user } });
    let allpost = await Write.findAll({
      offset: offset,
      limit: 5,
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
      order: [["comment_id", "desc"]],
      where: { userId: user },
    }).catch((err) => console.log(err));
    //console.log("allpost", allpost);
    res.send({ allpost, total });
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
