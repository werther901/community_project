//변수 선언 - dom
const container_category = document.querySelector(".container_category");
const header_menu = document.querySelector(".header_menu");
const today_main = document.querySelector(".today_main");
const today_sub = document.querySelector(".today_sub");
const main_cards = document.querySelector(".main_cards");
//버튼 클릭 확인용
let menu_chk = true;

//header - table 생성성
function createTable() {
  header_menu.innerHTML = `
            <div class="header_menu_container">
                <div class="header_menu_header"></div>
                <div class="header_menu_row">
                    <div class="header_menu_item"  onclick="categoryMove('all')">전체게시판</div>
                    <div class="header_menu_item">서울</div>
                    <div class="header_menu_item">정치</div>
                    <div class="header_menu_item">보드게임</div>
                    <div class="header_menu_item">헬스</div>
                </div>
                <div class="header_menu_row">
                    <div class="header_menu_item">자유게시판</div>
                    <div class="header_menu_item">경기도</div>
                    <div class="header_menu_item">경제</div>
                    <div class="header_menu_item">스팀</div>
                    <div class="header_menu_item">수영</div>
                </div>
                <div class="header_menu_row">
                    <div class="header_menu_item"></div>
                    <div class="header_menu_item">경상도</div>
                    <div class="header_menu_item">사회</div>
                    <div class="header_menu_item">오리진</div>
                    <div class="header_menu_item">필라테스</div>
                </div>
                <div class="header_menu_row">
                    <div class="header_menu_item"></div>
                    <div class="header_menu_item">충청도</div>
                    <div class="header_menu_item">과학</div>
                    <div class="header_menu_item">닌텐도</div>
                    <div class="header_menu_item">골프</div>
                </div>
                <div class="header_menu_row">
                    <div class="header_menu_item"></div>
                    <div class="header_menu_item">전라도</div>
                    <div class="header_menu_item">국제</div>
                    <div class="header_menu_item">기타</div>
                    <div class="header_menu_item">사격</div>
                </div>
              
                <!-- 마이페이지 & 고객센터 -->
                <div class="header_menu_footer">
                    <div class="my_page" onclick="mypage()">마이페이지</div>
                    <div class="header_menu_footer_links">
                        <div>고객센터</div>
                        <div>Gather 이용안내</div>
                    </div>
                </div>
            </div>
            
            `;
}

//window 실행 시
window.onload = function () {
  //카테고리 표시
  axios({
    method: "post",
    url: "/category",
  })
    .then((res) => {
      console.log("Res", res.data.category);
      let category = res.data.category;

      //header_menu
      window.menubar = function () {
        if (menu_chk === true) {
          header_menu.style.display = "block";
          // header_menu 내용 생성
          createTable();
          const header_menu_header = document.querySelector(
            ".header_menu_header"
          );
          // 카테고리 넣기
          category.map((item) => {
            header_menu_header.innerHTML += `
                <div class="header_menu_header_item" onclick="categoryMove(${item.category_id})">${item.name}</div>`;
          });

          menu_chk = false;
        } else {
          header_menu.style.display = "none";
          menu_chk = true;
        }
      };
    })
    .catch((e) => {
      console.log("error", e);
    });

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
  window.location.href = "/detailmain?category_id=all";
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

// 카테고리 상세 페이지 이동
function categoryMove(categoryid) {
  if (categoryid === "all") {
    window.location.href = `/detailmain?category_id=all`;
  } else {
    window.location.href = `/detailmain?category_id=${categoryid}`;
  }
}

function mypage() {
  window.location.href = "/mypage";
}

// 로그아웃
const content01 = document.querySelector(".content01");
const logoutFunc = () => {
  // 쿠키 삭제
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  // 페이지 새로고침
  window.location.reload();
};

// 250306 사용자 검증
(async function () {
  const info = document.querySelector(".welcome");

  try {
    // 쿠키에서 토큰 추출하기
    // 브라우저에는 쿠키가 하나의 문자열로 관리되고 ';'를 기준으로 여러개 저장되기 때문에 token만 뽑으려고 split(";")하는 것
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((item) =>
      item.trim().startsWith("token=")
    );

    let data = "";

    if (!tokenCookie) {
      // 토큰이 없으면 로그인 링크 표시
      data = `<a href="/login" class="login">로그인</a>
        <a href="/signup" class="signup" >회원가입</a>`;

      info.innerHTML = data;
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
      data = `
        <div><strong>${res.data.name}</strong>님 환영합니다.</div>
        <button onClick='logoutFunc()'>로그아웃</button>`;
    }

    info.innerHTML = data;
  } catch (error) {
    console.error("Authentication error:", error);
    alert("로그인 인증 시간이 만료 되었습니다. 다시 로그인 해주세요.");
    info.innerHTML = `<a href="/login" class="login">로그인</a>
        <a href="/signup" class="signup" >회원가입</a>`;
    window.location.replace("/login");
  }
})();

//최신글 더보기 클릭
function main_moreview(id) {
  window.location.href = `/post?comment_id=${id}&category=0`;
}

//최신글 클릭 - sub
function sub_moreview(id) {
  window.location.href = `/post?comment_id=${id}&category=0`;
}

//logo 클릭
function main_reload() {
  window.location.reload();
}

//맛집 베스트 이야기 페이지 이동
function postMove(id) {
  window.location.href = `/post?comment_id=${id}&category=0`;
}
