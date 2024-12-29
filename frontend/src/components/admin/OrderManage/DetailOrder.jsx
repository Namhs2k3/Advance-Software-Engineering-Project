import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast } from "react-toastify";

const DetailOrder = ({ order, onClose, onOrderUpdated }) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    number: "",
    email: "",
    paymentMethod: "",
    discount: "",
  });

  // Lấy thông tin đơn hàng vào state khi đơn hàng thay đổi
  useEffect(() => {
    if (order) {
      setCustomerInfo({
        name: order.name || "",
        number: order.number || "",
        email: order.email || "",
        paymentMethod: order.paymentMethod || "",
        discount: order.discount || "",
      });
    }
  }, [order]);

  // Xử lý thay đổi trong các input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý lưu thông tin
  const handleSave = async () => {
    try {
      const { name, number, } = customerInfo;
      const response = await axios.put(
        `http://localhost:5000/api/orders/${order._id}`,
        {
          name,
          number,
        },
      );
      toast.success("Cập nhật thông tin thành công!");
      onOrderUpdated(); // Gọi callback để reload danh sách đơn hàng trong ManageOrder
      onClose(); // Đóng modal
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      toast("Có lỗi xảy ra khi cập nhật thông tin!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="relative h-[570px] w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-3 text-3xl text-gray-400 hover:text-black"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>

        {/* Order Details */}
        <h2 className="mb-8 text-center text-3xl font-bold">
          Chi tiết đơn hàng của{" "}
          <span className="text-[#c63c02]">{order.name}</span>
        </h2>

        <form>
          <div className="flex space-x-6">
            {/* Left Section - Customer Information */}
            <div className="w-1/2">
              <label className="mb-2 block font-josefin text-2xl font-bold">
                Tên khách hàng
              </label>
              <input
                type="text"
                name="name"
                value={customerInfo.name}
                onChange={handleInputChange}
                className="mb-4 w-full rounded-md border border-gray-300 p-2"
                // disabled // Khóa không cho chỉnh sửa
              />

              <label className="mb-2 block font-josefin text-2xl font-bold">
                Số điện thoại
              </label>
              <input
                type="text"
                name="number"
                value={customerInfo.number}
                onChange={handleInputChange}
                className="mb-4 w-full rounded-md border border-gray-300 p-2"
              />

              <label className="mb-2 block font-josefin text-2xl font-bold">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={customerInfo.email}
                onChange={handleInputChange}
                className="mb-4 w-full rounded-md border border-gray-300 p-2"
                disabled
              />
              <label className="mb-2 block font-josefin text-2xl font-bold">
                Phương thức thanh toán
              </label>
              <select
                name="paymentMethod"
                value={customerInfo.paymentMethod}
                className="mb-4 w-1/2 rounded-md border border-gray-300 p-2"
                disabled // Khóa không cho chỉnh sửa
              >
                <option value="Online Payment">Online Payment</option>
                <option value="COD">COD</option>
              </select>

              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded bg-blue-500 px-5 py-2 font-josefin text-xl text-white transition-transform duration-200 hover:scale-95"
                >
                  Lưu thông tin
                </button>
              </div>
            </div>

            {/* Right Section - Product List */}
            <div className="w-1/2">
              <h3 className="mb-2 text-xl font-semibold">Chi tiết sản phẩm</h3>
              <div className="max-h-80 space-y-4 overflow-y-auto">
                {order.cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center rounded-lg border p-4 shadow-sm"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="mr-4 h-20 w-auto rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-josefin text-lg font-semibold text-[#00561e]">
                        {item.product.name}
                      </p>
                      <div className="mt-5 flex justify-between">
                        <p className="font-josefin">
                          số lượng: {item.quantity}
                        </p>
                        <p className="font-josefin">
                          Tổng: {item.totalPrice.toLocaleString()} ₫
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex justify-between font-bold">
                <span className="font-josefin text-lg">Giảm giá:</span>
                <span className="font-josefin text-lg">
                  <p>{order.discount.toLocaleString()} ₫</p>
                </span>
              </div>
              {/* Total Price */}
              <div className="mt-2 flex justify-between font-bold">
                <span className="font-josefin text-xl">Tổng cộng:</span>
                <span className="font-josefin text-xl">
                  <p>{order.finalPrice.toLocaleString()} ₫</p>
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DetailOrder;
