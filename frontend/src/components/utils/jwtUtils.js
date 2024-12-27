export function decodeJWT(token) {
  try {
    const base64Url = token.split(".")[1]; // Lấy phần payload
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Đổi ký tự '-' và '_' về '+', '/'
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    return JSON.parse(jsonPayload); // Trả về đối tượng JSON đã giải mã
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null; // Trả về null nếu decode thất bại
  }
}
