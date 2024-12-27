import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPen,
  faToggleOn,
  faToggleOff,
} from "@fortawesome/free-solid-svg-icons";
import AddAccount from "./AddAccount";
import UpdateAccount from "./UpdateAccount";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Loading from "../../website/Loading";

const ManageAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddFormVisible, setAddFormVisible] = useState(false);
  const [isUpdateFormVisible, setUpdateFormVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true); // Bắt đầu hiển thị loading
      try {
        const response = await axios.get("http://localhost:5000/api/accounts", {
          withCredentials: true,
        });
        setAccounts(response.data.data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setLoading(false); // Kết thúc loading sau khi lấy dữ liệu xong
      }
    };

    fetchAccounts();
  }, []);

  const filteredAccounts = accounts.filter(
    (account) =>
      account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.gmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleIsActive = async (id) => {
    try {
      const updatedAccounts = accounts.map((account) =>
        account._id === id
          ? { ...account, isActive: account.isActive === 1 ? 2 : 1 }
          : account,
      );
      setAccounts(updatedAccounts);

      // Gửi yêu cầu cập nhật API
      await axios.put(`http://localhost:5000/api/accounts/${id}`, {
        isActive: updatedAccounts.find((p) => p._id === id).isActive,
      });
    } catch (error) {
      console.error("Error updating display type:", error);
    }
  };

  const handleAddAccount = (newAccount) => {
    axios
      .post("http://localhost:5000/api/accounts", newAccount, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`, // Lấy token từ localStorage (nếu có)
        },
        withCredentials: true,
      })
      .then((response) => {
        setAccounts([...accounts, response.data.data]);
        toast.success("Thêm nhân viên thành công");
      })
      .catch((error) => {
        console.error("Error adding account:", error);
        toast.error(error.response.data.message || "Có lỗi xảy ra");
      });
  };

  const handleUpdateAccount = (updatedAccount) => {
    setAccounts((prevAccounts) =>
      prevAccounts.map((account) =>
        account._id === updatedAccount._id ? updatedAccount : account,
      ),
    );
  };

  const openUpdateForm = (account) => {
    setSelectedAccount(account);
    setUpdateFormVisible(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-7xl rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 text-center text-2xl font-bold">
          Quản lý tài khoản
        </div>

        <div className="mb-4 flex items-center justify-between">
          <input
            type="text"
            placeholder="Tìm kiếm bằng tên, email và vai trò"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-72 rounded-md border border-gray-300 p-2"
          />
          <div className="group relative">
            <button
              onClick={() => setAddFormVisible(true)}
              className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-gray-800 px-4 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              Tạo tài khoản
            </span>
          </div>
        </div>
        {loading ? (
          // Hiển thị phần loading nếu dữ liệu chưa được tải
          <div className="flex h-[255px] w-full items-center justify-center lg:h-[300px]">
            <Loading /> {/* Hiển thị Loading khi đang tải dữ liệu */}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left">Tên người dùng</th>
                  <th className="px-4 py-3 text-center">Số điện thoại</th>
                  <th className="px-4 py-3 text-left">Gmail</th>
                  <th className="px-4 py-3 text-center">Vai trò</th>
                  <th className="px-4 py-3 text-center">Ngày tạo</th>
                  <th className="px-4 py-3 text-center">Ngày cập nhật</th>
                  <th className="px-4 py-3 text-center">Hoạt động</th>
                  <th className="px-4 py-3 text-center">Chỉnh sửa</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((account) => (
                  <tr key={account._id} className="border-b">
                    <td className="px-4 py-6 font-bold">{account.username}</td>
                    <td className="px-4 py-6 text-center">{account.numbers}</td>
                    <td className="px-4 py-6">{account.gmail}</td>
                    <td className="px-4 py-6 text-center">{account.role}</td>
                    <td className="px-4 py-6 text-center">
                      {new Date(account.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-6 text-center">
                      {new Date(account.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-6 text-center text-2xl">
                      <div className="group relative">
                        <FontAwesomeIcon
                          icon={
                            account.isActive === 1 ? faToggleOn : faToggleOff
                          }
                          className={
                            account.isActive === 1
                              ? "cursor-pointer text-green-500"
                              : "cursor-pointer text-gray-400"
                          }
                          onClick={() => toggleIsActive(account._id)}
                        />
                        <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-gray-800 px-2 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                          Bật hoạt động
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-6 text-center text-xl">
                      <div className="group relative">
                        <button
                          onClick={() => openUpdateForm(account)}
                          className="rounded-md px-3 py-1 text-blue-400 hover:bg-slate-300"
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </button>
                        <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-gray-800 px-2 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                          Chỉnh sửa
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isAddFormVisible && (
        <AddAccount
          onClose={() => setAddFormVisible(false)}
          onAddAccount={handleAddAccount}
        />
      )}

      {isUpdateFormVisible && (
        <UpdateAccount
          account={selectedAccount}
          onClose={() => setUpdateFormVisible(false)}
          onUpdateAccount={handleUpdateAccount}
        />
      )}
    </div>
  );
};

export default ManageAccount;
