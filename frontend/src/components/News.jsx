import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../components/website/Loading";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${day} Th${parseInt(month)}`;
};

const News = () => {
  const [newsData, setNewsData] = useState([]); // State để lưu trữ dữ liệu blog từ API
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const itemsPerPage = 8; // Số lượng tin tức trên mỗi trang

  useEffect(() => {
    // Hàm để gọi API lấy dữ liệu blogs
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/blogs"); // API lấy blogs
        setNewsData(response.data.data); // Lưu dữ liệu vào state
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs(); // Gọi API khi component mount
  }, []);

  // Tính toán số trang
  const totalPages = Math.ceil(newsData.length / itemsPerPage);

  // Dữ liệu tin tức hiển thị trên trang hiện tại
  const currentNews = newsData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="container mx-auto px-4">
      <div className="text-center">
        {/* Phần hiển thị tiêu đề tin tức */}
        <h1 className="mb-16 mt-10 text-4xl font-bold text-[#633402]">
          Tin tức Bamos<span className="text-[#C63402]">Coffee</span>
        </h1>
      </div>
      {loading ? (
        // Hiển thị phần loading nếu dữ liệu chưa được tải
        <div className="flex h-[255px] w-full items-center justify-center lg:h-[400px]">
          <Loading /> {/* Hiển thị Loading khi đang tải dữ liệu */}
        </div>
      ) : (
        <>
          {/* Hiển thị tin tức */}
          <div className="grid grid-cols-1 justify-items-center gap-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
            {currentNews.map((blog) => (
              <div
                key={blog._id}
                className="mb-4 flex h-[280px] w-[300px] transform flex-col overflow-hidden rounded-lg border border-[#e0e0e0] bg-white shadow-lg transition-all duration-200 hover:scale-105"
                onClick={() => navigate(`/blogs/${blog._id}`)}
                style={{ cursor: "pointer" }}
              >
                {/* Phần trên: Ảnh bài viết */}
                <div className="relative h-[179px] w-full overflow-hidden bg-[#f0f0f0]">
                  <div className="absolute left-2 top-2 flex h-[55px] w-[55px] flex-col items-center justify-center rounded-full bg-[#d88453] text-xs font-bold text-white shadow-md">
                    <span className="text-sm">
                      {formatDate(blog.updatedAt).split(" ")[0]}
                    </span>
                    <span className="text-sm">
                      {formatDate(blog.updatedAt).split(" ")[1]}
                    </span>
                  </div>

                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Phần dưới: Tiêu đề và đoạn trích */}
                <div className="p-2 text-center">
                  <h2 className="mb-2 text-lg font-bold text-[#633402]">
                    {blog.title.length > 50
                      ? `${blog.title.slice(0, 50)}...`
                      : blog.title}
                  </h2>
                  <p
                    className="pb-2 text-sm text-[#555]"
                    dangerouslySetInnerHTML={{
                      __html:
                        blog.content.length > 50
                          ? `${blog.content.slice(0, 40)}...`
                          : blog.content,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Hiển thị các nút phân trang */}
          <div className="mt-2 flex justify-center mb-12">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={`mx-1 rounded-md px-4 py-2 ${
                  currentPage === index + 1
                    ? "bg-[#633c02] text-white"
                    : "bg-[#e0e0e0] text-black"
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default News;
