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

// 카테고리 상세 페이지 이동
function categoryMove(categoryid) {
  if (categoryid === "all") {
    window.location.href = `/detilmain?category_id=all`;
  } else {
    window.location.href = `/detilmain?category_id=${categoryid}`;
  }
}

// 250306 임시 로그아웃 기능
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
      data = '<a href="/login">로그인</a>';
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
        <span><strong>${res.data.name}</strong>님 환영합니다.</span>
        <button onClick='logoutFunc()'>로그아웃</button>`;
    }

    info.innerHTML = data;
  } catch (error) {
    console.error("Authentication error:", error);
    info.innerHTML =
      '<span>인증 오류가 발생했습니다</span>';
  }
})();

