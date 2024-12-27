import { useState, useEffect } from "react";
import axios from "axios";

const UpdateProduct = ({
  showModal,
  setShowModal,
  product,
  onUpdateProduct,
}) => {
  const [updatedProduct, setUpdatedProduct] = useState({
    name: "",
    image: "", // Chỉ lưu tên ảnh, không lưu file trực tiếp
    price: "",
    sell_price: "",
    category: "",
    displayType: 1,
  });
  const [categories, setCategories] = useState([]);

  // Lấy danh sách danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories");
        const data = await response.json();

        const activeCategories = data.data.filter(
          (category) => category.isActive === 1,
        );
        setCategories(activeCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Lấy thông tin sản phẩm hiện tại và cập nhật vào form
  useEffect(() => {
    if (showModal && product) {
      setUpdatedProduct({
        ...product, // Cập nhật thông tin sản phẩm vào state
        image: product.image, // Lưu tên ảnh vào state
        category: product.category?._id, // Lưu ID danh mục vào state
      });
    }
  }, [showModal, product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setUpdatedProduct((prevProduct) => ({
      ...prevProduct,
      imageFile: file || null, // Chỉ lưu file mới nếu có
      image: file ? URL.createObjectURL(file) : prevProduct.image,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", updatedProduct.name);
      formData.append("price", updatedProduct.price);
      formData.append("sell_price", updatedProduct.sell_price);
      formData.append("category", updatedProduct.category);
      formData.append("displayType", updatedProduct.displayType);

      if (updatedProduct.imageFile) {
        formData.append("image", updatedProduct.imageFile); // Gửi ảnh mới
      } else if (updatedProduct.image) {
        formData.append("image", updatedProduct.image); // Gửi ảnh cũ nếu không có ảnh mới
      } else {
        formData.append("image", ""); // Đặt giá trị rỗng nếu không có ảnh
      }

      const response = await axios.put(
        `http://localhost:5000/api/products/${updatedProduct._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      onUpdateProduct(response.data.data); // Cập nhật sản phẩm sau khi thành công
      setShowModal(false); // Đóng modal
    } catch (error) {
      console.error("Error updating product:", error.response?.data.message);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-7xl rounded-lg bg-white p-6">
        <h2 className="mb-12 flex justify-center text-4xl font-bold">
          Chỉnh sửa thông tin sản phẩm
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex space-x-6">
            {/* Phần Tên và Category */}
            <div className="w-2/3">
              <label className="block pb-2 text-xl font-medium">
                Tên sản phẩm
              </label>
              <input
                type="text"
                name="name"
                value={updatedProduct.name || ""}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 p-2"
                required
              />

              <label className="mt-4 block pb-2 text-xl font-medium">
                Thực đơn
              </label>
              <select
                value={updatedProduct.category}
                name="category"
                onChange={handleInputChange}
                className="w-1/2 rounded-md border border-gray-300 p-2"
                required
              >
                <option value="">Chọn thực đơn</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Phần Giá và Các thuộc tính */}
            <div className="w-2/3">
              <label className="block pb-2 text-xl font-medium">
                Giá sản phẩm
              </label>
              <input
                type="text"
                name="price"
                value={updatedProduct.price || ""}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 p-2"
                required
              />

              <label className="mt-4 block pb-2 text-xl font-medium">
                Giá giảm
              </label>
              <input
                type="text"
                name="sell_price"
                value={updatedProduct.sell_price || ""}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 p-2"
                required
              />

              <div className="mt-4 flex space-x-4">
                <div className="w-1/2">
                  <label className="block pb-2 text-xl font-medium">
                    Hiển thị sản phẩm
                  </label>
                  <select
                    value={updatedProduct.displayType}
                    name="displayType"
                    onChange={handleInputChange}
                    className="w-2/3 rounded-md border border-gray-300 p-2"
                    required
                  >
                    <option value={1}>Bật</option>
                    <option value={2}>Tắt</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Phần Ảnh */}
            {/* Hiển thị ảnh đã chọn hoặc ảnh cũ */}
            <div className="w-2/3">
              <label className="block pb-2 text-xl font-medium">Ảnh</label>
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="w-full rounded-md border border-gray-300 p-2"
              />
              <div className="mb-2 mt-4">
                {updatedProduct.image && (
                  <img
                    src={
                      updatedProduct.imageFile
                        ? URL.createObjectURL(updatedProduct.imageFile)
                        : updatedProduct.image.startsWith("http") ||
                            updatedProduct.image.startsWith("data")
                          ? updatedProduct.image // Đường dẫn ảnh từ server
                          : `/uploads/${updatedProduct.image}` // Ảnh cũ
                    }
                    alt={updatedProduct.name || "Product Image"}
                    className="h-1/3 w-1/3 rounded-md border object-cover"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Nút Cancel và Update */}
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="mr-28 h-12 w-28 rounded-md bg-gray-300 px-4 py-2 text-black hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="h-12 w-36 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
            >
              Cập Nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
