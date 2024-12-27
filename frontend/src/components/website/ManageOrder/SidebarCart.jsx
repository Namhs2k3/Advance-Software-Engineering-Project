import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import img2 from "../../../../../backend/assets/20200003_2.png";

const SidebarCart = ({ isOpen, onClose }) => {
  const navigate = useNavigate(); // Sử dụng useNavigate

  const [cartItems, setCartItems] = useState([
    {
      productId: "1",
      name: "Cà phê sữa đá",
      img: img2,
      price: 20000,
      quantity: 2,
    },
    {
      productId: "2",
      name: "Trà sữa trân châu",
      img: img2,
      price: 30000,
      quantity: 1,
    },
    {
      productId: "3",
      name: "Trà đào cam sả",
      img: img2,
      price: 40000,
      quantity: 1,
    },
  ]);

  const handleQuantityChange = (id, value) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === id
          ? { ...item, quantity: Math.max(item.quantity + value, 1) }
          : item,
      ),
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.productId !== id),
    );
  };

  const handleCheckout = () => {
    navigate("/payment"); // Chuyển hướng đến trang Payment
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-50 h-full w-96 bg-white shadow-lg transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex justify-between border-b border-gray-300 p-4">
          <h2 className="font-josefin text-3xl font-bold">Giỏ hàng</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <FontAwesomeIcon icon={faTimes} size="2xl" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.map((item) => (
            <div
              key={item.productId}
              className="flex items-center gap-4 border-b border-gray-200 py-4"
            >
              <img
                src={item.img}
                alt={item.name}
                className="h-20 w-20 rounded-md object-cover"
              />
              <div className="flex-1">
                <h4 className="font-josefin text-2xl font-bold text-black">
                  {item.name}
                </h4>
                <p className="text-lg font-semibold text-black">
                  {item.price.toLocaleString()} đ
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-full border text-black hover:bg-gray-200"
                    onClick={() => handleQuantityChange(item.productId, -1)}
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                  <input
                    type="text"
                    value={item.quantity}
                    readOnly
                    className="h-8 w-12 rounded-md border text-center"
                  />
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-full border text-black hover:bg-gray-200"
                    onClick={() => handleQuantityChange(item.productId, 1)}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </div>
              <button
                className="text-2xl text-gray-500 hover:text-red-700"
                onClick={() => handleRemoveItem(item.productId)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-300 p-4">
          <div className="mb-4 flex justify-between">
            <span className="text-lg font-bold">Tổng cộng:</span>
            <span className="text-lg font-bold text-gray-800">
              {totalPrice.toLocaleString()} đ
            </span>
          </div>
          <button
            className="w-full bg-black py-3 text-lg font-bold text-white transition-transform duration-200 hover:scale-90"
            onClick={handleCheckout} // Thêm sự kiện onClick
          >
            Thanh toán
          </button>
        </div>
      </div>
    </>
  );
};

export default SidebarCart;
