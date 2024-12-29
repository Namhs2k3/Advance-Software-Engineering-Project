import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

const SidebarCart = ({ isOpen, onClose, selectedTable }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (selectedTable && isOpen) {
      const fetchCart = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/tables/${selectedTable._id}`,
          );
          if (response.data.success) {
            setCart(response.data.data.cart); // Ensure you're getting the cart data properly
          }
        } catch (error) {
          console.error("Error fetching table data", error);
        }
      };

      fetchCart();
    }
  }, [isOpen, selectedTable]);

  const handleQuantityChange = async (id, value) => {
    const updatedCart = cart.map((item) =>
      item._id === id
        ? { ...item, quantity: Math.max(item.quantity + value, 1) }
        : item,
    );

    const updatedItem = updatedCart.find((item) => item._id === id);
    setCart(updatedCart);

    if (updatedItem) {
      await updateQuantityAPI(updatedItem.product._id, updatedItem.quantity);
    }
  };


  const handleInputChange = (id, e) => {
    const value = e.target.value;

    // Kiểm tra giá trị trống hoặc không hợp lệ
    if (value === "" || isNaN(parseInt(value, 10))) {
      setCart((prevItems) =>
        prevItems.map((item) =>
          item._id === id ? { ...item, quantity: "" } : item,
        ),
      );
    } else {
      const numericValue = Math.max(parseInt(value, 10), 1); // Giá trị tối thiểu là 1
      setCart((prevItems) =>
        prevItems.map((item) =>
          item._id === id ? { ...item, quantity: numericValue } : item,
        ),
      );
    }
  };


  const handleBlur = async (id) => {
    const updatedItem = cart.find((item) => item._id === id);

    if (updatedItem && (!updatedItem.quantity || isNaN(updatedItem.quantity))) {
      updatedItem.quantity = 1; // Giá trị mặc định là 1
      setCart([...cart]);
    }

    if (updatedItem) {
      await updateQuantityAPI(updatedItem.product._id, updatedItem.quantity);
    }
  };

  const handleRemoveItem = async (id) => {
    const productId = cart.find((item) => item._id === id)?.product._id;

    console.log("Selected Table ID:", selectedTable._id);
    console.log("Product ID to remove:", productId);

    if (!productId) {
      console.error("Product ID not found!");
      return;
    }

    // Cập nhật giỏ hàng cục bộ trước khi gửi yêu cầu xóa
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart); // Cập nhật giỏ hàng cục bộ ngay lập tức

    try {
      await axios.put(
        `http://localhost:5000/api/tables/${selectedTable._id}/removeProduct`,
        { productId },
      );
      // Không cần cập nhật lại giỏ hàng từ backend vì bạn đã có giỏ hàng cục bộ
    } catch (error) {
      console.error("Error removing product from cart", error);
      // Nếu có lỗi, khôi phục lại giỏ hàng cũ (nếu cần)
      setCart(cart);
    }
  };


  const updateQuantityAPI = async (productId, newQuantity) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/tables/${selectedTable._id}/updateProductQuantity`,
        { productId, quantity: newQuantity },
      );

      if (response.data.success) {
        setCart((prevCart) =>
          prevCart.map((item) =>
            item.product._id === productId
              ? { ...item, quantity: newQuantity }
              : item,
          ),
        );
      } else {
        console.error(
          "Failed to update product quantity:",
          response.data.message,
        );
      }
    } catch (error) {
      console.error("Error updating product quantity:", error);
    }
  };




  const handleCheckout = () => {
    navigate("/payment"); // Chuyển hướng đến trang Payment
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
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
        className={`fixed left-0 top-0 z-50 h-full w-[500px] bg-white shadow-lg transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex justify-between border-b border-gray-300 p-4">
          <h2 className="font-josefin text-3xl font-bold">Giỏ hàng</h2>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center text-xl font-semibold text-gray-500">
              Chưa gọi món
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item._id}
                className="flex items-center border-b border-gray-200 py-4"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-24 w-24 rounded-md object-cover"
                />
                <div className="ml-3 flex-1">
                  <h4 className="line-clamp-2 w-[250px] font-josefin text-2xl font-bold text-black">
                    {item.product.name}
                  </h4>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      className="flex h-8 w-8 items-center justify-center rounded-full border text-black hover:bg-gray-200"
                      onClick={() => handleQuantityChange(item._id, -1)}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={(e) => handleInputChange(item._id, e)}
                      onBlur={() => handleBlur(item._id)}
                      className="h-8 w-12 rounded-md border text-center"
                    />
                    <button
                      className="flex h-8 w-8 items-center justify-center rounded-full border text-black hover:bg-gray-200"
                      onClick={() => handleQuantityChange(item._id, 1)}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                </div>
                <div className="relative pr-2 text-right">
                  <button
                    className="text-2xl text-gray-500 hover:text-red-700"
                    onClick={() => handleRemoveItem(item._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <span className="line-clamp-1 block pt-10 font-josefin text-lg font-bold text-black">
                    {(item.quantity * item.product.sell_price).toLocaleString()}₫
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-300 p-4">
          <div className="mb-4 flex justify-between">
            <span className="font-josefin text-2xl font-bold">Tổng cộng:</span>
            <span className="font-josefin text-2xl font-bold text-gray-800">
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
