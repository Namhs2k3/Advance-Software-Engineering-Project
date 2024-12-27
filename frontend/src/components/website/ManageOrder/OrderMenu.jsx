import { useState, useEffect } from "react";
import ModalProduct from "../../ModalProduct"; // Import ModalProduct component
import axios from "axios";
import Loading from "../Loading";

const OrderMenu = () => {
  const [activeCategory, setActiveCategory] = useState("TẤT CẢ");
  const [categories, setCategories] = useState(["TẤT CẢ"]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/mainPages/activeCategories",
        );
        const categoryData = response.data.data.map(
          (category) => category.name,
        );
        setCategories(["TẤT CẢ", ...categoryData]);
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/mainPages/activeProducts",
        );
        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const filteredProducts =
    activeCategory === "TẤT CẢ"
      ? products.filter((item) => item.category?.isActive === 1)
      : products.filter((item) => item.category.name === activeCategory);

  return (
    <div className="p-5 text-center">
      <h1 className="mb-4 text-4xl font-bold">
        Thực đơn Bamos<span className="text-[#C63402]">Coffee</span>
      </h1>

      {/* Danh sách danh mục */}
      <div className="flex justify-center font-bold">
        {categories.map((category) => (
          <button
            key={category}
            className={`mt-8 border-[0.5px] border-gray-300 px-5 py-2 text-base transition-all ease-linear ${
              activeCategory === category
                ? "border-[#633c02] bg-[#633c02] text-white"
                : "bg-white text-gray-800"
            } hover:bg-[#d88453]`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Danh sách sản phẩm */}
      {isLoading ? (
        <div className="flex h-[300px] items-center justify-center">
          <Loading />
        </div>
      ) : (
        <div className="mx-auto h-[500px] max-w-3xl overflow-y-scroll">
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((item) => (
              <div
                key={item._id}
                className="flex min-h-[150px] cursor-pointer items-center gap-4 border p-4 hover:bg-gray-100"
                onClick={() => handleOpenModal(item)}
              >
                {/* Ảnh sản phẩm */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-[100px] w-[100px] object-cover"
                />

                {/* Thông tin sản phẩm */}
                <div className="flex-1">
                  <h6 className="text-lg font-bold text-[#00561e]">
                    {item.name}
                  </h6>
                  <p className="text-sm font-bold text-[#925802]">
                    {item.sell_price.toLocaleString()} đ
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal sản phẩm */}
      {selectedProduct && (
        <ModalProduct
          selectedProduct={selectedProduct}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default OrderMenu;
