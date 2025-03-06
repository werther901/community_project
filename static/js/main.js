//변수 선언 - dom
const container_category = document.querySelector(".container_category");

window.onload = function () {
  //카테고리 표시
  axios({
    method: "post",
    url: "/category",
  })
    .then((res) => {
      console.log("Res", res.data.category);
      let category = res.data.category;
      category.map((item) => {
        container_category.innerHTML += `<div onclick="categoryMove(${item.category_id})">${item.name}</div>`;
      });
    })
    .catch((e) => {
      console.log("error", e);
    });
};
//로그인 클릭 버튼
function login() {
  console.log("login click");
  window.location.href = "/login";
}

//회원가입 클릭 버튼
function signup() {
  console.log("signup click");
  window.location.href = "/signup";
}

//전체 게시판 더보기 클릭
function allpostview() {
  console.log("allpostview click");
  //window.location.href = "/postview";
  axios({
    method: "get",
    url: "/postviewmove",
    data: { category: "all" },
  })
    .then((res) => {
      console.log("res", res);
      window.location.href = "/postview";
    })
    .catch((e) => {
      console.log("error : ", e);
    });
}

//자유 게시판 더보기 클릭
function freepostview() {
  console.log("freepostview click");
}

//뉴스 게시판 더보기 클릭
function newspostview() {
  console.log("newspostview click");
}


