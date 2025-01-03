import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const EmployeeDetails = ({ id, onBackToList }) => {
  // Accept a prop for the back action
  const [view, setView] = useState("shifts");
  const [shifts, setShifts] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingShift, setEditingShift] = useState(null);
  const [editingPerformance, setEditingPerformance] = useState(null);
  const [newShift, setNewShift] = useState({ date: "", shift: "" });
  const [newPerformance, setNewPerformance] = useState({
    date: "",
    tasksCompleted: "",
    notes: "",
  });

  useEffect(() => {
    if (view === "shifts") {
      fetchShifts();
    } else if (view === "performance") {
      fetchPerformance();
    }
  }, [view]);

  const fetchShifts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/shiftandperformance/${id}/shifts`,
        { withCredentials: true },
      );
      setShifts(response.data.data);
    } catch (err) {
      setError("Lỗi khi tải lịch làm việc.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformance = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/shiftandperformance/${id}/performance`,
        { withCredentials: true },
      );
      setPerformance(response.data.data);
    } catch (err) {
      setError("Lỗi khi tải đánh giá hiệu suất.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddShift = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/shiftandperformance/${id}/shifts`,
        newShift,
        { withCredentials: true },
      );
      fetchShifts();
      setNewShift({ date: "", shift: "" });
    } catch (err) {
      setError("Lỗi khi thêm ca làm việc.");
    }
  };

  const handleEditShift = async (shiftId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/shiftandperformance/${id}/shifts/${shiftId}`,
        newShift,
        { withCredentials: true },
      );
      fetchShifts();
      setEditingShift(null);
    } catch (err) {
      setError("Lỗi khi sửa ca làm việc.");
    }
  };

  const handleAddPerformance = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/shiftandperformance/${id}/performance`,
        newPerformance,
        { withCredentials: true },
      );
      fetchPerformance();
      setNewPerformance({ date: "", tasksCompleted: "", notes: "" });
    } catch (err) {
      setError("Lỗi khi thêm đánh giá hiệu suất.");
    }
  };

  const handleEditPerformance = async (performanceId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/shiftandperformance/${id}/performance/${performanceId}`,
        newPerformance,
        { withCredentials: true },
      );
      fetchPerformance();
      setEditingPerformance(null);
    } catch (err) {
      setError("Lỗi khi sửa đánh giá hiệu suất.");
    }
  };

  const renderShiftsTable = () => {
    if (shifts.length === 0)
      return (
        <p className="text-center">Không có lịch làm việc nào được tìm thấy.</p>
      );
    return (
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3 text-left">Ngày</th>
              <th className="px-4 py-3 text-left">Ca làm việc</th>
              <th className="px-4 py-3 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift, index) => (
              <tr key={index} className="border-b hover:bg-gray-100">
                <td className="px-4 py-4">
                  {new Date(shift.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-4">{shift.shift}</td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => setEditingShift(shift._id)}
                    className="text-blue-500 hover:underline"
                  >
                    Sửa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={() => setEditingShift("new")}
          className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-lg"
        >
          Thêm ca làm việc
        </button>
      </div>
    );
  };

  const renderPerformanceTable = () => {
    if (performance.length === 0)
      return (
        <p className="text-center">
          Không có dữ liệu đánh giá hiệu suất nào được tìm thấy.
        </p>
      );
    return (
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3 text-left">Ngày</th>
              <th className="px-4 py-3 text-left">Công việc hoàn thành</th>
              <th className="px-4 py-3 text-left">Ghi chú</th>
              <th className="px-4 py-3 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {performance.map((record, index) => (
              <tr key={index} className="border-b hover:bg-gray-100">
                <td className="px-4 py-4">
                  {new Date(record.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-4">{record.tasksCompleted}</td>
                <td className="px-4 py-4">{record.notes}</td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => setEditingPerformance(record._id)}
                    className="text-blue-500 hover:underline"
                  >
                    Sửa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={() => setEditingPerformance("new")}
          className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-lg"
        >
          Thêm đánh giá hiệu suất
        </button>
      </div>
    );
  };

  const renderForm = () => {
    if (editingShift === "new") {
      return (
        <div>
          <h3 className="text-lg font-bold">Thêm Ca Làm Việc</h3>
          <input
            type="date"
            className="px-4 py-2 border"
            value={newShift.date}
            onChange={(e) => setNewShift({ ...newShift, date: e.target.value })}
          />
          <select
            className="px-4 py-2 border"
            value={newShift.shift}
            onChange={(e) =>
              setNewShift({ ...newShift, shift: e.target.value })
            }
          >
            <option value="morning">Sáng</option>
            <option value="afternoon">Chiều</option>
            <option value="evening">Tối</option>
          </select>
          <button
            onClick={handleAddShift}
            className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-lg"
          >
            Thêm
          </button>
        </div>
      );
    }
    if (editingShift) {
      return (
        <div>
          <h3 className="text-lg font-bold">Sửa Ca Làm Việc</h3>
          <input
            type="date"
            className="px-4 py-2 border"
            value={newShift.date}
            onChange={(e) => setNewShift({ ...newShift, date: e.target.value })}
          />
          <select
            className="px-4 py-2 border"
            value={newShift.shift}
            onChange={(e) =>
              setNewShift({ ...newShift, shift: e.target.value })
            }
          >
            <option value="morning">Sáng</option>
            <option value="afternoon">Chiều</option>
            <option value="evening">Tối</option>
          </select>
          <button
            onClick={() => handleEditShift(editingShift)}
            className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-lg"
          >
            Cập nhật
          </button>
        </div>
      );
    }
    if (editingPerformance === "new") {
      return (
        <div>
          <h3 className="text-lg font-bold">Thêm Đánh Giá Hiệu Suất</h3>
          <input
            type="date"
            className="px-4 py-2 border"
            value={newPerformance.date}
            onChange={(e) =>
              setNewPerformance({ ...newPerformance, date: e.target.value })
            }
          />
          <input
            type="number"
            className="px-4 py-2 border"
            value={newPerformance.tasksCompleted}
            onChange={(e) =>
              setNewPerformance({
                ...newPerformance,
                tasksCompleted: e.target.value,
              })
            }
          />
          <input
            type="text"
            className="px-4 py-2 border"
            value={newPerformance.notes}
            onChange={(e) =>
              setNewPerformance({ ...newPerformance, notes: e.target.value })
            }
          />
          <button
            onClick={handleAddPerformance}
            className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-lg"
          >
            Thêm
          </button>
        </div>
      );
    }
    if (editingPerformance) {
      return (
        <div>
          <h3 className="text-lg font-bold">Sửa Đánh Giá Hiệu Suất</h3>
          <input
            type="date"
            className="px-4 py-2 border"
            value={newPerformance.date}
            onChange={(e) =>
              setNewPerformance({ ...newPerformance, date: e.target.value })
            }
          />
          <input
            type="number"
            className="px-4 py-2 border"
            value={newPerformance.tasksCompleted}
            onChange={(e) =>
              setNewPerformance({
                ...newPerformance,
                tasksCompleted: e.target.value,
              })
            }
          />
          <input
            type="text"
            className="px-4 py-2 border"
            value={newPerformance.notes}
            onChange={(e) =>
              setNewPerformance({ ...newPerformance, notes: e.target.value })
            }
          />
          <button
            onClick={() => handleEditPerformance(editingPerformance)}
            className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-lg"
          >
            Cập nhật
          </button>
        </div>
      );
    }
  };

  if (loading)
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p>Đang tải...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p>{error}</p>
      </div>
    );

  return (
    <div className="container mx-auto">
      <h1 className="mb-4 text-2xl font-bold text-center">
        Chi tiết nhân viên #{id}
      </h1>
      <div className="flex justify-between">
        <button
          onClick={() => onBackToList()} // Call the back to list function
          className="px-4 py-2 text-white bg-gray-500 rounded-lg"
        >
          Quay lại danh sách nhân viên
        </button>
        <div className="flex">
          <button
            onClick={() => setView("shifts")}
            className={`px-4 py-2 ${
              view === "shifts" ? "bg-blue-500 text-white" : ""
            }`}
          >
            Lịch làm việc
          </button>
          <button
            onClick={() => setView("performance")}
            className={`px-4 py-2 ${
              view === "performance" ? "bg-blue-500 text-white" : ""
            }`}
          >
            Đánh giá hiệu suất
          </button>
        </div>
      </div>
      <div className="mt-4">
        {view === "shifts" ? renderShiftsTable() : renderPerformanceTable()}
      </div>
      <div className="mt-4">{renderForm()}</div>
    </div>
  );
};

EmployeeDetails.propTypes = {
  id: PropTypes.string.isRequired,
  onBackToList: PropTypes.func.isRequired, // Add PropType for onBackToList
};

export default EmployeeDetails;
