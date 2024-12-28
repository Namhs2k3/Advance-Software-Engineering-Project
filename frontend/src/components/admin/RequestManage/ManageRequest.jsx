import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import UpdateRequest from "./UpdateRequest"; // Assuming this is the new component with the progress bar
import img2 from "../../../../../backend/assets/20200003_2.png";

const ManageRequest = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      name: " 1",
      status: 1,
      activeStep: 0,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-02",
      items: [
        {
          name: "Cà phê",
          image: img2,
          quantity: 1,
        },
        {
          name: "Sữa đặc",
          image: img2,
          quantity: 1,
        },
        {
          name: "Sữa đặc",
          image: img2,
          quantity: 1,
        },
        {
          name: "Sữa đặc",
          image: img2,
          quantity: 1,
        },
        {
          name: "Sữa đặc",
          image: img2,
          quantity: 1,
        },
        {
          name: "Sữa đặc",
          image: img2,
          quantity: 1,
        },
      ],
    },
    {
      id: 2,
      name: " 2",
      status: 2,
      activeStep: 0,
      createdAt: "2024-01-03",
      updatedAt: "2024-01-04",
      items: [
        {
          name: "Trà sữa",
          image: img2,
          quantity: 2,
        },
      ],
    },
  ]);


  const [searchTerm, setSearchTerm] = useState("");
  const [isUpdateFormVisible, setUpdateFormVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter((order) =>
    order.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const openUpdateForm = (order) => {
    setSelectedOrder(order);
    setUpdateFormVisible(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-5xl rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 text-center text-2xl font-bold">
          Quản lý đơn gọi món
        </div>

        <div className="mb-4 flex items-center justify-between">
          <input
            type="text"
            placeholder="Tìm kiếm bằng tên"
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
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="px-4 py-6 font-bold text-center">{order.name}</td>
                  <td className="px-4 py-6 text-center">{order.activeStep}</td>
                  <td className="px-4 py-6 text-center">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-6 text-center">
                    {new Date(order.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-6 text-center text-xl">
                    <button
                      onClick={() => openUpdateForm(order)}
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

      {isUpdateFormVisible && selectedOrder && (
        <UpdateRequest
          order={selectedOrder}
          onClose={() => setUpdateFormVisible(false)}
        />
      )}
    </div>
  );
};

export default ManageRequest;
