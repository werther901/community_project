// 로드 시 쿠키 읽기('아이디 저장')
window.addEventListener("DOMContentLoaded", function () {
  const idCookie = getCookie("id");

  if (!idCookie) {
    return;
  }
  const id = document.getElementById("id");

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

const IdDelete = () => {
  id.value.trim() !== "" ? id_clear.style.display = 'block' : id_clear.style.display = 'none';
}

const PwDelete = () => {
  if ( password.value.trim() !== "" ) {
    pw_clear.style.display = 'block';
  } else {
    pw_clear.style.display = 'none';
  }
} 
id.addEventListener('input', IdDelete);
password.addEventListener('input', PwDelete);

// 'x' 아이콘 클릭 시 input 값 삭제
const deleteId = () => {
  id.value = '';
  id_clear.style.display = 'none';
}
const deletePw = () => {
  password.value = '';
  pw_clear.style.display = 'none';
}
id_clear.addEventListener('click', deleteId);
pw_clear.addEventListener('click', deletePw);


// <---------------기능----------------->

// 로그인
const content01 = document.querySelector(".content01");
const content02 = document.querySelector(".content02");
const saveId = document.getElementById("saveId");

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
    login();
  }
}
id.addEventListener('keydown', EnterKeyDown);
password.addEventListener('keydown', EnterKeyDown);

// 네이버 로그인
// var naver_id_login = new naver_id_login("Ck5wKX1f6oVy4LIJ8Etp", "http://localhost:3000/naver_login");
// var state = naver_id_login.getUniqState();
// naver_id_login.setButton("white", 2, 40);
// naver_id_login.setDomain("http://localhost:3000/login");
// naver_id_login.setState(state);
// naver_id_login.setPopup();
// naver_id_login.init_naver_id_login();

// // 가상버튼 누르면 네이버 로그인 버튼누르기
// const naverLoginCostom = document.getElementById('naverLoginCostom');

// naverLoginCostom.addEventListener('click', function() {
//   const naver_login = document.querySelector('#naver_id_login a');
//   naver_login.click();
// })

// 네이버 로그인(최신;250310)
/* (3) 네아로 설정 정보 및 초기화 */
// window.name = "opener";
// var naverLogin = new naver.LoginWithNaverId({
//   clientId: "Ck5wKX1f6oVy4LIJ8Etp",
//   callbackUrl: "http://localhost:3000/naver_login",
//   isPopup: true,
//   loginButton: { color: "green", type: 3, height: 60 }
// });

// /* (4) 네아로 로그인 정보를 초기화하기 위하여 init을 호출 */
// naverLogin.init();

// /* (4-1) 임의의 링크를 설정해줄 필요가 있는 경우 */
// $("#gnbLogin").attr("href", naverLogin.generateAuthorizeUrl());

// /* (5) 현재 로그인 상태를 확인 */
// window.addEventListener("load", function () {
//   naverLogin.getLoginStatus(function (status) {
//     if (status) {
//       /* (6) 로그인 상태가 "true" 인 경우 로그인 버튼을 없애고 사용자 정보를 출력합니다. */
//       setLoginStatus();
//     }
//   });
// });

// /* (6) 로그인 상태가 "true" 인 경우 로그인 버튼을 없애고 사용자 정보를 출력합니다. */
// function setLoginStatus() {
//   let profileImage = naverLogin.user.getProfileImage();
//   let email = naverLogin.user.getEmail();
//   let birthYear = naverLogin.user.getBirthyear();
//   let birthDay = naverLogin.user.getBirthday();
//   let mobile = naverLogin.user.getMobile();
//   let name = naverLogin.user.getName();
//   let gender = naverLogin.user.getGender();

//   console.log(profileImage, email, birthYear, birthDay, mobile, name, gender);
//   // var imageViewer = "";
//   // if (profileImage) {
//   //   imageViewer += '<br><br><img src="' + profileImage + '" height=50 /> <p>';
//   // }
//   // $("#naverIdLogin_loginButton").html(imageViewer + nickName + "님 반갑습니다.</p>");
//   // $("#gnbLogin").html("Logout");
//   // $("#gnbLogin").attr("href", "#");
//   // /* (7) 로그아웃 버튼을 설정하고 동작을 정의합니다. */
//   // $("#gnbLogin").click(function (e) {
//   //   e.preventDefault();
//   //   naverLogin.logout();
//   //   location.replace("/oauth/sample/javascript_sample.html");
//   // });
// }