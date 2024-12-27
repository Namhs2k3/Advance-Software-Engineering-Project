import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios"; // Import Axios

const ResetPassword = () => {
  const [password, setPassword] = useState(""); // State lưu mật khẩu mới
  const [confirmPassword, setConfirmPassword] = useState(""); // State lưu xác nhận mật khẩu
  const navigate = useNavigate(); // Hook navigate

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn hành vi mặc định của form

    if (!password.trim() || !confirmPassword.trim()) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu không khớp!");
      return;
    }

    try {
      const email = localStorage.getItem("email"); // Lấy email đã lưu từ quá trình verify OTP
      if (!email) {
        toast.error("Không tìm thấy thông tin email. Vui lòng thử lại!");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        {
          email,
          newPassword: password,
          confirmNewPassword: confirmPassword,
        },
      );

      if (response.data.success) {
        toast.success("Mật khẩu đã được đặt lại thành công!");
        navigate("/login"); // Chuyển về trang đăng nhập
      } else {
        toast.error(response.data.message || "Đặt lại mật khẩu thất bại!");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau!");
    }
  };

  return (
    <div className="mt-10 flex min-h-[65%] justify-center bg-white">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 text-center">
        <div className="mb-6 flex justify-center">
          <h2 className="cursor-pointer px-4 py-2 font-josefin text-4xl font-bold">
            Đặt lại mật khẩu
          </h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="relative z-0 mb-8">
            <input
              type="password"
              id="new_password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-lg text-gray-900 focus:border-black focus:outline-none focus:ring-0"
              placeholder=" "
              required
            />
            <label
              htmlFor="new_password"
              className="absolute top-1 z-10 flex origin-[0] -translate-y-6 scale-75 transform items-start font-josefin text-lg text-gray-500 duration-300 peer-placeholder-shown:z-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:z-10 peer-focus:-translate-y-6 peer-focus:scale-75"
            >
              Mật khẩu mới
            </label>
          </div>
          <div className="relative z-0 mb-6">
            <input
              type="password"
              id="confirm_password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-lg text-gray-900 focus:border-black focus:outline-none focus:ring-0"
              placeholder=" "
              required
            />
            <label
              htmlFor="confirm_password"
              className="absolute top-1 z-10 flex origin-[0] -translate-y-6 scale-75 transform items-start font-josefin text-lg text-gray-500 duration-300 peer-placeholder-shown:z-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:z-10 peer-focus:-translate-y-6 peer-focus:scale-75"
            >
              Nhập lại mật khẩu
            </label>
          </div>
          <button
            type="submit"
            className="mb-2 mt-3 w-full rounded-lg bg-black py-3 font-josefin text-xl text-white transition-transform duration-200 hover:scale-90"
          >
            Đặt lại mật khẩu
          </button>
        </form>
        <a href="/login" className="text-lg text-gray-500 hover:text-black">
          Quay lại đăng nhập?
        </a>
      </div>
    </div>
  );
};

export default ResetPassword;
