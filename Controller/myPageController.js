// 데이터베이스 모델
const { Write, User, Like } = require("../models/index");

// 마이페이지
const mypage = (req, res) => {
  res.render("mypage");
};

// 좋아요한 글 페이지
const likedPage = (req, res) => {
  res.render("likedpage")
};

// 내가 작성한 글 페이지
const view_mypost = (req, res) => {
  res.render("view_mypost");
}

// 유저가 좋아요 한 글 표시
const user_liked_post = async (req, res) => {
  console.log("11", req.body);
  const { id } = req.body;
  // const user = await User.findOne({ where: { id : id } });
  // console.log("좋아요 한 글", user);
  const userLike = await Like.findAll({
    where: { user_id: id },
    include: [
      {
        model: Write,
        attributes: ["comment_id", "title"],
        include : [
          {
            model: User,
            attributes: ["name"]
          }
        ]
      }
    ],
  });
  console.log("userLike : ", userLike);

  const datas = userLike.map((items) => {
    return {
      write: items.Write.dataValues
    }
  })
  console.log("datas : ", datas);

  const data = datas.map((item) => {
    // console.log(item.write.User);

    return {
      comment_id: item.write.comment_id,
      title: item.write.title,
      user : item.write.User
    }
  })
  console.log(data);

  res.send(datas);
}

module.exports = { mypage, likedPage, view_mypost, user_liked_post }