import { useState } from "react";

const AddEmployee = ({ onAddEmployee, onClose }) => {
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    phone: "",
    email: "",
    position: "waiter",
    isActive: true,
    shifts: [
      { date: "", shift: "morning" },
      { date: "", shift: "afternoon" },
    ],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setNewEmployee({ ...newEmployee, [name]: numericValue });
    } else {
      setNewEmployee({ ...newEmployee, [name]: value });
    }
  };

  const handleShiftChange = (index, field, value) => {
    const updatedShifts = newEmployee.shifts.map((shift, i) =>
      i === index ? { ...shift, [field]: value } : shift,
    );
    setNewEmployee({ ...newEmployee, shifts: updatedShifts });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(newEmployee); // Debugging purpose
    onAddEmployee(newEmployee);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg">
        <h2 className="flex justify-center mb-4 text-4xl font-bold">
          Thêm nhân viên
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block pb-2 text-xl font-medium">Họ tên</label>
            <input
              type="text"
              name="name"
              value={newEmployee.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block pb-2 text-xl font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={newEmployee.email}
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
              value={newEmployee.phone}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block pb-2 text-xl font-medium">Vị trí</label>
            <select
              name="position"
              value={newEmployee.position}
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
          <div className="mb-4">
            <label className="block pb-2 text-xl font-medium">
              Ca làm việc
            </label>
            {newEmployee.shifts.map((shift, index) => (
              <div key={index} className="flex items-center space-x-4">
                <input
                  type="date"
                  value={shift.date}
                  onChange={(e) =>
                    handleShiftChange(index, "date", e.target.value)
                  }
                  className="w-1/2 p-2 border border-gray-300 rounded-md"
                />
                <select
                  value={shift.shift}
                  onChange={(e) =>
                    handleShiftChange(index, "shift", e.target.value)
                  }
                  className="w-1/2 p-2 border border-gray-300 rounded-md"
                >
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select>
              </div>
            ))}
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
              Thêm nhân viên
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
