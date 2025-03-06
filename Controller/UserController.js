// 토큰 라이브러리
const jwt = require("jsonwebtoken");
// 비밀번호 암호화 라이브러리
const bcrypt = require("bcrypt");
// 날짜 데이터 변환 라이브러리
const moment = require("moment");
// env
require("dotenv").config();
// 데이터베이스 모델
const { User, Category } = require("../models/index");

// 메인 페이지
const main = async (req, res) => {
  res.render("main");
};

// 회원가입 페이지
const signup = (req, res) => {
  res.render("signup");
};

// 로그인 페이지
const login = (req, res) => {
  res.render("login");
};

// 글 쓰기 페이지
const write = (req, res) => {
  res.render("write");
};

// 글 쓰기 페이지
const detailmain = (req, res) => {
  res.render("detailmain");
};

// id 중복검사
const idCheck = async (req, res) => {
  const userId = req.query.userId;
  const checkId = await User.findOne({ where: { userId } });
  // console.log(checkId.dataValues.userId);
  // if(checkId !== null) {
  //   try {
  //     if (!checkId.dataValues.userId) {
  //       res.send(true); // 사용 가능
  //     } else {
  //       res.send(false); // 중복
  //     }
  //   } catch (error) {
  //     res.status(500).json({ error: "아이디(이메일) 찾기 실패", message: error.message })
  //   }
  // }
  if (checkId) {
    res.send(false); // 중복 아이디
  } else {
    res.send(true); // 사용 가능
  }
};

// 회원가입 처리
const signupProcess = async (req, res) => {
  const { userId, password, name, address, phoneNumber, gender, birth } =
    req.body;

  console.log(req.body);
  const date = moment(birth, "YYYY-MM-DD").format("YYYY-MM-DD");
  console.log(date);
  console.log(typeof date);

  const salt = await bcrypt.genSalt(10);
  // 비밀번호 암호화
  const hashedPw = await bcrypt.hash(password, salt);
  console.log("password : ", password);
  console.log("hashedPw : ", hashedPw);

  try {
    const user = await User.create({
      userId,
      password: hashedPw,
      name,
      address,
      phoneNumber,
      gender,
      birth: date,
    });
    console.log("user : ", user);

    if (!user) {
      return res.status(400).json({ result: false, message: "회원가입 실패1" });
    }
    // 회원가입 성공
    return res.status(200).json({ result: true, message: "회원가입 성공" });
  } catch (e) {
    return res
      .status(400)
      .json({ result: false, message: "회원가입 실패2", error: e });
  }
};

// 로그인 처리
const loginProcess = async (req, res) => {
  // 로그인 요청 데이터
  const { id, pw } = req.body;
  console.log(req.body);
  const user = await User.findOne({ where: { userId: id } });
  console.log(user);

  if (user) {
    try {
      // 비밀번호 비교
      const match = await bcrypt.compare(pw, user.dataValues.password);

      if (!match) {
        // 비밀번호가 틀렸습니다.
        return res
          .status(401)
          .json({ result: false, message: "비밀번호가 틀렸습니다." });
      }
      // 토큰 발급
      const token = jwt.sign(
        { id: user.dataValues.id },
        process.env.SECRET_KEY
      );
      // 쿠키 설정
      res.cookie("token", token);
      // 토큰 응답
      res.json({ result: true, token });
    } catch (e) {
      return res.status(401).json({ result: false, message: "로그인 실패" });
    }
  } else {
    res.status(404).json({ result: false, message: "회원정보가 없습니다." });
  }
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
  console.log("category", cate);
  res.send({ category: cate });
};
module.exports = {
  main,
  signup,
  login,
  idCheck,
  signupProcess,
  loginProcess,
  write,
  getCategory,
  detailmain,
};
