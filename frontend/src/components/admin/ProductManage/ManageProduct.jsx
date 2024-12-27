import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPen,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import AddProduct from "./AddProduct";
import UpdateProduct from "./UpdateProduct";
import Loading from "../../website/Loading";

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tách riêng hàm fetchProducts để tái sử dụng
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/products"); // Đường dẫn API
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!showAddModal && !showUpdateModal) {
      fetchProducts();
    }
  }, [showAddModal, showUpdateModal]);

  const handleCreateProduct = async (product) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/products",
        product,
      );
      setProducts([...products, response.data.data]);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error creating product:", error.response.data.message);
    }
  };

  // Lọc sản phẩm theo từ khóa tìm kiếm
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Hàm toggle trạng thái display
  const toggleDisplayType = async (id) => {
    try {
      const updatedProducts = products.map((product) =>
        product._id === id
          ? { ...product, displayType: product.displayType === 1 ? 2 : 1 }
          : product,
      );
      setProducts(updatedProducts);

      // Gửi yêu cầu cập nhật API
      await axios.put(`http://localhost:5000/api/products/${id}`, {
        displayType: updatedProducts.find((p) => p._id === id).displayType,
      });
    } catch (error) {
      console.error("Error updating display type:", error);
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowUpdateModal(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-7xl rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 text-center text-2xl font-bold">
          Quản lý sản phẩm
        </div>

        {/* Tìm kiếm sản phẩm */}
        <div className="mb-4 flex items-center justify-between">
          <input
            type="text"
            placeholder="Tìm kiếm bằng tên hoặc thực đơn"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-72 rounded-md border border-gray-300 p-2"
          />
          <div className="group relative">
            <button
              onClick={() => setShowAddModal(true)}
              className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-gray-800 px-4 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              Tạo sản phẩm
            </span>
          </div>
        </div>

        {/* Component AddProduct */}
        {showAddModal && (
          <AddProduct
            showModal={showAddModal}
            setShowModal={setShowAddModal}
            onCreateProduct={handleCreateProduct}
          />
        )}

        {/* Component UpdateProduct */}
        {selectedProduct && showUpdateModal && (
          <UpdateProduct
            showModal={showUpdateModal}
            setShowModal={setShowUpdateModal}
            product={selectedProduct}
            onUpdateProduct={(updatedProduct) => {
              setProducts((prevProducts) =>
                prevProducts.map((p) =>
                  p._id === updatedProduct._id ? updatedProduct : p,
                ),
              );
              setShowUpdateModal(false);
            }}
          />
        )}

        {loading ? (
          // Hiển thị phần loading nếu dữ liệu chưa được tải
          <div className="flex h-[255px] w-full items-center justify-center lg:h-[400px]">
            <Loading /> {/* Hiển thị Loading khi đang tải dữ liệu */}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-center">Ảnh</th>
                  <th className="px-4 py-3 text-left">Tên sản phẩm</th>
                  <th className="px-4 py-3 text-center">Thực đơn</th>
                  <th className="px-4 py-3 text-center">Giá</th>
                  <th className="px-4 py-3 text-center">Giá giảm</th>
                  <th className="px-4 py-3 text-center">Ngày cập nhật</th>
                  <th className="px-4 py-3 text-center">Hoạt động</th>
                  <th className="px-4 py-3 text-center">Chỉnh sửa</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="border-b">
                    <td className="px-4 py-2">
                      <img
                        src={`${product.image}`}
                        alt={product.name}
                        className="h-20 w-auto rounded-md object-cover"
                      />
                    </td>
                    <td className="px-4 py-2 font-bold">{product.name}</td>
                    <td className="px-4 py-2 text-center">
                      {product.category?.name || "chưa có"}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {product.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {product.sell_price.toLocaleString()}
                    </td>
                    <td className="px-4 py-6 text-center">
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="group relative">
                        <FontAwesomeIcon
                          icon={product.displayType === 1 ? faEye : faEyeSlash}
                          className={
                            product.displayType === 1
                              ? "cursor-pointer text-2xl text-blue-500"
                              : "cursor-pointer text-xl text-gray-400"
                          }
                          onClick={() => toggleDisplayType(product._id)}
                        />
                        <span className="absolute bottom-full left-1/2 mb-4 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-gray-800 px-2 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                          Bật hoạt động
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center text-xl">
                      <div className="group relative">
                        <button
                          className="rounded-full px-3 py-1 text-blue-400 hover:bg-slate-300"
                          onClick={() => handleEditProduct(product)}
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </button>
                        <span className="absolute bottom-full left-1/3 mb-4 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-gray-800 px-2 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                          Chỉnh sửa
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProduct;
