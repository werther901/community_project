// 변수 선언 - url
const url = new URL(window.location.href);
const urlParams = url.searchParams;
//console.log("urlSearch", urlParams.get("comment_id")); //10

// 변수 선언
const main_content = document.querySelector(".main_content");
let postdata = {};
// 페이지 로드 시 axios 요청
axios({
  method: "post",
  url: "/post/viewpost",
  data: { viewurl: urlParams.get("comment_id") },
})
  .then((res) => {
    console.log("res", res);
    postdata = res.data.write;

    //화면 표시하기
    main_content.innerHTML = `
          <div class="content_top">
            <div class="content_category">${postdata.Category.name}</div>
            <div class="content_title">${postdata.title}</div>
            <div class="content_detils">
              <div class="content_userid">${postdata.User.name}</div>
              <div class="content_detils_right">
                <div class="copyurl">url복사</div>
                <div class="moreview">더보기</div>
              </div>
            </div>
          </div>
          <div class="main_img">
            <img class="imgstyle" src="${postdata.photo_address}" alt="main_img" />
          </div>
          <div class="content_comment">${postdata.comment}</div>
          <div class="content_top_bottom">
            <div class="like_btn">좋아요</div>
            <div class="share_post">공유</div>
            <div class="notify_post">신고</div>
          </div>      
    `;
  })
  .catch((e) => {
    console.log("error : ", e);
  });

//목록으로 이동
function postlist() {
  console.log("postlist click");
  window.location.href = "/detailmain?category_id=all";
}

//글쓰기 페이지 이동
function writePage() {
  console.log("writePage click");
  window.location.href = "/write";
}

// 수정 버튼 클릭
function post_modify() {
  window.location.href = `/write?comment_id=${postdata.comment_id}`;
  // axios({
  //   method: "post",
  //   url: "/write/postmodify",
  //   data: postdata,
  // }).then((res) => {
  //   window.location.href = "/write";
  // });
}

//삭제 버튼 클릭
function post_delete() {
  let id = postdata.comment_id;
  Swal.fire({
    title: "정말로 삭제 하시겠습니까?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "삭제하기",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "삭제되었습니다",
        icon: "success",
      }).then((results) => {
        if (results.isConfirmed) {
          axios({
            method: "delete",
            url: `/post/delete/${id}`,
          }).then((res) => {
            window.location.href = "/";
            //window.location.href = `/detailmain?category=${postdata.category}`;
          });
        }
      });
    }
    //axios요청하여 삭제하기
  });
}
