import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import thư viện cookies
import { decodeJWT } from "../utils/jwtUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate(); // Hook để điều hướng

  const getToken = () => Cookies.get("jwtToken");

  const handleLoginClick = (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>
    const token = getToken(); // Lấy JWT token từ cookies
    if (token) {
      try {
        const decoded = decodeJWT(token); // Giải mã token
        // Điều hướng dựa trên vai trò người dùng
        if (decoded.role.includes("admin") || decoded.role.includes("staff")) {
          navigate("/admin");
        } else if (decoded.role.includes("customer")) {
          navigate("/customerprofile");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      // Nếu không có token, điều hướng đến trang login
      navigate("/login");
    }
  };

  const handleLogoutClick = async () => {
    try {
      // Gửi yêu cầu logout tới backend (xóa JWT cookie ở server)
      const response = await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true },
      );

      if (response.data.success) {
        // Xóa JWT token từ cookies ở frontend
        Cookies.remove("jwtToken");

        // Điều hướng đến trang login hoặc trang chính
        window.location.href = "/login";
        toast.success("Đăng xuất thành công!");
      }
    } catch (error) {
      toast.error("Lỗi đăng xuất:", error);
    }
  };

  const handleUserIconClick = () => {
    const token = getToken();
    if (!token) {
      navigate("/login"); // Điều hướng đến trang login nếu không có token
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        const token = getToken();
        if (token) setDropdownOpen(true);
      }} // Chỉ mở dropdown nếu có token
      onMouseLeave={() => setDropdownOpen(false)}
    >
      <button
        className="cursor-pointer text-2xl text-[#333] transition-all duration-300 hover:text-[#d88453] lg:px-4"
        onClick={handleUserIconClick} // Thêm chức năng điều hướng khi nhấn vào faUser
      >
        <FontAwesomeIcon icon={faUser} />
      </button>
      {getToken() &&
        isDropdownOpen && ( // Chỉ hiển thị dropdown nếu có token
          <div className="dropdown absolute -left-12 w-[160px] rounded-lg border-2 border-gray-300 bg-white shadow-md">
            <button
              className="w-full border-b-2 border-gray-300 px-4 py-2 text-left text-sm hover:rounded-t-lg hover:bg-gray-200"
              onClick={handleLoginClick}
            >
              Thông tin tài khoản
            </button>
            <button
              className="w-full px-4 py-2 text-left text-sm hover:rounded-b-lg hover:bg-gray-200"
              onClick={handleLogoutClick}
            >
              Đăng xuất
            </button>
          </div>
        )}
    </div>
  );
};

export default Login;
