import {
  faPen,
  faPlus,
  faToggleOff,
  faToggleOn,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../../website/Loading";
import AddEmployee from "./AddEmployee";
import EmployeeDetails from "./EmployeeDetails";
import UpdateEmployee from "./UpdateEmployee";

const ManageEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [isAddFormVisible, setAddFormVisible] = useState(false);
  const [isUpdateFormVisible, setUpdateFormVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState("");
  const [position, setPosition] = useState("");
  const [isId, setIsId] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/employee`, {
          params: { search, isActive, position },
          withCredentials: true,
        });
        setEmployees(response.data.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast.error("Lỗi khi tải danh sách nhân viên");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [search, isActive, position]);

  const toggleIsActive = async (id) => {
    try {
      const updatedEmployees = employees.map((employee) =>
        employee._id === id
          ? { ...employee, isActive: !employee.isActive }
          : employee,
      );
      setEmployees(updatedEmployees);

      await axios.put(
        `http://localhost:5000/api/employee/${id}`,
        { isActive: updatedEmployees.find((e) => e._id === id).isActive },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("jwtToken")}`,
          },
          withCredentials: true,
        },
      );
      toast.success("Cập nhật trạng thái thành công");
    } catch (error) {
      console.error("Error updating employee status:", error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
    }
  };

  const handleAddEmployee = (newEmployee) => {
    axios
      .post("http://localhost:5000/api/employee", newEmployee, {
        headers: {
          Authorization: `Bearer ${Cookies.get("jwtToken")}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        setEmployees([...employees, response.data.data]);
        toast.success("Thêm nhân viên thành công");
      })
      .catch((error) => {
        console.error("Error adding employee:", error);
        toast.error("Có lỗi xảy ra khi thêm nhân viên");
      });
  };

  const handleUpdateEmployee = (updatedEmployee) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee._id === updatedEmployee._id ? updatedEmployee : employee,
      ),
    );
  };

  const openUpdateForm = (employee) => {
    setSelectedEmployee(employee);
    setUpdateFormVisible(true);
  };

  const handleRowClick = (id) => {
    setIsId(id);
  };
  console.log(isId);
  const onBackToList = () => {
    setIsId("");
  };
  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-gray-50">
      {!isId && (
        <div className="w-full p-6 bg-white rounded-lg shadow-lg max-w-7xl">
          <div className="mb-4 text-2xl font-bold text-center">
            Quản lý nhân viên
          </div>

          {/* Search and Filter */}
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm nhân viên..."
              className="p-2 mb-4 border rounded dark:bg-gray-800 dark:text-white"
            />
            <select
              className="h-10 px-4 border dark:bg-gray-800 dark:text-white"
              value={isActive}
              onChange={(e) => setIsActive(e.target.value)}
            >
              <option value="">Tất cả (Khả dụng)</option>
              <option value="true">Khả dụng</option>
              <option value="false">Không khả dụng</option>
            </select>
            <select
              className="h-10 px-4 border dark:bg-gray-800 dark:text-white"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            >
              <option value="">Tất cả (Vai trò)</option>
              <option value="manager">Quản lý</option>
              <option value="chef">Đầu bếp</option>
              <option value="waiter">Phục vụ</option>
              <option value="cleaner">Dọn dẹp</option>
              <option value="cashier">Thu ngân</option>
            </select>
            <button
              onClick={() => setAddFormVisible(true)}
              className="px-4 py-2 text-white bg-blue-500 rounded-full hover:bg-blue-600"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>

          {/* Employee Table */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loading />
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow-md">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-3 text-left">Tên nhân viên</th>
                    <th className="px-4 py-3 text-center">Số điện thoại</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-center">Vai trò</th>
                    <th className="px-4 py-3 text-center">Ngày tạo</th>
                    <th className="px-4 py-3 text-center">Ngày cập nhật</th>
                    <th className="px-4 py-3 text-center">Hoạt động</th>
                    <th className="px-4 py-3 text-center">Chỉnh sửa</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr
                      key={employee._id}
                      className="border-b cursor-pointer hover:bg-gray-100"
                      onClick={() => handleRowClick(employee._id)}
                    >
                      <td className="px-4 py-4 font-bold">{employee.name}</td>
                      <td className="px-4 py-4 text-center">
                        {employee.phone}
                      </td>
                      <td className="px-4 py-4">{employee.email}</td>
                      <td className="px-4 py-4 text-center">
                        {employee.position}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {new Date(employee.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {new Date(employee.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-2xl text-center">
                        <FontAwesomeIcon
                          icon={
                            employee.isActive === true
                              ? faToggleOn
                              : faToggleOff
                          }
                          className={
                            employee.isActive === true
                              ? "cursor-pointer text-green-500"
                              : "cursor-pointer text-gray-400"
                          }
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering row click
                            toggleIsActive(employee._id);
                          }}
                        />
                      </td>
                      <td className="px-4 py-4 text-xl text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering row click
                            openUpdateForm(employee);
                          }}
                          className="px-3 py-1 text-blue-400 rounded-md hover:bg-slate-300"
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Add Employee Form */}
          {isAddFormVisible && (
            <AddEmployee
              onClose={() => setAddFormVisible(false)}
              onAddEmployee={handleAddEmployee}
            />
          )}

          {/* Update Employee Form */}
          {isUpdateFormVisible && (
            <UpdateEmployee
              employee={selectedEmployee}
              onClose={() => setUpdateFormVisible(false)}
              onUpdateEmployee={handleUpdateEmployee}
            />
          )}
        </div>
      )}
      {/* Employee Details */}
      {isId && <EmployeeDetails id={isId} onBackToList={onBackToList} />}
    </div>
  );
};

export default ManageEmployee;
