// 비밀번호 암호화 라이브러리
const bcrypt = require("bcrypt");

// 데이터베이스 모델
const { Write, User, Like } = require("../models/index");

// 마이페이지
const mypage = (req, res) => {
  res.render("mypage");
};

// 좋아요한 글 페이지
const likedPage = (req, res) => {
  res.render("likedpage");
};

// 내가 작성한 글 페이지
const view_mypost = (req, res) => {
  res.render("view_mypost");
};

// 유저가 좋아요 한 글 표시
const user_liked_post = async (req, res) => {
  const { id } = req.body;
  const userLike = await Like.findAll({
    where: { user_id: id },
    include: [
      {
        model: Write,
        attributes: ["comment_id", "title", "view_cnt"],
        include: [
          {
            model: User,
            attributes: ["name"],
          },
        ],
      },
    ],
  });
  console.log("userLike : ", userLike);

  const datas = userLike.map((items) => {
    return {
      write: items.Write.dataValues,
    };
  });
  console.log("datas : ", datas);

  // const data = datas.map((item) => {
  //   // console.log(item.write.User);
  //   return {
  //     comment_id: item.write.comment_id,
  //     title: item.write.title,
  //     user : item.write.User
  //   }
  // })
  // console.log(data);

  res.send(datas);
};

// 유저가 작성한 글 표시
const user_view_mypost = async (req, res) => {
  const { id } = req.body;

  const userWrite = await Write.findAll({
    where: { userId: id },
    attributes: ["comment_id", "title", "likes_cnt", "createdAt"],
    include: [
      {
        model: User,
        attributes: ["name"],
      },
    ],
  });
  // console.log("userWrite : ", userWrite);

  const datas = userWrite.map((items) => {
    return {
      write: items.dataValues,
    };
  });
  console.log("datas : ", datas);
  res.send(datas);
};

// 회원정보 수정
const edit_userInfo = async (req, res) => {
  console.log(req.body);
  const {
    id,
    password,
    new_password,
    new_password_check,
    address,
    phoneNumber,
  } = req.body;
  const user = await User.findOne({ where: { userId: id } });

  if (user) {
    try {
      // 비밀번호 비교
      const match = await bcrypt.compare(password, user.dataValues.password);

      if (!match) {
        // 비밀번호가 틀렸습니다.
        return res.json({ result: false, message: "비밀번호가 틀렸습니다." });
      }
      // 비밀번호 변경이 있을때
      if (new_password) {
        const hashedNewPassword = await bcrypt.hash(new_password, 10);

        await User.update(
          {
            password: hashedNewPassword,
            address: address || user.address,
            phoneNumber: phoneNumber || user.phoneNumber,
          },
          {
            where: { userId: id },
          }
        );
        return res.json({
          result: true,
          message: "회원정보가 성공적으로 수정되었습니다.",
        });
      }
      // 비밀번호 변경이 없을때
      await User.update(
        {
          address: address || user.address,
          phoneNumber: phoneNumber || user.phoneNumber,
        },
        {
          where: { userId: id },
        }
      );

      return res.json({
        result: true,
        message: "회원정보가 성공적으로 수정되었습니다.",
      });
    } catch (e) {
      return res
        .status(401)
        .json({ result: false, message: "회원정보 수정 실패" });
    }
  } else {
    res.json({
      result: false,
      message: "비밀번호가 일치하지 않습니다. 비밀번호를 정확히 입력해 주세요.",
    });
  }
};

module.exports = {
  mypage,
  likedPage,
  view_mypost,
  user_liked_post,
  user_view_mypost,
  edit_userInfo,
};
