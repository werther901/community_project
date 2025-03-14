// 변수 선언 - url
const url = new URL(window.location.href);
const urlParams = url.searchParams;
//console.log("urlSearch", urlParams.get("comment_id")); //10

// 변수 선언
const main_content = document.querySelector(".main_content");
let postdata = {};
const current_category = urlParams.get("category"); //현재 url category number
const current_category_num = Number(urlParams.get("comment_id")); //현재 url comment_id
const modifybtn = document.querySelector(".modifybtn");
const deletebtn = document.querySelector(".deletebtn");
const sub_post = document.querySelector(".sub_post");
let check = 0; //유저이름 클릭 시 페이지 이동 용
//let current_user_id = "";

// 페이지 로드 시 axios 요청
axios({
  method: "post",
  url: "/post/viewpost",
  data: { viewurl: urlParams.get("comment_id") },
})
  .then((res) => {
    //console.log("res", res);
    postdata = res.data.write;
    let dbTime = postdata.createdAt;
    //const dbTime = x.write.createdAt;
    const date = new Date(dbTime);
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Seoul",
    };

    const formatDate = date.toLocaleString("ko-KR", options);
    //console.log("Date", current_date);
    //화면 표시하기
    main_content.innerHTML = `
          <div class="content_top">
            <div class="content_category">${postdata.Category.name}</div>
            <div class="content_title">${postdata.title}</div>
            <div class="content_detils">
              <div class="content_userid" onclick="usermodal()">${postdata.User.name}</div>
              <div class="content_userid_modal" onclick="userpost(${postdata.userId})">- 게시글 보기</div>
              <div class="content_detils_right">
                <div class="write_time">작성시간 : ${formatDate}</div>
                <div class="show">조회수 ${postdata.view_cnt}</div>
                <div class="copyurl" onclick="copyurl()">url복사</div>
                <div class="moreview" onclick="printer()">Print</div>
              </div>
            </div>
          </div>
          <div class="main_img">
            <img class="imgstyle" src="${postdata.photo_address}" alt="main_img" />
          </div>
          <div class="content_comment">${postdata.comment}</div>
          <div class="content_top_bottom">
            <div class="bottom_like">
              <div class="like_btn" onclick="likes()">좋아요</div> 
              <div class="like_img">
                <img class="imgstyle heart_img" src ="" alt="heart_img" />
              </div>
              <div class="like_number"></div>
            </div>
            <div class="share_post">공유</div>
            <div class="notify_post">신고</div>
          </div>      
    `;
  })
  .catch((e) => {
    console.log("error : ", e);
  });

//좋아요 숫자
function like_num() {
  const like_number = document.querySelector(".like_number");
  /*
  axios를 통해 현재 포스트의 comment_id를 보내
  전체 like 테이블에서 해당 comment_id만 찾아 res보냄
  받은 res를 통해 길이를 찾아 해당 div에 넣어줌 
  */
  axios({
    method: "post",
    url: "/post/row",
    data: { comment_id: current_category_num },
  }).then((res) => {
    //console.log("res", res);
    let data_lst = res.data;
    if (data_lst.length === 0) {
      like_number.innerHTML = `<div>0</div>`;
    } else {
      like_number.innerHTML = `<div>${data_lst.length}</div>`;
    }
  });
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
      alert("로그인 후 사용이 가능합니다.");
      window.location.href = "/login";
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

      //페이지 로드 시 DOM 변수 선언
      const heart_img = document.querySelector(".heart_img");

      //해당 아이디가 아닌 경우 수정 삭제 버튼 없애기
      axios({
        method: "post",
        url: "/post/checkloginuser",
        data: {
          userid: userid,
          comment_id: current_category_num,
        },
      }).then((res) => {
        console.log("/post/checkloginuser : ", res.data.user);
        if (Number(userid) !== Number(res.data.user.userId)) {
          modifybtn.style.display = "none";
          deletebtn.style.display = "none";
        } else {
          modifybtn.style.display = "block";
          deletebtn.style.display = "block";
        }
      });

      //axios - 요청 like 테이블에 값이 있는지 확인 - 초기 heart_img src 세팅
      axios({
        method: "post",
        url: "/post/checkuser",
        data: {
          userid: userid,
          comment_id: current_category_num,
        },
      }).then((res) => {
        //console.log("checkuser res", res);

        if (res.data.user === null) {
          //만약 data > user > null인 경우 -> 데이터가 없어 빈 하트인 경우
          heart_img.src = "images/heart.png";
          heart_img.style.display = "none";
          //좋아요 숫자 표시
          like_num();
        } else {
          //좋아요 버튼을 이미 누른 상태
          heart_img.src = "images/fullheart.png";
          heart_img.style.display = "none";
          //좋아요 숫자 표시
          like_num();
        }
      });
    }
  } catch (error) {
    console.error("Authentication error:", error);
  }
})();

