//변수선언 - dom
const category_name = document.querySelector(".category_name");

//h1 change title
const url = new URL(window.location.href);
const urlParams = url.searchParams;
//console.log("urlSearch", urlParams.get("category_id"));

//main에서 전체 게시판 클릭 시
if (urlParams.get("category_id") === "all") {
  category_name.innerHTML = "<div>전체 게시판</div>";
} else {
  console.log(Number(urlParams.get("category_id")));
  //main에서 전체 게시판 외 다른 게시판 클릭 시
  axios({
    method: "post",
    url: "/detailmain/categoryselcet",
    data: { num: Number(urlParams.get("category_id")) },
  })
    .then((res) => {
      console.log("Res", res);
      let name = res.data.name; //카테고리 이름
      if (name.includes("게시판")) {
        category_name.innerHTML = `<div>${res.data.name}</div>`;
      } else {
        category_name.innerHTML = `<div>${res.data.name} 게시판</div>`;
      }
    })
    .catch((e) => {
      console.log("error : ", e);
    });
}

//생성 버튼 클릭
function createPost() {
  console.log("createPost click");
  window.location.href = "/write";
}
