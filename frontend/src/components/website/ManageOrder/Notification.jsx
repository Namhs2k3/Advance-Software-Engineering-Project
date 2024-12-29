import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Fetch data from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/tables/notice",
        );
        if (response.data.success) {
          setNotifications(response.data.data);
        } else {
          console.error("Failed to fetch notifications");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error.message);
      }
    };

    fetchNotifications();
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleDelete = async (index, id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/tables/${id}/notice`,
        { notice: 0 }, // Cập nhật notice = 0
      );

      if (response.data.success) {
        // Xóa thông báo khỏi giao diện
        const updatedNotifications = notifications.filter(
          (_, i) => i !== index,
        );
        setNotifications(updatedNotifications);
      } else {
        console.error("Failed to update table notice");
      }
    } catch (error) {
      console.error("Error updating table notice:", error.message);
    }
  };

  const activeStepCount = notifications.length;

  return (
    <div className="relative">
      {/* Notification Icon */}
      <button
        onClick={handleToggle}
        className="relative mr-4 cursor-pointer text-3xl text-[#333] transition-all duration-300"
      >
        <FontAwesomeIcon icon={faBell} />
        {activeStepCount > 0 && (
          <span className="absolute -right-2 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white">
            {activeStepCount}
          </span>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={handleToggle}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-96 transform bg-white shadow-lg transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4">
          <h2 className="mb-4 text-xl font-bold">Notifications</h2>
          {notifications.map((table, index) => (
            <div
              key={index}
              className="mb-2 flex items-center justify-between rounded-lg bg-gray-100 p-3 shadow-md"
            >
              <p className="w-[270px] font-josefin text-xl font-bold text-gray-800">
                Bàn {table.name} đã làm món xong, yêu cầu phục vụ lấy món.
              </p>
              <button
                onClick={() => handleDelete(index, table._id)}
                className="text-2xl text-gray-400 hover:text-red-700"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notification;
