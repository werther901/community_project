// 툴팁 토글
const info01 = document.querySelector('.info01');
const info_toolTip = document.querySelector('.info_toolTip');
const exit_btn = document.querySelector('.exit_btn');

const toolTipToggle = () => {
  if (info_toolTip.style.display == "none") {
    info_toolTip.style.display = "block";
  } else {
    info_toolTip.style.display = "none";
  }
  
}
info01.addEventListener('click', toolTipToggle);

// 툴팁 닫기
const toolTopExit = () => {
  info_toolTip.style.display = "none";
}
exit_btn.addEventListener('click', toolTopExit);