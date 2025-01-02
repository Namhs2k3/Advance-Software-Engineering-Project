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

  const validateForm = () => {
    const { code, discountValue, maxUsage } = newCoupon;
    if (!code || !discountValue || !maxUsage) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return false;
    }
    if (isNaN(discountValue) || isNaN(maxUsage)) {
      setError("Giá trị giảm và tổng số lượng phải là số.");
      return false;
    }
    return true;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/coupons",
        newCoupon
      );

      if (response.status === 201) {
        onAddSuccess();
        onClose();
      } else {
        throw new Error("Thêm coupon thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Đã xảy ra lỗi khi thêm coupon.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => onClose();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-center text-2xl font-bold">Thêm Coupon</h2>
        <form onSubmit={handleSave}>
          {[
            { label: "Mã Coupon", name: "code", placeholder: "Nhập mã coupon" },
            {
              label: "Giá trị giảm",
              name: "discountValue",
              placeholder: "Nhập giá trị giảm",
            },
            {
              label: "Tổng số lượng",
              name: "maxUsage",
              placeholder: "Nhập số lượng coupon",
            },
          ].map(({ label, name, placeholder }) => (
            <div key={name} className="mb-4">
              <label className="mb-2 block text-lg font-medium">{label}</label>
              <input
                type="text"
                name={name}
                value={newCoupon[name]}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 p-2"
                placeholder={placeholder}
              />
            </div>
          ))}

          {error && <div className="mb-4 text-red-500">{error}</div>}

          <div className="mt-8 flex justify-center space-x-4">
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
              {loading ? <Loading /> : "Thêm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCoupon;
