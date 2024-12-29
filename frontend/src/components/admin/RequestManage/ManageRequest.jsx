import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import UpdateRequest from "./UpdateRequest";

const ManageRequest = () => {
  const [tables, setTables] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUpdateFormVisible, setUpdateFormVisible] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/tables/request",
        );
        if (response.data.success) {
          setTables(response.data.data);
        } else {
          console.error("Failed to fetch tables");
        }
      } catch (error) {
        console.error("Error fetching data from API:", error.message);
      }
    };

    fetchTables();
  }, []);

  const filteredTables = tables.filter((table) =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const openUpdateForm = (table) => {
    console.log("Selected table data:", table);
    setSelectedTable(table);
    setUpdateFormVisible(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-5xl rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 text-center text-2xl font-bold">
          Quản lý yêu cầu bàn
        </div>

        <div className="mb-4 flex items-center justify-between">
          <input
            type="text"
            placeholder="Tìm kiếm bằng tên bàn"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-72 rounded-md border border-gray-300 p-2"
          />
          <button
            onClick={() => setUpdateFormVisible(true)}
            className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-center">Tên Bàn</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
                <th className="px-4 py-3 text-center">Ngày tạo</th>
                <th className="px-4 py-3 text-center">Ngày cập nhật</th>
                <th className="px-4 py-3 text-center">Chỉnh sửa</th>
              </tr>
            </thead>
            <tbody>
              {filteredTables.map((table) => (
                <tr key={table._id} className="border-b">
                  <td className="px-4 py-6 text-center font-bold">
                    {table.name}
                  </td>
                  <td className="px-4 py-6 text-center">{table.request}</td>
                  <td className="px-4 py-6 text-center">
                    {new Date(table.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-6 text-center">
                    {new Date(table.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-6 text-center text-xl">
                    <button
                      onClick={() => openUpdateForm(table)}
                      className="rounded-full px-3 py-1 text-blue-400 hover:bg-slate-300"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isUpdateFormVisible && selectedTable && (
        <UpdateRequest
          order={selectedTable}
          onClose={() => setUpdateFormVisible(false)}
        />
      )}
    </div>
  );
};

export default ManageRequest;
