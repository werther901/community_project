// --------------css 관련 ----------------
// 툴팁 토글
const info01 = document.querySelector(".info01");
const info_toolTip = document.querySelector(".info_toolTip");
const exit_btn = document.querySelector(".exit_btn");

//주소 input
const address = document.getElementById("address");

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

address.addEventListener("click", function (e) {
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

// 전화번호 max length입력 시 다음 input 이동
const movePhoneInput = (num) => {
  if (num === 1 && phoneNum_01.value.length === 3) {
    phoneNum_02.focus();
  } else if (num === 2 && phoneNum_02.value.length === 4) {
    phoneNum_03.focus();
  }
};

// 내 정보 수정
let nowPwValue = false;
let newPwValue = false;
let newCheckPwValue = false;
let addressValue = false;
let phoneValue = false;

const now_password = document.getElementById("now_password");
const new_password = document.getElementById("new_password");
const new_password_check = document.getElementById("new_password_check");

const phoneNum_01 = document.getElementById("phoneNum_01");
const phoneNum_02 = document.getElementById("phoneNum_02");
const phoneNum_03 = document.getElementById("phoneNum_03");
const edit_btn = document.querySelector(".edit_btn");
const content01 = document.querySelector(".content01");

// '수정하기' 클릭 -> 유효성 검증 -> 통과되면 axios요청
const edit_info = (e) => {
  e.preventDefault();

  // 유효성 검증
  // 1. 비밀번호 변경 시 포맷 검증
  if (new_password.value !== "" && new_password_check.value !== "") {
    if (new_password.value !== new_password_check.value) {
      content01.innerHTML = `비밀번호 일치여부를 확인해주세요.`;
      return;
    } else {
      content01.innerHTML = "";
      valuePW(new_password.value);
    }
  } else if (new_password.value !== "" || new_password_check.value !== "") {
    content01.innerHTML = `비밀번호 입력을 확인해주세요.`;
    return;
  } else {
    content01.innerHTML = "";
  }

  // 2. 주소 변경 시
  let addressEdit = "";

  if (address.value == "") {
    addressEdit = "";
  }

  // 3. 전화번호
  if (
    phoneNum_01.value !== "" &&
    phoneNum_02.value !== "" &&
    phoneNum_03.value !== ""
  ) {
    console.log("다 안비어잇음");
    const phone = `${phoneNum_01.value}-${phoneNum_02.value}-${phoneNum_03.value}`;
    valuePhone(phone);
    console.log("성공");
    return phone;
  } else {
    console.log("한 군데는 비어있다");
    return;
  }

  // const check = confirm(``);
  // if (check) {
  //   // axios 보내긩
  // }

  // 현재비번은 무조건 서버로 보내서 현재 비밀번호와 같으면 같은 비밀번호 안된다고 return
  // const res = axios.put(
  //   "",
  //   {

  //   }
  // )
};
edit_btn.addEventListener("click", edit_info);

// 비번 유효성(정규식)
const valuePW = (pw) => {
  // let inspectPassWord = "Abcd123!";
  const regex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]{8,}$/;
  if (regex.test(pw)) {
    content01.innerHTML = "";
  } else {
    content01.innerHTML = `<div>비밀번호는 특수문자 1자, 영어 대소문자 각 1자 포함 8자 이상이어야 합니다.</div>`;
    return;
  }
};

// 휴대전화번호 유효성(정규식)
const valuePhone = (phoneNumber) => {
  const regex = /^01[0-9]\d{3,4}\d{4}$/;
  const regex02 = /^01[0-9]-\d{3,4}-\d{4}$/;

  if (regex.test(phoneNumber) || regex02.test(phoneNumber)) {
    content01.innerHTML = "";
    return phoneNumber;
  } else {
    content01.innerHTML = `<div>휴대전화번호가 정확한지 확인해 주세요.</div>`;
    return;
  }
};
