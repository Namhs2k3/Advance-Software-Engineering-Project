import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faXmark } from "@fortawesome/free-solid-svg-icons";
import imgfood1 from "../../../../../backend/assets/Screenshot_2024-11-18_231527-removebg-preview.png";

// Data Placeholder
const orderDataPlaceholder = [
  {
    _id: "order12345",
    name: "Nguyen Van A",
    createdAt: "2024-12-25T10:30:00.000Z",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    number: "0123456789",
    email: "nguyenvana@example.com",
    note: "Giao hàng trước 12h trưa",
    paymentMethod: "COD",
    discount: 10000,
    finalPrice: 200000,
    cart: [
      {
        product: {
          _id: "product001",
          name: "Bánh Mì Thịt Nướng",
          image: imgfood1,
          price: 50000,
        },
        quantity: 2,
        totalPrice: 100000,
      },
      {
        product: {
          _id: "product002",
          name: "Cà Phê Sữa Đá",
          image: imgfood1,
        },
        quantity: 2,
        totalPrice: 60000,
      },
      {
        product: {
          _id: "product002",
          name: "Cà Phê Sữa Đá",
          image: imgfood1,
        },
        quantity: 2,
        totalPrice: 60000,
      },
      {
        product: {
          _id: "product002",
          name: "Cà Phê Sữa Đá",
          image: imgfood1,
        },
        quantity: 2,
        totalPrice: 60000,
      },
    ],
  },
  {
    _id: "order67890",
    name: "Tran Thi B",
    createdAt: "2024-12-24T08:45:00.000Z",
    address: "456 Đường DEF, Quận 7, TP.HCM",
    number: "0987654321",
    email: "tranthib@example.com",
    note: "",
    paymentMethod: "Online Payment",
    discount: 0,
    finalPrice: 150000,
    cart: [
      {
        product: {
          _id: "product003",
          name: "Phở Bò Tái",
          image: imgfood1,
          price: 75000,
        },
        quantity: 2,
        totalPrice: 150000,
      },
    ],
  },
];

// Modal Component
const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="relative h-[570px] w-full max-w-7xl rounded-lg bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
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
            <div className="w-2/5">
              <label className="mb-2 block font-josefin text-2xl font-bold">
                Tên khách hàng
              </label>
              <input
                type="text"
                name="name"
                value={order.name}
                className="mb-4 w-full rounded-md border border-gray-300 p-2"
                disabled
              />

              <label className="mb-2 block font-josefin text-2xl font-bold">
                Số điện thoại
              </label>
              <input
                type="text"
                name="number"
                value={order.number}
                className="mb-4 w-full rounded-md border border-gray-300 p-2"
                disabled
              />

              <label className="mb-2 block font-josefin text-2xl font-bold">
                Địa chỉ
              </label>
              <input
                type="text"
                name="address"
                value={order.address}
                className="mb-4 w-full rounded-md border border-gray-300 p-2"
                disabled
              />

              <label className="mb-2 block font-josefin text-2xl font-bold">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={order.email}
                className="mb-4 w-full rounded-md border border-gray-300 p-2"
                disabled
              />
            </div>

            {/* Center Section - Payment Method and Note */}
            <div className="w-1/3">
              <label className="mb-2 block font-josefin text-2xl font-bold">
                Phương thức thanh toán
              </label>
              <select
                name="paymentMethod"
                value={order.paymentMethod}
                className="mb-4 w-1/2 rounded-md border border-gray-300 p-2"
                disabled
              >
                <option value="Online Payment">Online Payment</option>
                <option value="COD">COD</option>
              </select>

              <label className="mb-2 block font-josefin text-2xl font-bold">
                Ghi chú
              </label>
              <textarea
                name="note"
                value={order.note || "Không có ghi chú"}
                className="mb-4 max-h-64 w-full overflow-y-auto rounded-md border border-gray-300 p-2"
                disabled
              />
            </div>

            {/* Right Section - Product List */}
            <div className="w-1/3">
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
                          Số lượng: {item.quantity}
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
                  {order.discount.toLocaleString()} đ
                </span>
              </div>
              <div className="mt-2 flex justify-between font-bold">
                <span className="font-josefin text-xl">Tổng cộng:</span>
                <span className="font-josefin text-xl">
                  {order.finalPrice.toLocaleString()} đ
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Component
const OrderHistory = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="order-history">
      <h2 className="mb-4 text-2xl font-bold">Lịch Sử Đơn Hàng</h2>
      {orderDataPlaceholder.length === 0 ? (
        <div>Bạn chưa có đơn hàng nào.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-center">Email</th>
                <th className="px-4 py-3 text-center">
                  Phương thức thanh toán
                </th>
                <th className="px-4 py-3 text-center">Ngày tạo đơn</th>
                <th className="px-4 py-3 text-center">Xem hoá đơn</th>
              </tr>
            </thead>
            <tbody>
              {orderDataPlaceholder.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="px-4 py-6 text-center">{order.email}</td>
                  <td className="px-4 py-6 text-center">
                    {order.paymentMethod}
                  </td>
                  <td className="px-4 py-6 text-center">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-6 text-center">
                    <div className="group relative">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="rounded-full px-3 py-1 text-blue-400 hover:bg-slate-300"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <span className="absolute bottom-full left-1/2 mb-3 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-gray-800 px-2 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                        Xem chi tiết
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default OrderHistory;