//목록으로 이동
function postlist() {
  console.log("postlist click");
  const category_num = urlParams.get("category");
  window.location.href = `/detailmain?category_id=${category_num}`;
}

//글쓰기 페이지 이동
function writePage() {
  console.log("writePage click");
  window.location.href = "/write";
}

// 수정 버튼 클릭
function post_modify() {
  window.location.href = `/write?comment_id=${postdata.comment_id}`;
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
  });
}

//이전글 버튼 클릭
function postMove_pre() {
  axios({
    method: "post",
    url: "/post/movePost",
    data: { now_category: current_category },
  })
    .then((res) => {
      console.log("movePost res : ", res.data);
      const category_data_lst = res.data;
      let category_id_lst = []; //comment_id 비교 리스트

      //comment_id만 배열에 넣기
      category_data_lst.map((item) => {
        category_id_lst.push(Number(item.comment_id));
      });

      //console.log("cate", category_id_lst);

      if (category_id_lst.indexOf(current_category_num) === 0) {
        alert("이전 글이 없습니다.");
      } else {
        let pre_id =
          category_id_lst[category_id_lst.indexOf(current_category_num) - 1];

        //페이지 이동
        window.location.href = `/post?comment_id=${pre_id}&category=${current_category}`;
      }
    })
    .catch((e) => {
      console.log("error : ", e);
    });
}

//다음 글 이동 클릭 함수
function postMove_next() {
  axios({
    method: "post",
    url: "/post/movePost",
    data: { now_category: current_category },
  })
    .then((res) => {
      console.log("res", res.data);
      const category_data_lst = res.data;
      let category_id_lst = []; //comment_id 비교 리스트

      //comment_id만 배열에 넣기
      category_data_lst.map((item) => {
        category_id_lst.push(Number(item.comment_id));
      });

      //console.log("cate", category_id_lst);

      if (
        category_id_lst.indexOf(current_category_num) ===
        category_id_lst.length - 1
      ) {
        alert("다음 글이 없습니다.");
      } else {
        let next_id =
          category_id_lst[category_id_lst.indexOf(current_category_num) + 1];

        //페이지 이동
        window.location.href = `/post?comment_id=${next_id}&category=${current_category}`;
      }
    })
    .catch((e) => {
      console.log("error : ", e);
    });
}

//프린터 클릭
function printer() {
  window.print();
}

//url복사 클릭
function copyurl() {
  //console.log("url", window.location.href);
  const current_url = window.location.href;
  navigator.clipboard.writeText(current_url).then((res) => {
    alert("주소가 복사되었습니다!");
  });
}

