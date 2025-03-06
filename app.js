const express = require("express");
const path = require("path");
const ejs = require("ejs"); // 페이지 로딩을 위해 필수
const port = 3000;
const app = express();
// 쿠키 생성
const cookieParser = require("cookie-parser");
// JWT 생성
const jwt = require('jsonwebtoken');

// body-parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "static")));

// cookie
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", "./views");

// 라우터
app.use('/', require('./Routes/UserRouter'));

app.listen(port, () => {
  console.log(`http://localhost:3000 / Example app listening on port ${port}`);
});
