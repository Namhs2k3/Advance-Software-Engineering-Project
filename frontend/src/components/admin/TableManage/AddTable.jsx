import { useState } from "react";
import PropTypes from "prop-types";

const AddTable = ({ onAddTable, onClose }) => {
  const [newTable, setNewTable] = useState({
    name: "",
    isActive: 1, // Mặc định là 1 (Active)
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTable({ ...newTable, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTable.name || !newTable.isActive) {
      alert("Please fill in all fields.");
      return;
    }
    const date = new Date().toLocaleDateString("en-GB"); // Format: DD-MM-YYYY
    onAddTable({
      ...newTable,
      createdAt: date,
      updatedAt: date,
    });
    onClose(); // Đóng form sau khi thêm xong
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h2 className="mb-4 flex justify-center text-4xl font-bold">Tạo bàn</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block pb-2 text-xl font-medium">Tên bàn</label>
            <input
              type="text"
              name="name"
              value={newTable.name}
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
              value={newTable.isActive}
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
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Tạo bàn
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddTable.propTypes = {
  onAddTable: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddTable;
