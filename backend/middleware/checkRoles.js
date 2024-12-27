export const checkRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRoles = req.user.role; // Lấy vai trò của người dùng từ JWT hoặc session

    // Kiểm tra nếu người dùng có ít nhất một vai trò phù hợp với các vai trò được phép
    const hasRole = userRoles.some((role) => allowedRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Insufficient permissions",
      });
    }
    next();
  };
};