//좋아요 클릭
function likes() {
  const heart_img = document.querySelector(".heart_img");
  let like_data = {
    userid: userid,
    comment_id: current_category_num,
    is_liked: "True",
  };

  //axios - 요청 like 테이블에 값이 있는지 확인
  axios({
    method: "post",
    url: "/post/checkuser",
    data: like_data,
  }).then((res) => {
    console.log("res", res);
    if (res.data.user === null) {
      //만약 data > user > null인 경우 -> 처음 좋아요를 누른 상태
      axios({
        method: "post",
        url: "/post/like_adduser",
        data: like_data,
      }).then((res) => {
        console.log("res", res);
        heart_img.src = "/images/fullheart.png";

        //좋아요 글자 위로 하트 나오는 CSS
        heart_img.style.display = "block";
        heart_img.classList.add("animated");
        setTimeout(() => {
          heart_img.style.display = "none";
        }, 2000);

        like_num(); //숫자변경
      });
    } else {
      //좋아요 버튼을 이미 누른 상태
      axios({
        method: "delete",
        url: "/post/like_deleteuser",
        data: like_data,
      }).then((res) => {
        console.log("res", res);
        heart_img.src = "/images/heart.png";
        //좋아요 글자 위로 하트 나오는 CSS
        heart_img.style.display = "block";
        heart_img.classList.add("animated");
        setTimeout(() => {
          heart_img.style.display = "none";
        }, 2000);
        like_num();
      });
    }
  });
}

//화면 로드 시 sub_post 포스트 최대 5개 보여주기
axios({
  method: "post",
  url: "/post/movePost",
  data: { now_category: current_category },
}).then((res) => {
  //console.log("subpost : ", res);
  let data_lst = res.data;
  //console.log("dta_lst", data_lst);
  let data_lst_id = [];
  data_lst.map((item) => {
    data_lst_id.push(item.comment_id);
  });

  //전체 배열 중 몇 번째에 위치한지 찾기
  let cnt = 0;
  data_lst_id.forEach((element, index) => {
    if (current_category_num === element) {
      cnt = index; //현재 페이지 번호
    }
  });

  // 앞 2개, 현재, 뒤 2개 (경계 검사)
  let start = Math.max(cnt - 2, 0);
  let end = Math.min(cnt + 2, data_lst.length - 1);
  //console.log("cnt", cnt, "Start", start, "end", end);
  let selectedCards = data_lst.slice(start, end + 1); // 5개 선택

  //console.log("selectedCards", selectedCards);

  for (let i = start; i < start + 5; i++) {
    //console.log("Data list", data_lst_id[i]); //14 현16

    if (data_lst_id[i] !== undefined && Number(current_category) !== 0) {
      let currentItem = data_lst[i]; //현재를 기준으로 처음 값
      let isCurrent = currentItem.comment_id === current_category_num; //현재의 comment_id값
      let cardClass = isCurrent ? "card current" : "card"; //스타일 지정

      sub_post.innerHTML += `
      <div class="${cardClass}" 
        onclick="movePage(${currentItem.comment_id}, ${current_category})">
        <div> 
          <img class="imgstyle cardstyle" 
             src="${currentItem.photo_address}" alt="">
        </div>
      </div>
    `;
    } else if (data_lst_id[i] !== undefined && Number(current_category) === 0) {
      let currentItem = data_lst[i];
      let isCurrent = currentItem.comment_id === current_category_num;
      let cardClass = isCurrent ? "card current" : "card";

      sub_post.innerHTML += `
      <div class="${cardClass}" 
        onclick="movePage(${currentItem.comment_id},0)">
        <div> 
          <img class="imgstyle cardstyle" 
             src="${currentItem.photo_address}" alt="">
        </div>
      </div>
    `;
    }
  }
});

function movePage(comment_id, category) {
  window.location.href = `/post?comment_id=${comment_id}&category=${category}`;
}

//이름 클릭 함수
function usermodal() {
  const content_userid_modal = document.querySelector(".content_userid_modal");

  if (check === 0) {
    //초기 상태
    content_userid_modal.style.display = "block";
    check = 1;
  } else if (check === 1) {
    //처음 클릭할때
    content_userid_modal.style.display = "none";
    check = 0;
  }
}

//이름 게시글 보기 클릭
function userpost(userid) {
  window.location.href = `/detailmain?user=${userid}&category_id=0`;
}
