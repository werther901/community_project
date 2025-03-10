const path = require("path");
const Sequelize = require("sequelize");

//개발모드 환경설정
const env = process.env.NODE_ENV || "development";

//DB연결 환경설정정보 변경처리//관련정보 수정
const config = require(path.join(__dirname, "..", "config", "config.json"))[
  env
];

//데이터 베이스 객체
const db = {};

//DB연결정보로 시퀄라이즈 ORM 객체 생성
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

//DB 처리 객체에 시퀄라이즈 정보 맵핑처리
//이후 DB객체를 통해 데이터 관리가능해짐
db.sequelize = sequelize; //DB연결정보를 포함한 DB제어 객체속성(CRUD)
db.Sequelize = Sequelize; //Sequelize팩키지에서 제공하는 각종 데이터 타입 및 관련 객체정보를 제공함

//게시글 모델 모듈 파일 참조하고 db속성정의하기
db.User = require("./user.js")(sequelize, Sequelize.DataTypes);
db.Category = require("./category.js")(sequelize, Sequelize.DataTypes);
db.Write = require("./write.js")(sequelize, Sequelize.DataTypes);
db.Like = require("./like.js")(sequelize, Sequelize.DataTypes);

// 관계 설정
db.Write.belongsTo(db.User, { foreignKey: "userId", targetKey: "id" });
db.User.hasMany(db.Write, { foreignKey: "userId", sourceKey: "id" });
db.Write.belongsTo(db.Category, {
  foreignKey: "category",
  targetKey: "category_id",
});
db.Category.hasMany(db.Write, {
  foreignKey: "category",
  sourceKey: "category_id",
});

// 이건 app.js에 작성하는게 좋음
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("데이터베이스 연결됨.");
  })
  .catch((err) => {
    console.error("db연결 오류 : ", err);
  });

//db객체 외부로 노출하기
module.exports = db;
