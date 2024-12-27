import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

const UpdateBlog = ({ blog, onClose, onBlogUpdated }) => {
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.content);
  const [displayHot, setDisplayHot] = useState(blog.displayHot);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  // Hàm để xử lý khi thay đổi ảnh
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Gửi yêu cầu PUT để cập nhật bài blog
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || !displayHot) {
      setError("Title and Content are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("displayHot", displayHot);

    // Thêm ảnh mới vào formData nếu có, nếu không giữ ảnh cũ
    if (image) {
      formData.append("image", image);
    } else {
      formData.append("image", blog.image); // Giữ lại ảnh cũ nếu không có ảnh mới
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/blogs/${blog._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      onBlogUpdated(response.data.data);
      onClose();
    } catch (err) {
      setError("Failed to update blog. Please try again.");
    }
  };

  const displayImage = image ? (
    <img
      src={URL.createObjectURL(image)}
      alt="Preview"
      className="mx-auto w-3/4 h-32 object-cover"
    />
  ) : (
    blog.image && (
      <img
        src={blog.image}
        alt="Blog"
        className="mx-auto w-3/4 h-32 object-cover"
      />
    )
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="w-full max-w-7xl rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-center text-4xl font-bold">Chỉnh sửa bài viết</h2>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Tiêu đề và ảnh */}
            <div>
              <div className="mb-4 mt-1">
                <label className="mb-2 block text-xl font-medium text-gray-700">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              <div className="w-1/2">
                <label className="block pb-2 text-xl font-medium">
                  Đặt làm Hot
                </label>
                <select
                  value={displayHot}
                  onChange={(e) => setDisplayHot(e.target.value)}
                  className="h-12 w-1/2 rounded-md border border-gray-300 p-2"
                >
                  <option value={1}>Hot</option>
                  <option value={2}>Không Hot</option>
                </select>
              </div>

              {/* Ảnh hiển thị bên dưới ô chọn tệp */}
              <div className="mb-4 mt-1">
                <label className="mb-2 block text-xl font-medium text-gray-700">
                  Ảnh bài viết
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="w-full rounded-md border border-gray-300 p-2"
                />
              </div>

              {/* Hiển thị ảnh đã chọn hoặc ảnh cũ */}
              <div className="mb-4 mt-2">{displayImage}</div>
            </div>

            {/* Nội dung */}
            <div>
              <label className="mb-2 block text-xl font-medium text-gray-700">
                Nội dung
              </label>
              <ReactQuill
                value={content}
                onChange={setContent}
                style={{
                  height: "300px",
                  resize: "both",
                  overflow: "hidden",
                  maxWidth: "100%",
                  maxHeight: "480px",
                }}
                className="w-full rounded-md border border-gray-300"
              />
            </div>
          </div>

          <div className="flex justify-center space-x-40">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateBlog;
