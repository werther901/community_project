//변수 선언 - dom
const write_form = document.forms["write_form"];
const category = write_form.category;
const input_img = write_form.userfile;
const input_title = write_form.input_title;
const preview_image = document.getElementById("preview_image");

//카테고리 select > option
axios({
  method: "post",
  url: "/write/categroy",
})
  .then((res) => {
    console.log("Res", res.data.category);
    let cate = res.data.category; //카테고리 배열
    cate.map((item) => {
      category.innerHTML += `<option value="${item.category_id}">${item.name}</option>`;
    });
  })
  .catch((e) => {
    console.log("error : ", e);
  });

// toast ui editor
const editor = new window.toastui.Editor({
  el: document.querySelector("#editor"),
  previewStyle: "vertical",
  height: "400px",
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
  console.log("fom_submit click");
  console.log("imgsrc", input_img.files[0]);

  /*
  1.파일 이미지 경로, select option값, 제목, 내용을 data에 담기
  2. axios요청을 보내 DB에 저장하기 
  */

  const formData = new FormData();
  formData.append("title", input_title.value);
  formData.append("category", category.value);
  formData.append("comment", editor.getMarkdown());
  formData.append("imgsrc", input_img.files[0]);

  // console.log(
  //   "form",
  //   input_title.value,
  //   category.value,
  //   editor.getMarkdown(),
  //   input_img.files[0]
  // );

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
}
