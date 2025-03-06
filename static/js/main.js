//로그인 클릭 버튼
function login() {
  console.log("login click");
}

//회원가입 클릭 버튼
function signup() {
  console.log("signup click");
}

//전체 게시판 더보기 클릭
function allpostview() {
  console.log("allpostview click");
}

//자유 게시판 더보기 클릭
function freepostview() {
  console.log("freepostview click");
}

//뉴스 게시판 더보기 클릭
function newspostview() {
  console.log("newspostview click");
}

// 250305 임시 로그아웃 기능
const content01 = document.querySelector(".content01");

const logoutFunc = () => {
  // 쿠키 삭제
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  // 페이지 새로고침
  window.location.reload();
};
