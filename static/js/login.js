// 로드 시 쿠키 읽기('아이디 저장')
window.addEventListener("DOMContentLoaded", function () {
  const id = document.getElementById("id");

  const idCookie = getCookie("id");

  if (!idCookie) {
    return;
  }
  id.value = idCookie;

  // 쿠키 가져오기
  function getCookie(name) {
    let cookies = document.cookie.split("; ");
    // console.log(cookies);
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].split("=");
      if (cookie[0] === name) {
        return decodeURIComponent(cookie[1]);
      }
    }
    return "";
  }
});

// <---------------css관련----------------->

const id = document.getElementById("id");
const password = document.getElementById("password");
const login_btn = document.querySelector(".login-btn");

// 아이디, 비밀번호 입력값이 일단 들어가면 로그인 버튼 'disabled' 해제
const openLogin = () => {
  if (id.value != "" && password.value != "") {
    login_btn.disabled = false;
  } else {
    login_btn.disabled = true;
  }
};
id.addEventListener("input", openLogin);
password.addEventListener("input", openLogin);

// id, pw에 input 값이 있을때 'x'아이콘 표시
const id_clear = document.getElementById('id_clear');
const pw_clear = document.getElementById('pw_clear');
const pw_hide = document.getElementById('pw_hide');

const IdDelete = () => {
  id.value.trim() !== "" ? id_clear.style.display = 'block' : id_clear.style.display = 'none';
}
id.addEventListener('input', IdDelete);

const PwDelete = () => {
  if ( password.value.trim() !== "" ) {
    // 'x'아이콘 표시
    pw_clear.style.display = 'block';
    // 'eye'아이콘 표시
    pw_hide.style.display = 'block';
  } else {
    pw_clear.style.display = 'none';
    pw_hide.style.display = 'none';
  }
} 
password.addEventListener('input', PwDelete);

// 'x' 아이콘 클릭 시 input 값 삭제
const deleteId = () => {
  id.value = '';
  id_clear.style.display = 'none';
}
id_clear.addEventListener('click', deleteId);

const deletePw = () => {
  password.value = '';
  pw_clear.style.display = 'none';
  pw_hide.style.display = 'none';
}
pw_clear.addEventListener('click', deletePw);

// 'eye' 아이콘 클릭 시 input 값 텍스트
const viewPw = () => {
  if ( password.type === "password" ) {
    password.type = "text";
    pw_hide.classList.remove('hide');
  } else {
    password.type = "password";
    pw_hide.classList.add('hide');
  }
}
pw_hide.addEventListener('click', viewPw);

// '아이디 저장' 클릭 시 버튼 활성화
const saveId = document.getElementById("saveId");

const saveIdActivate = () => {
  if (saveId.checked) {
    saveId.value = "on";
  } else {
    saveId.value = "off";
  }
}
saveId.addEventListener('click', saveIdActivate);


// <---------------기능----------------->

// 로그인
const content01 = document.querySelector(".content01");
const content02 = document.querySelector(".content02");

const login = (e) => {
  e.preventDefault();
  // if (id.value == '') {
  //   content01.innerHTML = `<div>아이디를 입력해주세요.</div>`;
  //   return;
  // }
  // if (password.value == '') {
  //   content02.innerHTML = `<div>비밀번호를 입력해주세요.</div>`;
  // }

  axios
    .post("/login", { id: id.value, pw: password.value })
    .then((res) => {
      if (res.data.result) {
        // '아이디 저장' 체크 시 쿠키에 아이디 저장
        if (saveId.checked) {
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 7);
          document.cookie = `id=${id.value}; expires=${expirationDate.toUTCString()}; path=/`;
        } else {
          document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        }
        // 토큰이 있으면 홈으로 이동
        window.location.href = "/";
      } else {
        alert(result.data.message);
      }
    })
    .catch((err) => {
      console.error("Login error:", err);
      alert("로그인에 실패했습니다");
    });
};
login_btn.addEventListener("click", login);

// Enter시 로그인
const EnterKeyDown = (e) => {
  if (e.keyCode === 13 && id.value.trim() !== "" && password.value.trim() !== "") {
    login(e);
  }
}
id.addEventListener('keydown', EnterKeyDown);
password.addEventListener('keydown', EnterKeyDown);

// 가상버튼 누르면 네이버 로그인 버튼누르기
const naverLoginCostom = document.getElementById('naverLoginCostom');

naverLoginCostom.addEventListener('click', function() {
  const naver_login = document.querySelector('#naverIdLogin a');
  naver_login.click();
})

// 네이버 로그인(250310 수정)
var naverLogin = new naver.LoginWithNaverId(
  {
    clientId: "Ck5wKX1f6oVy4LIJ8Etp",
    callbackUrl: "http://localhost:3000/naver_login",
    isPopup: true,
    loginButton: { color: "green", type: 3, height: 50 }
  }
);

naverLogin.init();

// 카카오 로그인
// KaKao.init('e95f2489046becded19c7e9c57932c61');
// console.log(Kakao.isInitialized());