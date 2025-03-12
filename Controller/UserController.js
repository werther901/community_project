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

// 네이버 로그인
const naverLogin = (req, res) => {
  res.render("naver_login");
};

// 카카오 로그인
const kakaoLogin = (req, res) => {
  res.render("kakao_login");
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
  const { userId, password, name, address, phoneNumber, gender, birth, signup_method } = req.body;

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
    return res.status(400).json({ result: false, message: "회원가입 실패2", error: e });
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
        return res.status(401).json({ result: false, message: "비밀번호가 틀렸습니다." });
      }
      // 토큰 발급
      const token = jwt.sign({ id: user.dataValues.id }, process.env.SECRET_KEY, { expiresIn: "1h" });
      // 쿠키 설정
      res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
      // 토큰 응답
      res.json({ result: true, token });
    } catch (e) {
      return res.status(401).json({ result: false, message: "로그인 실패" });
    }
  } else {
    res.status(401).json({ result: false, message: "회원정보가 없습니다." });
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
        return res.status(403).json({ result: false, message: "유저 정보 조회 실패" });
      }
      // 성공
      res.json({ result: true, name: user.name, id: user.id });
    } catch (e) {
      return res.status(403).json({ result: false, message: "토큰이 만료되었습니다." });
    }
  } else {
    return res.status(403).json({ result: false, message: "토큰이 없습니다." });
  }
};

// 네이버 로그인 요청
const naverLoginProcess = async (req, res) => {
  // 로그인 요청 데이터
  const { email, name, gender, birthday, phoneNumber, signup_method } = req.body;
  const user = await User.findOne({ where: { userId: email } });
  console.log(user);

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

      const token = jwt.sign({ id: addUser.dataValues.id }, process.env.SECRET_KEY, { expiresIn: "1h" });
      // 쿠키 설정
      res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
      // 토큰 응답
      return res.json({ result: true, token });
    }
    // user가 있으면 로그인 방법 일치여부 체크
    if (user.dataValues.signup_method !== signup_method) {
      // 로그인 방법이 일치하지 않으면 '이미 다른 방법으로 가입된 사용자입니다.' 안내
      const method = user.dataValues.signup_method === 'kakao' ? "카카오" : "홈페이지";

      return res.json({ result: false, message: `이미 ${method}로 가입된 사용자입니다.`});
    } else {
      // 로그인 방법도 일치하면 -> 로그인 성공
      const token = jwt.sign({ id: user.dataValues.id }, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });
      res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
      return res.json({ result: true, token });
    }
  } catch (error) {
    return res.status(403).json({ result: false, message: "네이버 로그인 실패" });
  }
};

// 카카오 로그인 요청
const kakaoLoginProcess = async (req, res) => {
  const { email, name, gender, birthday, phoneNumber, signup_method } = req.body;
  console.log(req.body);

  const user = await User.findOne({ where: { userId: email } });

  try {
    if (user) {
      // email 있고 로그인 방법이 맞으면 로그인 성공
      if(user.dataValues.signup_method === signup_method) {
        const token = jwt.sign({ id: user.dataValues.id }, process.env.SECRET_KEY, {
          expiresIn: "1h"
        });
        res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
        return res.json({ result: true, token });
      } else {
        // email은 있지만 로그인 방법이 다를 경우 '이미 다른 방법으로 가입된 사용자입니다.' 안내
        const method = user.dataValues.signup_method === 'naver' ? "네이버" : "홈페이지";

        return res.json({ result: false, message: `이미 ${method}로 가입된 사용자입니다.`});
      }
    } else {
      // user가 없으면 db에 회원정보 저장 후 토큰 발급
      const addUser = await User.create({
        userId: email,
        name: name,
        gender: gender,
        birth: birthday,
        phoneNumber: phoneNumber,
        signup_method: signup_method,
      });

      const token = jwt.sign({ id: addUser.dataValues.id }, process.env.SECRET_KEY, { expiresIn: "1h" });
      // 쿠키 설정
      res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
      // 토큰 응답
      return res.json({ result: true, token });
    }
  } catch (error) {
    console.log(error);
    return res.status(403).json({ result: false, message: "카카오 로그인 실패" });
  }
};

// 카테고리 요청 - all
const getCategory = async (req, res) => {
  let categoryname = await Category.findAll({}).catch((err) => console.log(err));
  let cate = []; //카테고리 이름
  categoryname.map((item) => {
    cate.push(item.dataValues);
  });
  // console.log("category", cate);
  res.send({ category: cate });
};

module.exports = {
  main,
  signup,
  login,
  naverLogin,
  kakaoLogin,
  mypage,
  idCheck,
  signupProcess,
  loginProcess,
  naverLoginProcess,
  kakaoLoginProcess,
  verifyProcess,
  getCategory,
  detailmain,
};
