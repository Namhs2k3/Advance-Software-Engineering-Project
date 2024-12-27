import Account from "../models/account.model.js";
import generateToken from "../generateToken.js"; // Nhớ import hàm generateToken của bạn
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import crypto from "crypto"; // Để tạo mã xác thực ngẫu nhiên
import dotenv from "dotenv";
dotenv.config();

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body; // Nhận email và OTP từ client

  try {
    // Tìm người dùng theo email
    const user = await Account.findOne({ gmail: email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email chưa được đăng ký",
      });
    }

    // Kiểm tra mã OTP có khớp không
    if (user.otp !== parseInt(otp)) {
      return res.status(400).json({
        success: false,
        message: "Mã OTP không chính xác",
      });
    }

    // Nếu OTP đúng, có thể thực hiện các bước tiếp theo (ví dụ: cho phép đổi mật khẩu)
    res.status(200).json({
      success: true,
      message: "Mã OTP hợp lệ. Bạn có thể thay đổi mật khẩu",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra. Vui lòng thử lại sau.",
    });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Tìm tài khoản người dùng bằng email
    const user = await Account.findOne({ gmail: email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email không tồn tại trong hệ thống",
      });
    }

    // Tạo mã OTP ngẫu nhiên
    const otp = crypto.randomInt(100000, 999999); // Mã OTP 6 chữ số

    // Lưu mã OTP vào cơ sở dữ liệu
    user.otp = otp;
    await user.save();
    console.log("Email:", email);
    console.log("User OTP in DB:", user.otp);
    console.log("Entered OTP:", otp);

    console.log("SMTP_HOST:", process.env.SMTP_HOST);
    console.log("SMTP_PORT:", process.env.SMTP_PORT);
    console.log("SMTP_SECURE:", process.env.SMTP_SECURE);
    console.log("SMTP_USER:", process.env.SMTP_USER);
    console.log("SMTP_PASS:", process.env.SMTP_PASS);

    // Cấu hình transporter với SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // SMTP server
      port: process.env.SMTP_PORT || 587, // Cổng SMTP (587 hoặc 465 nếu dùng SSL)
      secure: process.env.SMTP_SECURE === "true", // true nếu dùng SSL
      auth: {
        user: process.env.SMTP_USER, // Tên đăng nhập SMTP
        pass: process.env.SMTP_PASS, // Mật khẩu SMTP
      },
    });

    // Kiểm tra kết nối tới SMTP server
    transporter.verify((error, success) => {
      if (error) {
        console.log("Error verifying transporter:", error);
      } else {
        console.log("SMTP server is ready:", success);
      }
    });

    // Cấu hình email
    const mailOptions = {
      from: process.env.SMTP_USER, // Địa chỉ email gửi
      to: email, // Email người nhận
      subject: "Mã OTP Đặt lại Mật khẩu",
      text: `Mã OTP của bạn là: ${otp}`,
    };

    // Gửi email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email sending error:", error);
        return res.status(500).json({
          success: false,
          message: "Gửi email thất bại. Vui lòng thử lại sau.",
        });
      }
      console.log("Email sent:", info);
      res.status(200).json({
        success: true,
        message: "Mã OTP đã được gửi đến email của bạn.",
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra. Vui lòng thử lại sau.",
    });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Kiểm tra xem người dùng có tồn tại không
    const user = await Account.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Nhập sai tên người dùng",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Mật khẩu không trùng khớp",
      });
    }

    // Tạo JWT token
    const token = generateToken(res, user._id, user.username, user.role);

    // Trả về thông tin người dùng và token
    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      token, // Include the token in the response
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        numbers: user.numbers,
        gmail: user.gmail,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { email, newPassword, confirmNewPassword } = req.body;

  try {
    // Kiểm tra xem mật khẩu mới và xác nhận mật khẩu có khớp không
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu mới và xác nhận mật khẩu không khớp",
      });
    }

    // Tìm tài khoản người dùng qua email
    const user = await Account.findOne({ gmail: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản với email này",
      });
    }

    // Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu mới vào cơ sở dữ liệu
    user.password = hashedPassword;
    user.otp = null; // Xóa OTP sau khi đặt lại mật khẩu
    await user.save();

    res.status(200).json({
      success: true,
      message: "Đặt lại mật khẩu thành công",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Không thể đặt lại mật khẩu. Vui lòng thử lại sau.",
    });
  }
};

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  try {
    // Tìm tài khoản người dùng
    const user = await Account.findOne({ username: req.user.username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản này",
      });
    }

    // So sánh mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Mật khẩu cũ không đúng",
      });
    }

    // Kiểm tra xem mật khẩu mới và xác nhận mật khẩu có khớp không
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu mới và xác nhận mật khẩu không khớp",
      });
    }

    // Kiểm tra xem mật khẩu mới có khác mật khẩu cũ không
    const isOldPasswordSame = await bcrypt.compare(newPassword, user.password);
    if (isOldPasswordSame) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu mới không được giống mật khẩu cũ",
      });
    }

    // Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu mới vào cơ sở dữ liệu
    user.password = hashedPassword;
    await user.save();

    // Trả về thông báo thành công
    return res.status(200).json({
      success: true,
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể thay đổi mật khẩu. Vui lòng thử lại sau.",
    });
  }
};

export const logout = (req, res) => {
  // Xóa JWT token trong cookie
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Bảo đảm token chỉ bị xóa trong môi trường bảo mật
      sameSite: "strict",
    });

    res.status(200).json({ success: true, message: "Đăng xuất thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Đăng xuất thất bại" });
  }
};
