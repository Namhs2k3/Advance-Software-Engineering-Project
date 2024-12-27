import Blog from "../models/blog.model.js";
import mongoose from "mongoose";

export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();

    const blogsWithFullImagePath = blogs.map((blog) => ({
      ...blog.toObject(),
      image: `http://localhost:5000/assets/${blog.image}`,
    }));

    res.status(200).json({
      success: true,
      data: blogsWithFullImagePath,
    });
  } catch (error) {
    console.error("Error in fetching blogs:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getBlogById = async (req, res) => {
  const { id } = req.params;

  // Kiểm tra ID có hợp lệ không
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Blog ID" });
  }

  try {
    // Tìm blog theo ID
    const blog = await Blog.findById(id);

    // Nếu không tìm thấy blog
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    // Thêm đường dẫn đầy đủ cho ảnh
    const blogWithFullImagePath = {
      ...blog.toObject(),
      image: `http://localhost:5000/assets/${blog.image}`,
    };

    res.status(200).json({
      success: true,
      data: blogWithFullImagePath,
    });
  } catch (error) {
    console.error("Error in fetching blog by ID:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, content, displayHot, displayBanner } = req.body;

    // Kiểm tra title và content
    if (!title || !content) {
      return res
        .status(400)
        .json({ success: false, message: "Title and content are required" });
    }

    // Kiểm tra nếu không có ảnh
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }

    const imagePath = req.file.filename;

    const newBlog = new Blog({
      image: imagePath,
      title,
      content,
      displayHot,
      displayBanner,
    });

    await newBlog.save();
    const blogWithImage = {
      ...newBlog.toObject(),
      image: `http://localhost:5000/assets/${newBlog.image}`,
    };

    res.status(201).json({
      success: true,
      data: blogWithImage,
    });
  } catch (error) {
    console.error("Error in creating blog:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content, displayHot, displayBanner } = req.body;

  // Kiểm tra ID hợp lệ
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Blog ID" });
  }

  try {
    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    let updatedImagePath = existingBlog.image;
    if (req.file) {
      updatedImagePath = req.file.filename;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, content, image: updatedImagePath, displayHot, displayBanner },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: {
        ...updatedBlog.toObject(),
        image: updatedBlog.image
          ? `http://localhost:5000/assets/${updatedBlog.image}`
          : null,
      },
    });
  } catch (error) {
    console.error("Error in updating blog:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteBlog = async (req, res) => {
  const { id } = req.params;

  // Kiểm tra ID hợp lệ
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Blog ID" });
  }

  try {
    // Tìm và xóa blog theo ID
    const deletedBlog = await Blog.findByIdAndDelete(id);

    // Nếu blog không tồn tại
    if (!deletedBlog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    // Trả về thông báo thành công sau khi xóa
    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleting blog:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getHotBlogs = async (req, res) => {
  try {
    // Lấy tối đa 3 bài viết có displayHot: 1
    const hotBlogs = await Blog.find({ displayHot: 1 }).sort({ updatedAt: -1 });

    // Thêm đường dẫn đầy đủ cho ảnh
    const blogsWithFullImagePath = hotBlogs.map((blog) => ({
      ...blog.toObject(),
      image: `http://localhost:5000/assets/${blog.image}`,
    }));

    res.status(200).json({
      success: true,
      data: blogsWithFullImagePath,
    });
  } catch (error) {
    console.error("Error in fetching hot blogs:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getBannerBlogs = async (req, res) => {
  try {
    // Lấy các bài blog có displayBanner: 1
    const bannerBlogs = await Blog.find({ displayBanner: 1 });

    // Chỉ lấy image và title, đồng thời thêm đường dẫn đầy đủ cho ảnh
    const bannerBlogsWithImagePath = bannerBlogs.map((blog) => ({
      _id: blog._id,
      image: `http://localhost:5000/assets/${blog.image}`,
      title: blog.title,
    }));

    res.status(200).json({
      success: true,
      data: bannerBlogsWithImagePath,
    });
  } catch (error) {
    console.error("Error in fetching banner blogs:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getLatestBlogs = async (req, res) => {
  try {
    // Lấy 5 blog mới nhất (sắp xếp theo createdAt giảm dần)
    const latestBlogs = await Blog.find()
      .sort({ createdAt: -1 }) // Sắp xếp giảm dần theo createdAt
      .limit(4) // Lấy tối đa 4 blog
      .select("title");

    res.status(200).json({
      success: true,
      data: latestBlogs,
    });
  } catch (error) {
    console.error("Error in fetching latest blogs:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
