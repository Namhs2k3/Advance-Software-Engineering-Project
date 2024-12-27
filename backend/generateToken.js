import jwt from "jsonwebtoken";

const generateToken = (res, id, username, role, numbers, gmail) => {
  const token = jwt.sign(
    { id, username, role, numbers, gmail }, // Thêm thông tin vào payload
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // Thời gian token sống
  );

  // Gửi token dưới dạng cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Chỉ dùng https trong production
    sameSite: "strict",
    maxAge: 30 * 60 * 1000, // Cookie hết hạn sau 30 phút
  });

  return token;
};


export default generateToken;
