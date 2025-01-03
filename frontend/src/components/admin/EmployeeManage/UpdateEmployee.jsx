import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const UpdateEmployee = ({ employee, onClose, onUpdateEmployee }) => {
  const [updatedEmployee, setUpdatedEmployee] = useState(employee);

  useEffect(() => {
    setUpdatedEmployee(employee);
  }, [employee]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEmployee({ ...updatedEmployee, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !updatedEmployee.name ||
      !updatedEmployee.position ||
      !updatedEmployee.email ||
      !updatedEmployee.phone
    ) {
      alert("Please fill in all fields.");
      return;
    }

    axios
      .put(
        `http://localhost:5000/api/employee/${updatedEmployee._id}`,
        updatedEmployee,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwtToken")}`,
          },
          withCredentials: true,
        },
      )
      .then((response) => {
        onUpdateEmployee(updatedEmployee);
        onClose();
      })
      .catch((error) => {
        console.error("There was an error updating the employee:", error);
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg">
        <h2 className="flex justify-center mb-4 text-4xl font-bold">
          Chỉnh sửa nhân viên
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block pb-2 text-xl font-medium">Họ tên</label>
            <input
              type="text"
              name="name"
              value={updatedEmployee.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block pb-2 text-xl font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={updatedEmployee.email}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block pb-2 text-xl font-medium">
              Số điện thoại
            </label>
            <input
              type="text"
              name="phone"
              value={updatedEmployee.phone}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block pb-2 text-xl font-medium">Vai trò</label>
            <select
              name="position"
              value={updatedEmployee.position}
              onChange={handleInputChange}
              className="w-1/2 p-2 border border-gray-300 rounded-md"
            >
              <option value="manager">Manager</option>
              <option value="waiter">Waiter</option>
              <option value="chef">Chef</option>
              <option value="cleaner">Cleaner</option>
              <option value="cashier">Cashier</option>
            </select>
          </div>
          <div className="flex mb-4">
            <label className="block pb-2 mr-4 text-xl font-medium">
              Hoạt động
            </label>
            <input
              type="checkbox"
              name="isActive"
              checked={updatedEmployee.isActive}
              onChange={(e) =>
                setUpdatedEmployee({
                  ...updatedEmployee,
                  isActive: e.target.checked,
                })
              }
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-24 px-4 py-2 text-black bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateEmployee;
