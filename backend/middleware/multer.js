import multer from "multer";
// Cấu hình Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "backend/assets/");
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    cb(null, originalName);
  },
});

// Kiểm tra file ảnh
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and JPG files are allowed!"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
});
