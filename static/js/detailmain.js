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

      let allpost_lst = res.data.allpost;

      table_content.innerHTML = allpost_lst
        .map((item) => {
          return `
            <div class="td_row" onclick="findpost(${item.comment_id},0)">
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
            <div class="td_row" onclick="findpost(${item.comment_id},${id})">
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
  //console.log("createPost click");
  window.location.href = "/write";
}

//각 포스트 클릭
function findpost(element, cate) {
  //console.log("findpost click");
  window.location.href = `/post?comment_id=${element}&category=${cate}`;
}

// 사용자 검증
(async function () {
  try {
    // 쿠키에서 토큰 추출하기
    // 브라우저에는 쿠키가 하나의 문자열로 관리되고 ';'를 기준으로 여러개 저장되기 때문에 token만 뽑으려고 split(";")하는 것
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((item) =>
      item.trim().startsWith("token=")
    );

    if (!tokenCookie) {
      //alert("토큰이 없습니다.");
      const postbtn = document.querySelector(".postbtn");
      postbtn.style.display = "none";
      //window.location.href = "/login";
      return;
    }

    // 토큰 값만 추출 (token= 부분 제거)
    const token = tokenCookie.trim().substring(6);

    // 토큰 검증 요청
    const res = await axios.post(
      "/verify",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res.data.result) {
      userid = res.data.id; //현재 접속한 user의 id(user table의 id)
      console.log("현재 접속한 유저의 id(PK)", userid);
    }
  } catch (error) {
    console.error("Authentication error:", error);
  }
})();
