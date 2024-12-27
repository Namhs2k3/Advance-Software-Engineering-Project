import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthenticationCode = () => {
  const [code, setCode] = useState(""); // State lưu mã xác thực
  const navigate = useNavigate(); // Hook navigate từ react-router-dom
  const [email, setEmail] = useState(""); // Lưu email

  useEffect(() => {
    // Kiểm tra xem email đã được lưu trong localStorage hay chưa
    const savedEmail = localStorage.getItem("email");
    if (savedEmail) {
      setEmail(savedEmail); // Gán email đã lưu vào state
    } else {
      navigate("/forgot-password"); // Nếu không có email, điều hướng về trang nhập email
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code) {
      try {
        // Gửi yêu cầu xác thực mã OTP
        const response = await fetch(
          "http://localhost:5000/api/auth/verify-otp",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp: code }), // Gửi email và mã OTP
          },
        );

        const data = await response.json();

        if (data.success) {
          toast.success(data.message); // Hiển thị thông báo thành công
          navigate("/resetpassword"); // Chuyển hướng về trang reset password
        } else {
          toast.error(data.message); // Hiển thị lỗi nếu mã OTP không đúng
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    }
  };

  return (
    <div className="mt-10 flex min-h-[65%] justify-center bg-white">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 text-center">
        <div className="mb-6 flex justify-center">
          <h2 className="cursor-pointer px-4 py-2 font-josefin text-4xl font-bold">
            Nhập mã xác thực
          </h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="relative z-0 mb-4">
            <input
              type="text"
              id="verification_code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-lg text-gray-900 focus:border-black focus:outline-none focus:ring-0"
              placeholder=" "
              required
            />
            <label
              htmlFor="verification_code"
              className="absolute top-1 z-10 flex origin-[0] -translate-y-6 scale-75 transform items-start font-josefin text-lg text-gray-500 duration-300 peer-placeholder-shown:z-0 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:z-10 peer-focus:-translate-y-6 peer-focus:scale-75"
            >
              Nhập mã xác thực
            </label>
          </div>
          <button
            type="submit"
            className="mb-2 mt-3 w-full rounded-lg bg-black py-3 font-josefin text-xl text-white transition-transform duration-200 hover:scale-90"
          >
            Xác nhận
          </button>
        </form>
        <a href="/login" className="text-lg text-gray-500 hover:text-black">
          Quay lại đăng nhập?
        </a>
      </div>
    </div>
  );
};

export default AuthenticationCode;
