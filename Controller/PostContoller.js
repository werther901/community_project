const jwt = require("jsonwebtoken"); // 토큰 라이브러리
const bcrypt = require("bcrypt"); // 비밀번호 암호화 라이브러리

require("dotenv").config(); // env

const { Category, User, Write } = require("../models/index"); // 데이터베이스 모델

const postMove = async (req, res) => {
  res.render("post");
};

const ViewPost = async (req, res) => {
  //console.log("req", req.body.viewurl);
  const comment_id = req.body.viewurl;
  const write = await Write.findOne({
    include: [
      {
        model: User, // User 모델과 조인
        attributes: ["name"], // User 테이블에서 name 값만 가져옴
      },
      {
        model: Category,
        attributes: ["name"],
      },
    ],
    where: { comment_id },
  });
  res.send({ write });
};

const deleteData = async (req, res) => {
  let id = req.params.id;
  console.log("id", id);
  await Write.destroy({ where: { comment_id: id } }).catch((err) =>
    console.log(err)
  );
  res.status(200).send("User is deleted");
};

const movePost = async (req, res) => {
  //console.log("req", req.body.now_category);

  let data_lst = await Write.findAll({
    where: { category: req.body.now_category },
  }).catch((err) => console.log(err));
  res.send(data_lst);
};

module.exports = {
  postMove,
  ViewPost,
  deleteData,
  movePost,
};
