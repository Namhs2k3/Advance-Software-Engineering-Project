import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log("Không có token trong request");
    return res.status(401).json({
      success: false,
      message: "No token, authorization denied",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("Token error:", error); // Debug lỗi token
    return res.status(401).json({
      success: false,
      message: "Token is not valid",
    });
  }
};
