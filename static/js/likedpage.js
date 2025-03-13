

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
      // 토큰이 없으면 '로그인이 필요한 서비스입니다' 후 메인페이지 이동
      alert('로그인이 필요한 서비스입니다.');
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
    
    // 검증된 사용자를 다시 axios요청해서 해당 사용자가 좋아요 한 글의 데이터만 받아서 테이블로 만들기 
    if (res.data.result) {
      console.log(res.data.id);

      const res_02 = await axios.post(
        "/mypage/user_liked", 
        {
          id: res.data.id
        }
      )
      console.log(res_02.data);

      const inputData = document.querySelector('.inputData');

      const tableData = res_02.data.map((x) => {
        console.log(x.write.User);
        console.log(x.write.User.name)
        // return x.write.User;
        return `<tr class="tbody_data">
                <td>${x.write.comment_id}</td>
                <td class="cont_title">
                  <a href="/post?comment_id=${x.write.comment_id}&category=0">${x.write.title}</a>
                </td>
                <td>${x.write.User.name}</td>
                <td>작성날짜</td>
                <td>조회수</td>
              </tr>`
      });
      console.log(tableData);
      inputData.innerHTML = tableData.join("")
    }
    
  } catch (error) {
    console.error("Authentication error:", error);
    alert('로그인 인증 시간이 만료 되었습니다. 다시 로그인 해주세요.');
    window.location.replace("/login");
  }
})();