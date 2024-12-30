import mongoose from "mongoose";
import bcrypt from "bcrypt";

const accountSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    numbers: {
      type: String,
      required: true,
    },
    otp: {
      type: Number, 
      required: false,
    },
    gmail: {
      type: String,
      required: true,
      unique: true,
    },
    isActive: { type: Number, default: 1 },
    role: {
      type: [String],
      enum: ["admin", "staff", "chef"], // Liệt kê các giá trị có thể
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

accountSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.password.startsWith("$2b$")) {
    // Nếu mật khẩu không thay đổi hoặc đã được mã hóa, bỏ qua việc mã hóa lại
    next();
  } else {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  }
});

accountSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Account = mongoose.model("Account", accountSchema);

export default Account;
