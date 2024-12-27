import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBasketShopping } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const ModalProduct = ({
  selectedProduct,
  quantity,
  setQuantity,
  onClose,
  refreshCart,
}) => {
  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setQuantity("");
    } else {
      const numericValue = parseInt(value, 10);
      if (!isNaN(numericValue) && numericValue >= 1) {
        setQuantity(numericValue);
      }
    }
  };

  const handleBlur = () => {
    if (quantity === "") {
      setQuantity(1);
    }
  };

  const handleAddToCart = () => {
    // Lấy giỏ hàng tạm thời từ localStorage
    const tempCart = JSON.parse(localStorage.getItem("tempCart")) || [];

    // Kiểm tra nếu sản phẩm đã có trong giỏ
    const existingItem = tempCart.find(
      (item) => item.productId === selectedProduct._id,
    );
    if (existingItem) {
      existingItem.quantity += quantity; // Cập nhật số lượng
    } else {
      // Thêm sản phẩm mới vào giỏ hàng
      tempCart.push({
        productId: selectedProduct._id,
        name: selectedProduct.name,
        img: selectedProduct.image,
        price: selectedProduct.sell_price,
        quantity,
      });
      toast.success("Thêm vào giỏ hàng thành công");
    }

    // Lưu giỏ hàng vào localStorage
    localStorage.setItem("tempCart", JSON.stringify(tempCart));

    // Optional: Gọi hàm refresh giỏ hàng
    if (refreshCart) {
      refreshCart();
    }

    // Đóng Modal
    onClose();
  };

  return (
    <div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50">
      <div className="relative flex w-[90%] max-w-[900px] flex-col overflow-hidden rounded-lg bg-white shadow-lg md:h-[435px] md:flex-row md:items-center md:justify-between">
        {/* Left Section */}
        <div className="flex w-full items-center justify-center p-5 md:w-1/2">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            className="max-h-[400px] max-w-full object-contain"
          />
        </div>

        {/* Right Section */}
        <div className="flex w-full flex-col gap-4 p-5 md:mb-auto md:mr-10 md:mt-auto md:w-1/2">
          <h1 className="flex flex-col text-left text-4xl font-bold text-[#00561e] md:items-start md:pb-6">
            {selectedProduct.name}
          </h1>
          <p className="flex flex-col items-center gap-2 md:flex-row">
            <span className="text-3xl font-bold text-[#663402]">
              {selectedProduct.sell_price.toLocaleString()}đ
            </span>
            {selectedProduct.price !== selectedProduct.sell_price && (
              <span className="price-old ml-2 text-xl font-bold text-[#999] line-through">
                {selectedProduct.price.toLocaleString()} đ
              </span>
            )}
          </p>
          <div className="h-[1px] w-full bg-gray-300"></div>
          <div className="w-full">
            <span className="flex flex-col items-center text-lg font-bold text-[#663402] md:items-start">
              Số lượng:
            </span>
            <div className="mt-2 flex items-center justify-center gap-2 md:justify-start">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-gray-100 text-xl font-bold transition hover:bg-gray-200"
                onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
              >
                -
              </button>
              <input
                type="text"
                value={quantity}
                onChange={handleQuantityChange}
                onBlur={handleBlur}
                className="h-9 w-16 rounded-lg border border-gray-300 text-center"
              />
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-gray-100 text-xl font-bold transition hover:bg-gray-200"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                +
              </button>
            </div>
          </div>
          <button
            className="mt-4 h-14 w-full rounded-full bg-gradient-to-r from-[#00864a] to-[#925802] text-2xl font-bold text-white transition-transform duration-200 hover:scale-95"
            onClick={handleAddToCart}
          >
            <FontAwesomeIcon icon={faBasketShopping} /> Thêm vào giỏ
          </button>
          <button
            className="absolute right-6 top-4 text-4xl text-gray-400 hover:text-gray-700"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalProduct;
