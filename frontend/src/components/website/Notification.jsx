import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faTrash } from "@fortawesome/free-solid-svg-icons";

const sampleData = [
  {
    name: "1",
    isActive: 1,
    status: 1,
    activeStep: 2,
    cart: [
      { product: "64f4c5b", quantity: 2 },
      { product: "64f4c6c", quantity: 1 },
    ],
  },
  {
    name: "2",
    isActive: 1,
    status: 1,
    activeStep: 2,
    cart: [{ product: "64f4c7d", quantity: 3 }],
  },
  {
    name: "3",
    isActive: 1,
    status: 1,
    activeStep: 0,
    cart: [{ product: "64f4c8e", quantity: 1 }],
  },
];

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(sampleData);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleDelete = (index) => {
    const updatedNotifications = notifications.filter((_, i) => i !== index);
    setNotifications(updatedNotifications);
  };

  const activeStepCount = notifications.filter(
    (table) => table.activeStep === 2,
  ).length;

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
          {notifications.map((table, index) => {
            if (table.activeStep === 2) {
              return (
                <div
                  key={index}
                  className="mb-2 flex items-center justify-between rounded-lg bg-gray-100 p-3 shadow-md"
                >
                  <p className="w-[270px] font-josefin font-bold text-gray-800">
                    Bàn {table.name} đã làm món xong, yêu cầu phục vụ lấy món.
                  </p>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-2xl text-gray-400 hover:text-red-700"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default Notification;
