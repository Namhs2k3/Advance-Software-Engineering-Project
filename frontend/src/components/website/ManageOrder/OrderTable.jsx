import { useState } from "react";
import SidebarCart from "./SidebarCart";
import OrderMenu from "./OrderMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify"; // Import toastify

const OrderTable = () => {
  const [tables, setTables] = useState([
    { id: 1, name: "Bàn 1", orders: [], status: 1 },
    { id: 2, name: "Bàn 2", orders: [], status: 1 },
    { id: 3, name: "Bàn 3", orders: [], status: 2 },
    { id: 4, name: "Bàn 4", orders: [], status: 1 },
    { id: 5, name: "Bàn 5", orders: [], status: 2 },
    { id: 6, name: "Bàn 6", orders: [], status: 2 },
    { id: 7, name: "Bàn 7", orders: [], status: 1 },
  ]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Xử lý thay đổi trạng thái bàn
  const handleTableClick = (table) => {
    if (selectedTable?.id === table.id) {
      setSelectedTable(null); // Nếu bàn đang được chọn, bỏ chọn
    } else {
      setSelectedTable(table); // Chọn bàn
    }
  };

  // Xử lý mở modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Xử lý đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Xử lý tạo bàn mới
  const handleAddTable = () => {
    const newTableId = tables.length + 1;
    const newTable = {
      id: newTableId,
      name: `Bàn ${newTableId}`,
      orders: [],
      status: 1,
    };
    setTables([...tables, newTable]);
    setIsModalOpen(false);
  };

  // Xử lý mở giỏ hàng
  const handleViewCart = () => {
    if (selectedTable) {
      setIsSidebarOpen(true); // Mở giỏ hàng nếu đã chọn bàn
    } else {
      toast.error("Hãy chọn bàn để xem giỏ hàng!"); // Hiển thị toast nếu chưa chọn bàn
    }
  };

  return (
    <div className="flex">
      {/* Bên trái: Danh sách bàn */}
      <div className="flex w-1/2 flex-col border-r border-gray-300 p-4">
        <h2 className="mb-4 text-2xl font-bold">Danh sách bàn</h2>
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-3 items-start gap-4">
            {tables.map((table) => (
              <div
                key={table.id}
                className={`flex h-20 w-48 cursor-pointer items-center justify-center border text-center font-josefin text-2xl font-bold ${
                  selectedTable?.id === table.id
                    ? "bg-[#633c02] text-white" // Màu nâu đậm khi bàn được chọn
                    : table.status === 2
                      ? "bg-[#dea58d] text-gray-800" // Màu nâu nhạt khi bàn có sản phẩm
                      : "bg-white text-gray-800" // Màu trắng khi bàn trống
                } hover:bg-[#d88453]`}
                onClick={() => handleTableClick(table)} // Chọn hoặc bỏ chọn bàn
              >
                {table.name}
              </div>
            ))}

            {/* Ô thêm bàn */}
            <div
              className="flex h-20 w-48 cursor-pointer items-center justify-center border bg-gray-100 text-center text-green-800 hover:bg-black hover:text-white"
              onClick={handleOpenModal}
            >
              <span className="text-3xl font-bold">
                <FontAwesomeIcon icon={faPlusCircle} />
              </span>
            </div>
          </div>
        </div>

        {/* Nút xem giỏ hàng */}
        <div className="flex">
          <button
            className="mx-4 mt-4 w-full bg-black py-3 text-lg font-bold text-white transition-transform duration-200 hover:scale-90"
            onClick={handleViewCart} // Gọi hàm kiểm tra chọn bàn và mở giỏ hàng
          >
            Xem giỏ hàng
          </button>
          <button className="mx-4 mt-4 w-full bg-black py-3 text-lg font-bold text-white transition-transform duration-200 hover:scale-90">
            Gửi món
          </button>
        </div>
      </div>

      {/* Bên phải: Thực đơn */}
      <div className="w-2/3">
        <OrderMenu selectedTable={selectedTable} />
      </div>

      {/* Sidebar Cart */}
      <SidebarCart
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Modal xác nhận */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex h-80 w-full max-w-2xl flex-col items-center justify-center space-y-4 rounded-lg bg-white p-6 shadow-lg">
            {/* Icon */}
            <span className="mb-4 text-5xl font-bold text-black">
              <FontAwesomeIcon icon={faCircleInfo} />
            </span>

            {/* Tiêu đề */}
            <h3 className="text-center font-oswald text-4xl font-bold text-gray-800">
              Bạn có muốn tạo thêm bàn mới?
            </h3>

            <span className="text-center font-josefin text-2xl font-bold text-gray-800">
              Bạn chỉ có thể xóa ở trang quản lý!!!
            </span>

            {/* Nút lựa chọn */}
            <div className="flex">
              <button
                className="mr-16 mt-4 bg-gray-300 px-14 pb-3 pt-4 text-xl font-bold text-gray-800 transition-transform duration-200 hover:scale-90"
                onClick={handleCloseModal}
              >
                Không
              </button>
              <button
                className="mt-4 bg-[#633c02] px-14 pb-3 pt-4 text-xl font-bold text-white transition-transform duration-200 hover:scale-90"
                onClick={handleAddTable}
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTable;
