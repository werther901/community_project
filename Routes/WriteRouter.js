const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const writeController = require("../Controller/WriteContoller");

router.get("/", writeController.write);

router.post("/categroy", writeController.getCategory);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    //원본 파일명에서 확장자 추출
    const ext = path.extname(file.originalname);

    //파일명에 타이스탬프와 확장자를 포함시켜서 저장함
    cb(null, Date.now() + ext); //timestamp + 확장자
  },
});
let upload = multer({ storage: storage });

//등록 버튼 클릭
router.post("/createPost", upload.single("imgsrc"), writeController.getPost);

//수정 버튼 클릭 - 기존 데이터 불러옴
router.post("/modify", writeController.postmodify);
//수정 버튼 클릭 - 쿼리 스트링 있는 경우
router.put("/updateData", upload.single("imgsrc"), writeController.updateData);

// 파일 업로드 처리
router.post("/upload", upload.single("image"), (req, res) => {
  // 업로드된 파일의 경로
  console.log("upldo", req.file);
  const filePath = `/uploads/${req.file.filename}`;
  // 업로드된 파일 URL 반환
  res.json({ imageUrl: filePath });
});

module.exports = router;
