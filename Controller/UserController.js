// 토큰 라이브러리
const jwt = require("jsonwebtoken");
// 비밀번호 암호화 라이브러리
const bcrypt = require("bcrypt");
// 날짜 데이터 변환 라이브러리
const moment = require("moment");
// env
require("dotenv").config();
const sequelize = require("sequelize"); //시퀄라이즈
const Op = sequelize.Op; //포함 여부를 알기 위해 사용
// 데이터베이스 모델
const { Write, User, Category } = require("../models/index");
const { post } = require("../Routes/UserRouter");

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
// const mypage = (req, res) => {
//   res.render("mypage");
// };

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
      res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
      // 토큰 응답
      res.json({ result: true, token });
    } catch (e) {
      return res.status(401).json({ result: false, message: "로그인 실패" });
    }
  } else {
    res.json({
      result: false,
      message:
        "아이디 또는 비밀번호가 잘못 되었습니다. 아이디와 비밀번호를 정확히 입력해 주세요.",
    });
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
      res.json({
        result: true,
        name: user.name,
        id: user.id,
        email: user.userId,
        phoneNumber: user.phoneNumber,
      });
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

      const token = jwt.sign(
        { id: addUser.dataValues.id },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );
      // 쿠키 설정
      res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
      // 토큰 응답
      return res.json({ result: true, token });
    }
    // user가 있으면 로그인 방법 일치여부 체크
    if (user.dataValues.signup_method !== signup_method) {
      // 로그인 방법이 일치하지 않으면 '이미 다른 방법으로 가입된 사용자입니다.' 안내
      const method =
        user.dataValues.signup_method === "kakao" ? "카카오" : "홈페이지";

      return res.json({
        result: false,
        message: `이미 ${method}로 가입된 사용자입니다.`,
      });
    } else {
      // 로그인 방법도 일치하면 -> 로그인 성공
      const token = jwt.sign(
        { id: user.dataValues.id },
        process.env.SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );
      res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
      return res.json({ result: true, token });
    }
  } catch (error) {
    return res
      .status(403)
      .json({ result: false, message: "네이버 로그인 실패" });
  }
};

// 카카오 로그인 요청
const kakaoLoginProcess = async (req, res) => {
  const { email, name, gender, birthday, phoneNumber, signup_method } =
    req.body;
  console.log(req.body);

  const user = await User.findOne({ where: { userId: email } });

  try {
    if (user) {
      // email 있고 로그인 방법이 맞으면 로그인 성공
      if (user.dataValues.signup_method === signup_method) {
        const token = jwt.sign(
          { id: user.dataValues.id },
          process.env.SECRET_KEY,
          {
            expiresIn: "1h",
          }
        );
        res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
        return res.json({ result: true, token });
      } else {
        // email은 있지만 로그인 방법이 다를 경우 '이미 다른 방법으로 가입된 사용자입니다.' 안내
        const method =
          user.dataValues.signup_method === "naver" ? "네이버" : "홈페이지";

        return res.json({
          result: false,
          message: `이미 ${method}로 가입된 사용자입니다.`,
        });
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

      const token = jwt.sign(
        { id: addUser.dataValues.id },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );
      // 쿠키 설정
      res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
      // 토큰 응답
      return res.json({ result: true, token });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(403)
      .json({ result: false, message: "카카오 로그인 실패" });
  }
};

// 마이페이지에 유저 정보 전달

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

const bestFood = async (req, res) => {
  let food_data = await Write.findAll({
    include: [
      {
        model: User, // User 모델과 조인
        attributes: ["name"], // User 테이블에서 name 값만 가져옴
      },
    ],
    where: { category: 2 },
    order: [["likes_cnt", "desc"]],
    limit: 2,
  }).catch((err) => console.log(err));
  //console.log("recent", recentdata);
  res.send({ food_data });
};

//전체 게시물 탐색
const allpost = async (req, res) => {
  let postdata = await Write.findAll({
    include: [
      {
        model: User, // User 모델과 조인
        attributes: ["name"], // User 테이블에서 name 값만 가져옴
      },
    ],
    limit: 8,
  }).catch((err) => console.log(err));
  res.send(postdata);
};

//나머지 게시물 탐색
const categorypost = async (req, res) => {
  let postdata = await Write.findAll({
    where: { category: 1 },
    include: [
      {
        model: User, // User 모델과 조인
        attributes: ["name"], // User 테이블에서 name 값만 가져옴
      },
    ],
    limit: 8,
  }).catch((err) => console.log(err));
  res.send(postdata);
};

//나머지 게시물 탐색
const categorypost_news = async (req, res) => {
  let postdata = await Write.findAll({
    where: { category: 3 },
    include: [
      {
        model: User, // User 모델과 조인
        attributes: ["name"], // User 테이블에서 name 값만 가져옴
      },
    ],
    limit: 8,
  }).catch((err) => console.log(err));
  res.send(postdata);
};

const search = async (req, res) => {
  const str = req.body.str;
  const select = req.body.select;
  if (select === "title") {
    let data_lst = await Write.findAll({
      include: [
        {
          model: User, // User 모델과 조인
          attributes: ["name"], // User 테이블에서 name 값만 가져옴
        },
      ],
      where: {
        title: {
          [Op.like]: "%" + str + "%",
        },
      },
    }).catch((err) => console.log(err));
    res.send(data_lst);
  } else if (select === "comment") {
    let data_lst = await Write.findAll({
      include: [
        {
          model: User, // User 모델과 조인
          attributes: ["name"], // User 테이블에서 name 값만 가져옴
        },
      ],
      where: {
        comment: {
          [Op.like]: "%" + str + "%",
        },
      },
    }).catch((err) => console.log(err));
    res.send(data_lst);
  } else if (select === "user") {
    /* 
    현재 str은 이름이 입력되어 있음. 이후 findall를 통해 해당 userid를
    찾고 해당 userid를 통해 comment를 찾음
    */
    let data_result = [];
    let data = await User.findAll({
      attributes: ["name", "id"],
      where: {
        name: {
          [Op.like]: "%" + str + "%",
        },
      },
      raw: true,
    }).catch((err) => console.log(err));

    data.map((item) => {
      data_result.push(item.id);
    });

    console.log("data : ", data[0].id);
    //let data_result = data[0].id;
    let data_lst = await Write.findAll({
      include: [
        {
          model: User, // User 모델과 조인
          attributes: ["name"], // User 테이블에서 name 값만 가져옴
        },
      ],
      where: {
        userId: data_result,
      },
    }).catch((err) => console.log(err));
    res.send(data_lst);
  }
};

module.exports = {
  main,
  signup,
  login,
  naverLogin,
  kakaoLogin,
  idCheck,
  signupProcess,
  loginProcess,
  naverLoginProcess,
  kakaoLoginProcess,
  verifyProcess,
  getCategory,
  detailmain,
  recentPost,
  bestFood,
  allpost,
  categorypost,
  categorypost_news,
  search,
};
