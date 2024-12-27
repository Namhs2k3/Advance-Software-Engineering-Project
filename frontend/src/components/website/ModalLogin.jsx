import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { decodeJWT } from "../utils/jwtUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import LoadingWhite from "./LoadingWhite";

const LoginPage = () => {
  const [isRegisterMode, setRegisterMode] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [numbers, setNumbers] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when request starts
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          username,
          password,
        },
        { withCredentials: true },
      );

      if (response.data.success) {
        toast.success("Đăng nhập thành công!");
        const token = response.data.token;
        if (token) {
          Cookies.set("jwtToken", token, { expires: 7, path: "/" });
          const decoded = decodeJWT(token);
          console.log("Decoded Token:", decoded);
          if (
            decoded.role.includes("admin") ||
            decoded.role.includes("staff")
          ) {
            navigate("/admin");
          } else if (decoded.role.includes("customer")) {
            navigate("/customerprofile");
          } else {
            toast.error("Vai trò không hợp lệ!");
          }
        }
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false); // Reset loading state after request completes
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu không khớp!");
      return;
    }

    setLoading(true); // Set loading to true when request starts
    try {
      const response = await axios.post(
        "http://localhost:5000/api/accounts/register-customer",
        {
          username,
          password,
          gmail: email,
          numbers,
        },
      );

      if (response.data.success) {
        toast.success("Đăng ký thành công!");
        setRegisterMode(false);
      } else {
        setErrorMessage(response.data.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.",
      );
    } finally {
      setLoading(false); // Reset loading state after request completes
    }
  };



  return (
    <div className="mt-2 flex min-h-[85%] justify-center bg-white">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center">
        <div className="mb-8 flex justify-center">
          <h2
            className={`w-1/2 cursor-pointer px-4 py-2 font-josefin text-2xl font-bold ${!isRegisterMode ? "border-b-2 border-black" : "text-gray-500"}`}
            onClick={() => setRegisterMode(false)}
          >
            Đăng Nhập
          </h2>
          <h2
            className={`w-1/2 cursor-pointer px-4 py-2 font-josefin text-2xl font-bold ${isRegisterMode ? "border-b-2 border-black" : "text-gray-500"}`}
            onClick={() => setRegisterMode(true)}
          >
            Đăng Ký
          </h2>
        </div>

        {isRegisterMode ? (
          <form onSubmit={handleRegister}>
            <h3 className="font-josefin text-gray-600">
              Hãy tạo tài khoản để có thể xem lại lịch sử đơn hàng và sản phẩm
              yêu thích
            </h3>
            <h4 className="pb-4 font-josefin text-gray-600">
              Vui lòng nhập đầy đủ thông tin!
            </h4>
            <div className="relative z-0 mb-8">
              <input
                type="text"
                id="register_username"
                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-lg text-gray-900 focus:border-black focus:outline-none focus:ring-0"
                placeholder=" "
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label
                htmlFor="register_username"
                className="absolute top-1 z-10 flex origin-[0] -translate-y-6 scale-75 transform items-start font-josefin text-lg text-gray-500 duration-300 peer-placeholder-shown:z-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:z-10 peer-focus:-translate-y-6 peer-focus:scale-75"
              >
                Tên đăng nhập
              </label>
            </div>
            <div className="relative z-0 mb-8">
              <input
                type="text"
                id="register_numbers"
                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-lg text-gray-900 focus:border-black focus:outline-none focus:ring-0"
                placeholder=" "
                value={numbers}
                onChange={(e) => setNumbers(e.target.value)}
                required
              />
              <label
                htmlFor="register_numbers"
                className="absolute top-1 z-10 flex origin-[0] -translate-y-6 scale-75 transform items-start font-josefin text-lg text-gray-500 duration-300 peer-placeholder-shown:z-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:z-10 peer-focus:-translate-y-6 peer-focus:scale-75"
              >
                Nhập số điện thoại
              </label>
            </div>
            <div className="relative z-0 mb-8">
              <input
                type="email"
                id="register_email"
                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-lg text-gray-900 focus:border-black focus:outline-none focus:ring-0"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label
                htmlFor="register_email"
                className="absolute top-1 z-10 flex origin-[0] -translate-y-6 scale-75 transform items-start font-josefin text-lg text-gray-500 duration-300 peer-placeholder-shown:z-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:z-10 peer-focus:-translate-y-6 peer-focus:scale-75"
              >
                Nhập Email
              </label>
            </div>
            <div className="relative z-0 mb-8">
              <input
                type={isPasswordVisible ? "text" : "password"}
                id="register_password"
                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-lg text-gray-900 focus:border-black focus:outline-none focus:ring-0"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label
                htmlFor="register_password"
                className="absolute top-1 z-10 flex origin-[0] -translate-y-6 scale-75 transform items-start font-josefin text-lg text-gray-500 duration-300 peer-placeholder-shown:z-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:z-10 peer-focus:-translate-y-6 peer-focus:scale-75"
              >
                Mật khẩu
              </label>
              <button
                type="button"
                onClick={() => setPasswordVisible(!isPasswordVisible)} // Toggle chế độ hiển thị mật khẩu
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              >
                <FontAwesomeIcon
                  icon={isPasswordVisible ? faEye : faEyeSlash}
                />
              </button>
            </div>
            <div className="relative z-0 mb-8">
              <input
                type={isConfirmPasswordVisible ? "text" : "password"}
                id="register_confirm_password"
                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-lg text-gray-900 focus:border-black focus:outline-none focus:ring-0"
                placeholder=" "
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <label
                htmlFor="register_confirm_password"
                className="absolute top-1 z-10 flex origin-[0] -translate-y-6 scale-75 transform items-start font-josefin text-lg text-gray-500 duration-300 peer-placeholder-shown:z-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:z-10 peer-focus:-translate-y-6 peer-focus:scale-75"
              >
                Nhập lại mật khẩu
              </label>
              <button
                type="button"
                onClick={() =>
                  setConfirmPasswordVisible(!isConfirmPasswordVisible)
                } // Toggle xác nhận mật khẩu
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              >
                <FontAwesomeIcon
                  icon={isConfirmPasswordVisible ? faEye : faEyeSlash}
                />
              </button>
            </div>
            {errorMessage && (
              <p className="mb-8 text-red-500">{errorMessage}</p>
            )}
            <button
              type="submit"
              className="mt-3 w-full rounded bg-black py-3 font-josefin text-white transition-transform duration-200 hover:scale-95"
              disabled={loading} // Disable button when loading
            >
              {loading ? (
                <LoadingWhite /> // Display loading spinner if loading is true
              ) : (
                "Đăng Ký"
              )}
            </button>

            <button
              className="mt-2 text-lg text-gray-500 hover:text-black"
              onClick={() => setRegisterMode(false)}
            >
              Đã có tài khoản?
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <h3 className="font-josefin text-gray-600">
              Chào mừng quay trở lại
            </h3>
            <h4 className="mb-2 pb-4 font-josefin text-gray-600">
              Đăng nhập bằng tên đăng nhập và mật khẩu
            </h4>
            <div className="relative z-0 mb-8">
              <input
                type="text"
                id="login_username"
                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-lg text-gray-900 focus:border-black focus:outline-none focus:ring-0"
                placeholder=" "
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label
                htmlFor="login_username"
                className="absolute top-1 z-10 flex origin-[0] -translate-y-6 scale-75 transform items-start font-josefin text-lg text-gray-500 duration-300 peer-placeholder-shown:z-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:z-10 peer-focus:-translate-y-6 peer-focus:scale-75"
              >
                Tên đăng nhập hoặc email
              </label>
            </div>

            <div className="relative z-0 mb-8">
              <input
                type={isPasswordVisible ? "text" : "password"} // Thay đổi loại input
                id="login_password"
                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-lg text-gray-900 focus:border-black focus:outline-none focus:ring-0"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label
                htmlFor="login_password"
                className="absolute top-1 z-10 flex origin-[0] -translate-y-6 scale-75 transform items-start font-josefin text-lg text-gray-500 duration-300 peer-placeholder-shown:z-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:z-10 peer-focus:-translate-y-6 peer-focus:scale-75"
              >
                Mật khẩu
              </label>

              {/* Nút bật/tắt hiển thị mật khẩu */}
              <button
                type="button"
                onClick={() => setPasswordVisible(!isPasswordVisible)} // Toggle chế độ hiển thị mật khẩu
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              >
                <FontAwesomeIcon
                  icon={isPasswordVisible ? faEye : faEyeSlash}
                />
              </button>
            </div>
            {errorMessage && (
              <p className="mb-8 text-red-500">{errorMessage}</p>
            )}
            <button
              type="submit"
              className="mb-2 mt-3 w-full rounded bg-black py-3 font-josefin text-base text-white transition-transform duration-200 hover:scale-95"
              disabled={loading} // Disable button when loading
            >
              {loading ? (
                <LoadingWhite /> // Display loading spinner if loading is true
              ) : (
                "Đăng Nhập"
              )}
            </button>
            <a
              href="/forgotpassword"
              className="text-lg text-gray-500 hover:text-black"
            >
              Bạn quên mật khẩu?
            </a>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
