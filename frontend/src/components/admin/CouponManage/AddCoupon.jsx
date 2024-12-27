import { useState } from "react";
import axios from "axios";
import Loading from "../../website/Loading";

const AddCoupon = ({ onClose, onAddSuccess }) => {
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountValue: "",
    maxUsage: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCoupon((prevCoupon) => ({
      ...prevCoupon,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/coupons",
        newCoupon,
      );

      if (response.status === 201) {
        onAddSuccess(); // Gọi để reload lại danh sách coupon
        onClose(); // Đóng modal
      } else {
        throw new Error("Thêm coupon thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Đã xảy ra lỗi khi thêm coupon.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose(); // Close the modal without saving
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 text-center text-2xl font-bold">Thêm Coupon</div>
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label className="mb-2 block text-lg font-medium">Mã Coupon</label>
            <input
              type="text"
              name="code"
              value={newCoupon.code}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2"
              placeholder="Nhập mã coupon"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-lg font-medium">
              Giá trị giảm
            </label>
            <input
              type="text"
              name="discountValue"
              value={newCoupon.discountValue}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2"
              placeholder="Nhập giá trị giảm"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-lg font-medium">
              Tổng Số lượng
            </label>
            <input
              type="text"
              name="maxUsage"
              value={newCoupon.maxUsage}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2"
              placeholder="Nhập số lượng coupon"
            />
          </div>

          {error && <div className="mb-4 text-red-500">{error}</div>}

          <div className="mt-8 flex justify-center space-x-40">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-md bg-gray-300 px-4 py-2 text-black hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              className={`rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 ${
                loading ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={loading}
            >
              {loading ? <Loading /> : <>Thêm</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCoupon;
