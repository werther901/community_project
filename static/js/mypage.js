// --------------css 관련 ----------------
// 툴팁 토글
const info01 = document.querySelector(".info01");
const info_toolTip = document.querySelector(".info_toolTip");
const exit_btn = document.querySelector(".exit_btn");

//주소 input
const input_A = document.getElementById("input_A");

const toolTipToggle = () => {
  if (info_toolTip.style.display == "none") {
    info_toolTip.style.display = "block";
  } else {
    info_toolTip.style.display = "none";
  }
};
info01.addEventListener("click", toolTipToggle);

// 툴팁 닫기
const toolTopExit = () => {
  info_toolTip.style.display = "none";
};
exit_btn.addEventListener("click", toolTopExit);

// --------------기능 관련 ----------------

// 사용자 검증
(async function () {
  // const info = document.querySelector(".welcome");
  const name_text = document.querySelector(".name_text");
  const email_text = document.querySelector(".email_text");

  try {
    // 쿠키에서 토큰 추출하기
    // 브라우저에는 쿠키가 하나의 문자열로 관리되고 ';'를 기준으로 여러개 저장되기 때문에 token만 뽑으려고 split(";")하는 것
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((item) =>
      item.trim().startsWith("token=")
    );

    if (!tokenCookie) {
      // 토큰이 없으면 '로그인이 필요한 서비스입니다' 후 메인페이지 이동
      alert("로그인이 필요한 서비스입니다.");
      window.location.href = "http://localhost:3000";
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
      console.log(res.data);
      name_text.textContent = res.data.name;
      email_text.textContent = res.data.email;
    }
  } catch (error) {
    console.error("Authentication error:", error);
    alert("로그인 인증 시간이 만료 되었습니다. 다시 로그인 해주세요.");
    window.location.replace("/login");
  }
})();

input_A.addEventListener("click", function (e) {
  e.preventDefault();
  //카카오 주소 api
  new daum.Postcode({
    oncomplete: function (data) {
      // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분입니다.
      // 예제를 참고하여 다양한 활용법을 확인해 보세요.
      //console.log("address", data.address);
      input_A.value = data.address;
    },
  }).open();
});
