//변수선언 - dom
const category_name = document.querySelector(".category_name");
const table_content = document.querySelector(".table_content");
//h1 change title
const url = new URL(window.location.href);
const urlParams = url.searchParams;
//console.log("urlSearch", urlParams.get("category_id"));

//main에서 전체 게시판 클릭 시
if (urlParams.get("category_id") === "all") {
  category_name.innerHTML = "<div>전체 게시판</div>";

  //전체 내용 띄우기
  axios({
    method: "post",
    url: "/detailmain/allPost",
  })
    .then((res) => {
      console.log("res", res);
      console.log("res data", res.data.allpost);

      let allpost_lst = res.data.allpost;

      table_content.innerHTML = allpost_lst
        .map((item) => {
          return `
            <div class="td_row" onclick="findpost(${item.comment_id})">
            <div class="td_img">
              <div class="table_img">
                <img
                  class="imgstyle"
                  src="${item.photo_address}"
                  alt="table_img"
                />
              </div>
            </div>
            <div class="td_title">${item.title}</div>
            <div class="td_user">${item.User.name}</div>
            <div class="td_like">${item.likes_cnt}</div>
          </div>
        `;
        })
        .join("");
    })
    .catch((e) => {
      console.log("error", e);
    });
} else {
  console.log(Number(urlParams.get("category_id")));
  //main에서 전체 게시판 외 다른 게시판 클릭 시 - 카테고리 요청
  axios({
    method: "post",
    url: "/detailmain/categoryselcet",
    data: { num: Number(urlParams.get("category_id")) },
  })
    .then((res) => {
      console.log("Res", res);
      let id = res.data.cate_id;
      let name = res.data.name; //카테고리 이름
      if (name.includes("게시판")) {
        category_name.innerHTML = `<div>${res.data.name}</div>`;
      } else {
        category_name.innerHTML = `<div>${res.data.name} 게시판</div>`;
      }

      //table 추가
      axios({
        method: "post",
        url: "/detailmain/allPost",
      }).then((res) => {
        //console.log("res", res);
        let postlist = res.data.allpost;

        const category_post = postlist.filter((element) => {
          //console.log("element", element.category, "id", id);
          return Number(element.category) === Number(id);
        });
        console.log("category_post", category_post);
        table_content.innerHTML = category_post
          .map((item) => {
            return `
            <div class="td_row" onclick="findpost(${item.comment_id})">
            <div class="td_img">
              <div class="table_img">
                <img
                  class="imgstyle"
                  src="${item.photo_address}"
                  alt="table_img"
                />
              </div>
            </div>
            <div class="td_title">${item.title}</div>
            <div class="td_user">${item.User.name}</div>
            <div class="td_like">${item.likes_cnt}</div>
          </div>
        `;
          })
          .join("");
      });
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

//각 포스트 클릭
function findpost() {
  console.log("findpost click");
  window.location.href = "/post";
}
