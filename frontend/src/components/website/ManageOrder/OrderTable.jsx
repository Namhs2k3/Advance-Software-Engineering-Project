import { useState, useEffect } from "react";
import SidebarCart from "./SidebarCart";
import OrderMenu from "./OrderMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import axios from "axios";

const OrderTable = () => {
  const [tables, setTables] = useState([]);

  const [selectedTable, setSelectedTable] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Lấy danh sách bàn từ API khi component render
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tables"); // Cập nhật URL API
        if (response.data.success) {
          setTables(response.data.data); // Lưu danh sách bàn vào state
        } else {
          toast.error("Không thể lấy danh sách bàn.");
        }
      } catch (error) {
        console.error("Error fetching tables:", error);
        toast.error("Có lỗi xảy ra khi lấy danh sách bàn.");
      }
    };

    fetchTables();
  }, []);

  // Xử lý thay đổi trạng thái bàn
  const handleTableClick = (table) => {
    if (selectedTable?._id === table._id) {
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
  const handleAddTable = async () => {
    try {
      const newTable = {
        name: `${tables.length + 1}`,
        CartItem: [],
        status: 1,
      };

      // Gửi yêu cầu POST đến API để tạo bàn mới
      const response = await axios.post(
        "http://localhost:5000/api/tables",
        newTable,
      ); // Cập nhật URL API phù hợp

      if (response.data.success) {
        // Cập nhật danh sách bàn khi bàn mới được tạo thành công
        setTables([...tables, response.data.data]);
        setIsModalOpen(false);
        toast.success("Bàn mới đã được thêm thành công!"); // Thông báo thành công
      }
    } catch (error) {
      console.error("Error creating table:", error);
      toast.error("Có lỗi xảy ra khi thêm bàn mới."); // Thông báo lỗi
    }
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
          <div className="grid max-h-[500px] grid-cols-3 items-start gap-4">
            {tables.map((table) => (
              <div
                key={table._id} // Sử dụng _id từ MongoDB
                className={`flex h-20 w-48 cursor-pointer items-center justify-center border text-center font-josefin text-2xl font-bold ${
                  selectedTable?._id === table._id
                    ? "bg-[#633c02] text-white" // Màu nâu đậm khi bàn được chọn
                    : table.status === 2
                      ? "bg-[#dea58d] text-gray-800" // Màu nâu nhạt khi bàn có sản phẩm
                      : "bg-white text-gray-800" // Màu trắng khi bàn trống
                } hover:bg-[#d88453]`}
                onClick={() => handleTableClick(table)} // Chọn hoặc bỏ chọn bàn
              >
                Bàn {table.name}
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
