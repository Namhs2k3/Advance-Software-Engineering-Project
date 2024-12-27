import express from "express";
import { upload } from "../middleware/multer.js";
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getBannerBlogs,
  getHotBlogs,
  getBlogById,
  getLatestBlogs,
} from "../controllers/blog.controller.js";

const router = express.Router();

router.get("/bannerBlogs", getBannerBlogs);

router.get("/hotBlogs", getHotBlogs);

router.get("/latestBlogs", getLatestBlogs);

// Lấy tất cả blogs
router.get("/", getBlogs);

router.get("/:id", getBlogById);

// Tạo mới blog, sử dụng Multer để upload ảnh
router.post("/", upload.single("image"), createBlog);

// Cập nhật blog theo ID, có thể cập nhật ảnh nếu cần
router.put("/:id", upload.single("image"), updateBlog);

// Xóa blog theo ID
router.delete("/:id", deleteBlog);

export default router;
