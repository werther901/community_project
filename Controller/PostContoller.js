const jwt = require("jsonwebtoken"); // 토큰 라이브러리
const bcrypt = require("bcrypt"); // 비밀번호 암호화 라이브러리

require("dotenv").config(); // env

const { Category, User, Write, Like } = require("../models/index"); // 데이터베이스 모델

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

//이전 글 / 다음 글
const movePost = async (req, res) => {
  //console.log("req", req.body.now_category);
  let current_category = Number(req.body.now_category);

  if (current_category !== 0) {
    let data_lst = await Write.findAll({
      where: { category: current_category },
    }).catch((err) => console.log(err));
    res.send(data_lst);
  } else {
    let data_lst = await Write.findAll({}).catch((err) => console.log(err));
    res.send(data_lst);
  }
};

//like 테이블에 삽입
const addUser = async (req, res) => {
  console.log("req.body.id", req.body);

  let info = {
    user_id: req.body.userid,
    comment_id: req.body.comment_id,
    is_liked: 1,
  };

  //like 테이블에 삽입
  const user = await Like.create(info).catch((err) => console.log(err));

  res.send({ user });
};

const deleteUser = async (req, res) => {
  let id = req.body.userid;
  let comment_id = req.body.comment_id;
  //res.send({ id: id, comment_id: comment_id });
  await Like.destroy({ where: { user_id: id, comment_id: comment_id } }).catch(
    (err) => console.log(err)
  );
  res.status(200).send("User is deleted");
};

const findUser = async (req, res) => {
  const { userid, comment_id } = req.body;

  const user = await Like.findOne({
    where: { user_id: userid, comment_id: comment_id },
  });
  res.send({ user });
};

//해당 comment id에 따른 길이 찾기
const Row = async (req, res) => {
  const comment_id = req.body.comment_id;

  //전체 데이터 찾기
  let data_lst = await Like.findAll({
    where: { comment_id: comment_id },
  }).catch((err) => console.log(err));

  //write 테이블 likes_cnt 수정
  await Write.update(
    { likes_cnt: data_lst.length },
    {
      where: { comment_id: comment_id },
    }
  );

  res.send(data_lst);
};

module.exports = {
  postMove,
  ViewPost,
  deleteData,
  movePost,
  addUser,
  deleteUser,
  findUser,
  Row,
};
