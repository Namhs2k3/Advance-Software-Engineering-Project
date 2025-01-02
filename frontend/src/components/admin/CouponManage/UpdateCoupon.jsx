import { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../../website/Loading";

const UpdateCoupon = ({ coupon, onClose, onUpdateSuccess }) => {
  const [formData, setFormData] = useState(coupon);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData(coupon);
  }, [coupon]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { status } = await axios.put(
        `http://localhost:5000/api/coupons/${formData._id}`,
        formData
      );

      if (status === 200) {
        onUpdateSuccess();
        onClose();
      } else {
        throw new Error("Cập nhật thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Đã xảy ra lỗi khi cập nhật.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-center text-2xl font-bold">Chỉnh sửa Coupon</h2>
        <form onSubmit={handleSubmit}>
          {["code", "discountValue", "maxUsage"].map((field, idx) => (
            <div key={idx} className="mb-4">
              <label className="mb-2 block text-lg font-medium capitalize">
                {field === "code"
                  ? "Mã Coupon"
                  : field === "discountValue"
                  ? "Giá trị giảm"
                  : "Tổng Số lượng"}
              </label>
              <input
                type="text"
                name={field}
                value={formData[field] || ""}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 p-2"
                placeholder={
                  field === "code"
                    ? "Nhập mã coupon"
                    : field === "discountValue"
                    ? "Nhập giá trị giảm"
                    : "Nhập số lượng coupon"
                }
              />
            </div>
          ))}
          {error && <p className="mb-4 text-center text-red-500">{error}</p>}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-300 px-4 py-2 text-black hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 ${
                isLoading && "cursor-not-allowed opacity-50"
              }`}
            >
              {isLoading ? <Loading /> : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCoupon;
