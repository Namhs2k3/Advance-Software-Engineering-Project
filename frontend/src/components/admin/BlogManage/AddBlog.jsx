import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

const AddBlog = ({ onClose, onBlogAdded }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [displayHot, setDisplayHot] = useState(1);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || !image || !displayHot) {
      setError("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);
    formData.append("displayHot", displayHot);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/blogs",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      onBlogAdded(response.data.data); // Cập nhật danh sách blog sau khi thêm thành công
      onClose();
    } catch (err) {
      setError("Failed to add blog. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="w-full max-w-7xl rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-center text-4xl font-bold">Tạo bài viết</h2>
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Phần Tiêu đề và Ảnh */}
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
                  required
                />
              </div>
              <div className="w-1/2">
                <label className="block pb-2 text-xl font-medium">
                  Đặt làm Hot
                </label>
                <select
                  value={displayHot}
                  onChange={(e) => setDisplayHot(+e.target.value)}
                  className="h-12 w-1/2 rounded-md border border-gray-300 p-2"
                >
                  <option value={1}>Hot</option>
                  <option value={2}>Không Hot</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-xl font-medium text-gray-700">
                  Ảnh bài viết
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                  required
                />
              </div>
            </div>
            {/* Phần Content (Quill) */}
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
              className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Tạo bài viết
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;
