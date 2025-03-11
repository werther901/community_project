// 토큰 라이브러리
const jwt = require("jsonwebtoken");
// 비밀번호 암호화 라이브러리
const bcrypt = require("bcrypt");
// 날짜 데이터 변환 라이브러리
const moment = require("moment");
// env
require("dotenv").config();
// 데이터베이스 모델
const { Write, User, Category } = require("../models/index");

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

// naver
const naverLogin = (req, res) => {
  res.render("naver_login");
};

// 마이페이지
const mypage = (req, res) => {
  res.render("mypage");
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
  const {
    userId,
    password,
    name,
    address,
    phoneNumber,
    gender,
    birth,
    signup_method,
  } = req.body;

  console.log(req.body);
  const date = moment(birth, "YYYY-MM-DD").format("YYYY-MM-DD");
  console.log(date);
  console.log(typeof date);

  const salt = await bcrypt.genSalt(10);
  // 비밀번호 암호화
  const hashedPw = await bcrypt.hash(password, salt);
  // console.log("password : ", password);
  // console.log("hashedPw : ", hashedPw);

  try {
    const user = await User.create({
      userId,
      password: hashedPw,
      name,
      address,
      phoneNumber,
      gender,
      birth: date,
      signup_method: signup_method,
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
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );
      // 쿠키 설정
      res.cookie("token", token, { maxAge: 3600000 });
      // 토큰 응답
      res.json({ result: true, token });
    } catch (e) {
      return res.status(401).json({ result: false, message: "로그인 실패" });
    }
  } else {
    res.status(404).json({ result: false, message: "회원정보가 없습니다." });
  }
};

// 로그인 검증
const verifyProcess = async (req, res) => {
  console.log(req.headers.authorization);
  // 토큰 확인
  if (req.headers.authorization) {
    const headers = req.headers.authorization;
    const [bearer, token] = headers.split(" ");

    // 토큰 검증
    try {
      const { id } = jwt.verify(token, process.env.SECRET_KEY);
      console.log(id);

      // 데이터베이스 유저 조회
      const user = await User.findOne({ where: { id } });
      console.log(user);

      if (!user.dataValues.id) {
        // 로그인 실패
        return res
          .status(403)
          .json({ result: false, message: "유저 정보 조회 실패" });
      }
      // 성공
      res.json({ result: true, name: user.name, id: user.id });
    } catch (e) {
      return res
        .status(403)
        .json({ result: false, message: "토큰이 만료되었습니다." });
    }
  } else {
    return res.status(403).json({ result: false, message: "토큰이 없습니다." });
  }
};

// 네이버 로그인 요청
const naverLoginProcess = async (req, res) => {
  // 로그인 요청 데이터
  const { email, name, gender, birthday, phoneNumber, signup_method } =
    req.body;
  const user = await User.findOne({ where: { userId: email } });

  try {
    if (!user) {
      // user가 없으면 db에 회원정보 저장 후 토큰 발급
      const addUser = await User.create({
        userId: email,
        name: name,
        gender: gender,
        birth: birthday,
        phoneNumber: phoneNumber,
        signup_method: signup_method,
      });

      const token = jwt.sign(
        { id: addUser.dataValues.id },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );
      // 쿠키 설정
      res.cookie("token", token);
      // 토큰 응답
      return res.json({ result: true, token });
    }
    const token = jwt.sign({ id: user.dataValues.id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    // 쿠키 설정
    res.cookie("token", token);
    // 토큰 응답
    return res.json({ result: true, token });
  } catch (error) {
    return res
      .status(403)
      .json({ result: false, message: "네이버 로그인 실패" });
  }
};

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

//최신 글 요청
const recentPost = async (req, res) => {
  /* findall를 통해 전체 데이터를 가지고 온 후 id를 
  기준으로 내림차순 후 4개만 전송하기 */
  let recentdata = await Write.findAll({
    order: [["comment_id", "desc"]],
    limit: 4,
  }).catch((err) => console.log(err));
  //console.log("recent", recentdata);
  res.send({ recentdata });
};

module.exports = {
  main,
  signup,
  login,
  naverLogin,
  mypage,
  idCheck,
  signupProcess,
  loginProcess,
  naverLoginProcess,
  verifyProcess,
  getCategory,
  detailmain,
  recentPost,
};
