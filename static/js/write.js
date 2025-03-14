//변수 선언 - dom
const write_form = document.forms["write_form"];
const category = write_form.category;
const input_img = write_form.userfile;
const input_title = write_form.input_title;
const preview_image = document.getElementById("preview_image");

let username = "";
let comment_data_comment = ""; //db저장용 toast ui editor
//url
const url = new URL(window.location.href);
const urlParams = url.searchParams;
//console.log("urlSearch", urlParams.get("comment_id")); //10

// toast ui editor
const editor = new window.toastui.Editor({
  el: document.querySelector("#editor"),
  previewStyle: "vertical",
  height: "400px",
  initialValue: "",
});

if (urlParams.get("comment_id")) {
  //쿼리 스트링이 존재하는 경우 - 수정버튼으로 들어온 경우
  axios({
    method: "post",
    url: "/write/modify",
    data: { posturl: urlParams.get("comment_id") },
  })
    .then((res) => {
      console.log("res", res.data.user);
      let comment_data = res.data.user;
      input_title.value = comment_data.title;
      preview_image.innerHTML = `<div class="preview"><img class="image_style" src="${res.data.user.photo_address}" /></div>`;
      // toast ui editor
      editor.setMarkdown(comment_data.comment);
      comment_data_comment = comment_data.comment;
    })
    .catch((e) => {
      console.log("error : ", e);
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
      alert("토큰이 없습니다");
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
    //console.log("Res.data", res.data);
    if (res.data.result) {
      username = res.data.id;
    }
  } catch (error) {
    console.error("Authentication error:", error);
  }
})();

//카테고리 select > option
axios({
  method: "post",
  url: "/write/categroy",
})
  .then((res) => {
    //console.log("Res", res.data.category);
    let cate = res.data.category; //카테고리 배열
    cate.map((item) => {
      category.innerHTML += `<option value="${item.category_id}">${item.name}</option>`;
    });
  })
  .catch((e) => {
    console.log("error : ", e);
  });

//이미지 선택 버튼
const readURL = (input) => {
  const selectedFile = input.files[0];

  console.log("imgsrc", input.files[0]);
  const reader = new FileReader(); // FileReader 객체 생성

  reader.onload = function () {
    // FileReader 로드 이벤트 핸들러 등록
    preview_image.innerHTML = `<div class="preview"><img class="image_style" src="${reader.result}" /></div>`;
    //console.log("read", reader.result);
  };

  reader.readAsDataURL(selectedFile); // FileReader로 선택된 파일 읽기
};

//등록 버튼 클릭
function form_submit() {
  //console.log("fom_submit click");
  console.log("imgsrc", input_img.files[0]);

  /*
  1.파일 이미지 경로, select option값, 제목, 내용을 data에 담기
  2. axios요청을 보내 DB에 저장하기 
  - axios로 현재 로그인 되어 있는 id 값 가져오기
  */

  const formData = new FormData();
  formData.append("userId", username);
  formData.append("title", input_title.value);
  formData.append("category", category.value);
  formData.append("comment", editor.getMarkdown());
  formData.append("imgsrc", input_img.files[0]);

  if (!urlParams.get("comment_id")) {
    //쿼리 스트링이 없는 경우
    axios({
      method: "post",
      url: "/write/createPost",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data", // 파일을 포함한 데이터 전송을 위한 헤더
      },
    })
      .then((res) => {
        console.log("Res", res);
        alert("등록하였습니다.");
        window.location.href = "/";
      })
      .catch((e) => {
        console.log("error : ", e);
      });
  } else {
    //쿼리 스트링이 있는 경우
    let formData = new FormData();
    formData.append("userId", username);
    formData.append("category", category.value);
    formData.append("title", input_title.value);
    formData.append("comment", editor.getMarkdown() || comment_data_comment);
    formData.append("comment_id", urlParams.get("comment_id"));
    formData.append("imgsrc", input_img.files[0]);
    //console.log("input_img.files[0]", input_img.files[0]);
    axios({
      method: "put",
      url: "/write/updateData",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data", // 파일을 포함한 데이터 전송을 위한 헤더
      },
    })
      .then((res) => {
        //console.log("put data", res);
        alert("수정이 완료 되었습니다.");
        //window.location.href = "/";
      })
      .catch((e) => {
        console.log("error : ", e);
      });
  }
}
