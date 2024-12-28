import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const UpdateTable = ({ table, onClose, onUpdateTable }) => {
  const [updatedTable, setUpdatedTable] = useState(table);
  const [loading, setLoading] = useState(false); // Trạng thái loading

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTable({ ...updatedTable, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!updatedTable.name) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    setLoading(true); // Bắt đầu loading
    try {
      const response = await axios.put(
        `http://localhost:5000/api/tables/${updatedTable._id}`,
        updatedTable,
      );

      if (response.data.success) {
        onUpdateTable(response.data.data); // Gửi dữ liệu mới về component cha
        onClose(); // Đóng form sau khi cập nhật xong
      } else {
        alert("Không thể cập nhật bàn. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật bàn:", error.message);
      alert("Đã xảy ra lỗi khi cập nhật bàn.");
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h2 className="mb-4 flex justify-center text-4xl font-bold">
          Chỉnh sửa bàn
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block pb-2 text-xl font-medium">Tên bàn</label>
            <input
              type="text"
              name="name"
              value={updatedTable.name}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block pb-2 text-xl font-medium">
              Bật hoạt động
            </label>
            <select
              name="isActive"
              value={updatedTable.isActive}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 p-2"
            >
              <option value={1}>Bật</option>
              <option value={2}>Tắt</option>
            </select>
          </div>
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-28 rounded-md bg-gray-300 px-4 py-2 text-black hover:bg-gray-400"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={`rounded-md px-4 py-2 text-white ${
                loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Cập nhật bàn"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

UpdateTable.propTypes = {
  table: PropTypes.shape({
    _id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    isActive: PropTypes.number.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateTable: PropTypes.func.isRequired,
};

export default UpdateTable;
