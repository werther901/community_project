//변수 선언 - dom
const container_category = document.querySelector(".container_category");
const today_main = document.querySelector(".today_main");
const today_sub = document.querySelector(".today_sub");
const main_cards = document.querySelector(".main_cards");
const submain_content_all = document.querySelector(".submain_content_all");
const submain_content_free = document.querySelector(".submain_content_free");
const submain_content_news = document.querySelector(".submain_content_news");
const search_input = document.querySelector(".search_input");

//window 실행 시
window.onload = function () {
  //최신 글 axios 요청
  axios({
    method: "post",
    url: "/recentpost",
  })
    .then((res) => {
      console.log("Res", res);
      let recentdata_lst = res.data.recentdata;

      //최신 글 - main
      today_main.innerHTML = `
        <div class="today_main_img">
            <img class="imgstyle" src="${recentdata_lst[0].photo_address}" alt="bird" />
        </div>
        <div class="today_main_comment">
            <div class="today_more" onclick="main_moreview(${recentdata_lst[0].comment_id})">더보기</div>
            <div class="today_main_title">${recentdata_lst[0].title}</div>
            <div class="today_main_content">
            ${recentdata_lst[0].comment}
            </div>
        </div>
      `;

      //최신 글 - sub
      for (let i = 1; i < 4; i++) {
        today_sub.innerHTML += `
          <div class="today_sub_${i}" onclick="sub_moreview(${recentdata_lst[i].comment_id})">
            <div class="today_sub_title">${recentdata_lst[i].title}</div>
            <div class="today_sub_img">
            <img class="imgstyle" src="${recentdata_lst[i].photo_address}" alt="battle" />
            </div>
          </div>
        `;
      }
    })
    .catch((e) => {
      console.log("error : ", e);
    });

  //좋아요 높은 맛집 카테고리 글 2개
  axios({
    method: "post",
    url: "/bestfoodpost",
  }).then((res) => {
    console.log("res", res);
    let bestfood_lst = res.data.food_data;
    main_cards.innerHTML = bestfood_lst
      .map((item) => {
        return `
          <div class="card" onclick="postMove(${item.comment_id})">
            <div class="card_content">
              <div class="card_title">${item.title}</div>
              <div class="card_name">${item.User.name}</div>
              <div class="card_comment">${item.comment}</div>
            </div>
            <div class="card_img">
              <div class="card_img_style">
                <img class="imgstyle" src="${item.photo_address}" alt="food_img" />
              </div>
            </div>
          </div>
        `;
      })
      .join("");
  });

  //게시물 탐색 - 전체게시판
  axios({
    method: "post",
    url: "/allpost",
  }).then((res) => {
    console.log("allpost - res : ", res);
    let all_data = res.data;
    submain_content_all.innerHTML = all_data
      .map((item) => {
        return `
        <div class="submain_content">
          <div class="submain_content_row" onclick="postMove(${item.comment_id})">${item.title}</div>
          <div class="submain_row_name">${item.User.name}</div>
        </div>
        `;
      })
      .join("");
  });

  //게시물 탐색 - 자유 게시판
  axios({
    method: "post",
    url: "/categorypost",
  }).then((res) => {
    console.log("post - res : ", res);
    let all_data = res.data;
    submain_content_free.innerHTML = all_data
      .map((item) => {
        return `
        <div class="submain_content">
          <div class="submain_content_row" onclick="postMove(${item.comment_id})">${item.title}</div>
          <div class="submain_row_name">${item.User.name}</div>
        </div>
      `;
      })
      .join("");
  });
  //게시물 탐색 - 자유 게시판
  axios({
    method: "post",
    url: "/categorypost_news",
  }).then((res) => {
    console.log("post - res : ", res);
    let all_data = res.data;
    submain_content_news.innerHTML = all_data
      .map((item) => {
        return `
        <div class="submain_content">
          <div class="submain_content_row" onclick="postMove(${item.comment_id})">${item.title}</div>
          <div class="submain_row_name">${item.User.name}</div>
        </div>
      `;
      })
      .join("");
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
  window.location.href = "/detailmain?category_id=0";
}

//자유 게시판 더보기 클릭
function freepostview() {
  console.log("freepostview click");
  window.location.href = "/detailmain?category_id=1";
}

//뉴스 게시판 더보기 클릭
function newspostview() {
  console.log("newspostview click");
  window.location.href = "/detailmain?category_id=3";
}

//최신글 더보기 클릭
function main_moreview(id) {
  window.location.href = `/post?comment_id=${id}&category=0`;
}

//최신글 클릭 - sub
function sub_moreview(id) {
  window.location.href = `/post?comment_id=${id}&category=0`;
}

//맛집 베스트 이야기 페이지 이동
function postMove(id) {
  window.location.href = `/post?comment_id=${id}&category=0`;
}

//검색 기능
function search() {
  let search_str = search_input.value;
  window.location.href = `/detailmain?search=${search_str}`;
}
