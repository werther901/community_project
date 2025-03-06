let emailVaule = false;
let pwValue = false;
let pwCheckValue = false;
let nameValue = false;
let phoneValue = false;
let addressValue = false; // 임시
let birthValue = false;

// 유효성 검증 통과 시 회원가입 버튼 disabled
const saveData = document.querySelector(".saveData");

const ifTrue = () => {
  if (emailVaule && pwValue && pwCheckValue && nameValue && phoneValue && addressValue && birthValue) {
    saveData.disabled = false;
  } else {
    saveData.disabled = true;
  }
};

// 이메일 중복검사
const email = document.getElementById("email");
const duplicateCheck = document.querySelector(".duplicateCheck");
const content01 = document.querySelector(".content01");

const valueEmail = async (e) => {
  const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;

  if (email.value == "") {
    content01.innerHTML = `<div>아이디 : 필수 정보입니다.</div>`;
    emailVaule = false;
    return ;
  } else if (pattern.test(email.value) == false) {
    content01.innerHTML = "<div>아이디 : 이메일 형식을 확인해주세요.</div>";
    emailVaule = false;
    return ;
  } else if (pattern.test(email.value) == true) {
    content01.innerHTML = "";
    // emailVaule = true;
  }

  await axios({
    method: 'get',
    url: '/idCheck',
    params: { userId: email.value }
  })
  .then((res) => {
    console.log(res.data);

    if (!res.data) {
      content01.innerHTML = `<div>아이디 : 중복된 이메일입니다.</div>`;
      emailVaule = false;
    } else {
      alert("사용 가능한 이메일 입니다.");
      content01.innerHTML = "";
      emailVaule = true;
    }
  })
  .catch((e) => {
    console.log("이메일 중복검사 실패 : ", e)
  });

  ifTrue();
};
duplicateCheck.addEventListener("click", valueEmail);

// 비밀번호 유효성 검증(특수문자 1개 이상, 영어 대소문자 각 1개 이상, 8자리 이상)
const password = document.getElementById("password");
const content02 = document.querySelector(".content02");
// console.log(password);

const valuePW = (e) => {
  let inspectPassWord = "Abcd123!";
  let regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z\d!@#$%^&*()]{8,}$/;

  if (regex.test(e.target.value)) {
    content02.innerHTML = "";
    pwValue = true;
  } else if (password.value == "") {
    console.log(password.value);
    content02.innerHTML = `<div>비밀번호 : 필수 정보입니다.</div>`;
    pwValue = false;
  } else {
    content02.innerHTML = `<div>비밀번호 : 특수문자 1자, 영어 대소문자 각 1자 포함 8자 이상이어야 합니다.</div>`;
    pwValue = false;
  }
  ifTrue();
};
password.addEventListener("input", valuePW);

// 비밀번호 확인
const passCheck = document.getElementById("passCheck");
const content03 = document.querySelector(".content03");

const valuePWCheck = (e) => {
  if (password.value == e.target.value) {
    content03.innerHTML = "";
    pwCheckValue = true;
  } else {
    content03.innerHTML = `<div>비밀번호가 일치하지 않습니다.</div>`;
    pwCheckValue = false;
  }
  ifTrue();
};
passCheck.addEventListener("input", valuePWCheck);

// 이름 작성여부 확인
const names = document.getElementById("name");
const content04 = document.querySelector(".content04");

const valueName = (e) => {
  if (e.target.value == "") {
    content04.innerHTML = `<div>이름 : 필수정보 입니다.</div>`;
    nameValue = false;
  } else {
    content04.innerHTML = "";
    nameValue = true;
  }
  ifTrue();
};
names.addEventListener("blur", valueName);

// 생년월일 작성여부 확인
const birth = document.getElementById('birth');
const content08 = document.querySelector('.content08');

const valueBirth = () => {
  const regBirth = /^(19[0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/;

  if (birth.value.trim() == "") {
    content08.innerHTML = `<div>생년월일 : 필수정보 입니다.</div>`
    birthValue = false;
  } else if (!regBirth.test(birth.value)) {
    content08.innerHTML = `<div>생년월일 : 생년월일은 8자리 숫자로 입력해 주세요.</div>`
    birthValue = false;
  } else {
    let formatBirth = birth.value.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1.$2.$3');
    birth.value = formatBirth;
    content08.innerHTML = "";
    birthValue = true;
  }
  ifTrue();
}
birth.addEventListener('blur', valueBirth);

// 주소 작성여부 확인
const address = document.getElementById('address');
const content07 = document.querySelector(".content07");

const valueAddress = () => {
  if (address.value == "") {
    content07.innerHTML = `<div>주소 : 필수정보 입니다.</div>`
    addressValue = false;
  } else {
    content07.innerHTML = "";
    addressValue = true;
  }
  ifTrue();
}
address.addEventListener('blur', valueAddress);

// 휴대전화번호 유효성 검증
const content05 = document.querySelector(".content05");
const phone = document.getElementById("phone");

const valuePhone = (e) => {
  // let phoneNumber = "01028232322";
  let regex = /^01[0-9]\d{3,4}\d{4}$/;
  const regex02 = /^01[0-9]-\d{3,4}-\d{4}$/;

  if (regex.test(e.target.value)) {

    if (e.target.value.length == 10) {
      let formatPhone = e.target.value.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
      e.target.value = formatPhone;
    } else if (e.target.value.length == 11) {
      let formatPhone = e.target.value.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
      e.target.value = formatPhone;
    }

    content05.innerHTML = "";
    phoneValue = true;
  } else if (regex02.test(e.target.value)) {
    content05.innerHTML = "";
    phoneValue = true;
  } else if (e.target.value == "") {
    content05.innerHTML = `<div>휴대전화번호 : 휴대전화번호는 필수 정보 입니다.</div>`;
    phoneValue = false;
  } else {
    content05.innerHTML = `<div>휴대전화번호 : 휴대전화번호가 정확한지 확인해 주세요.</div>`;
    phoneValue = false;
  }
  ifTrue();
};
phone.addEventListener("blur", valuePhone);


// 회원가입 요청 전송
const content06 = document.querySelector(".content06");

const signup = () => {
  // 성별 체크 여부
  const genderChecked = document.querySelector('input[name=gender]:checked');

  if (!genderChecked) {
    content06.innerHTML = `<div>성별 : 성별을 선택해주세요.</div>`
    return;
  }
  console.log(genderChecked.value);

  // 생년월일 변환
  let dateBirth = birth.value.replaceAll('.', '-');

  axios
    .post("/signup", { 
      userId : email.value,
      password: password.value,
      name: names.value,
      address: address.value,
      phoneNumber: phone.value,
      gender: genderChecked.value,
      birth: dateBirth
    })
    .then((res) => {
      console.log(res);

      if (res.data.result) {
        // 회원가입 성공
        alert(res.data.message);
        window.location.href = "/login";
      } else {
        // 회원가입 실패
        alert(res.data.message);
      }
    })
    .catch((err) => {
      console.error("회원가입 실패", err);
      alert("회원가입 실패");
    });
};
saveData.addEventListener('click', signup);