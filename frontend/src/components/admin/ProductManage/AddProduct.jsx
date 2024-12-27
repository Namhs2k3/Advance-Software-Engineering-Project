import { useState, useEffect } from "react";
import axios from "axios";
const AddProduct = ({ showModal, setShowModal }) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    image: null, // Đặt image là null thay vì chuỗi rỗng
    price: "",
    sell_price: "",
    category: "",
    displayType: 1,
    displayHot: 1,
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  // Lấy danh sách danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories");
        const data = await response.json();

        // Lọc danh mục có isActive = 1
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseFloat(newProduct.sell_price) > parseFloat(newProduct.price)) {
      setError("Giá giảm phải thấp hơn giá");
      return;
    }

    setError("");

    if (!newProduct.image) {
      alert("Hãy chọn ảnh");
      return;
    }

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("image", newProduct.image);
    formData.append("price", newProduct.price);
    formData.append("sell_price", newProduct.sell_price);
    formData.append("category", newProduct.category);
    formData.append("displayType", newProduct.displayType);
    formData.append("displayHot", newProduct.displayHot);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Đảm bảo là 'multipart/form-data'
          },
        },
      );
      console.log("Tạo sản phẩm thành công", response.data);
    } catch (error) {
      if (error.response) {
        console.error("Error adding product", error.response.data); // Kiểm tra error.response
      } else if (error.request) {
        console.error("No response received from server", error.request);
      } else {
        console.error("Error", error.message); // Thông báo lỗi khác
      }
    }
    setShowModal(false);
  };

  const handleNumericInput = (value, field) => {
    if (/^\d*$/.test(value)) {
      setNewProduct({ ...newProduct, [field]: value });
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="h-auto w-full max-w-xl rounded-lg bg-white p-6">
        <h2 className="mb-4 flex justify-center text-4xl font-bold">
          Tạo sản phẩm
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block pb-2 text-xl font-medium">
              Tên sản phẩm
            </label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              required
              className="h-12 w-full rounded-md border border-gray-300 p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block pb-2 text-xl font-medium">
              Ảnh sản phẩm
            </label>
            <input
              type="file"
              onChange={(e) =>
                setNewProduct({ ...newProduct, image: e.target.files[0] })
              }
              required
              accept="image/*"
              className="h-12 w-full rounded-md border border-gray-300 p-2"
            />
          </div>
          <div className="mb-4 flex space-x-4">
            <div className="w-1/2">
              <label className="block pb-2 text-xl font-medium">
                Giá sản phẩm
              </label>
              <input
                type="text"
                value={newProduct.price}
                onChange={(e) => handleNumericInput(e.target.value, "price")}
                required
                className="h-12 w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            <div className="w-1/2">
              <label className="block pb-2 text-xl font-medium">Giá Giảm</label>
              <input
                type="text"
                value={newProduct.sell_price}
                onChange={(e) => {
                  handleNumericInput(e.target.value, "sell_price");
                  setError("");
                }}
                required
                className={`h-12 w-full rounded-md border ${
                  error ? "border-red-500" : "border-gray-300"
                } p-2`}
              />
              {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
          </div>
          <div className="mb-4">
            <label className="block pb-2 text-xl font-medium">Thực đơn</label>
            <select
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
              required
              className="h-12 w-1/2 rounded-md border border-gray-300 p-2"
            >
              <option value="">Chọn thực đơn</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4 flex space-x-4">
            <div className="w-1/2">
              <label className="block pb-2 text-xl font-medium">
                Đặt làm Hot
              </label>
              <select
                value={newProduct.displayHot}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, displayHot: +e.target.value })
                }
                required
                className="h-12 w-1/2 rounded-md border border-gray-300 p-2"
              >
                <option value={1}>Hot</option>
                <option value={2}>Không Hot</option>
              </select>
            </div>
            <div className="w-1/2">
              <label className="block pb-2 text-xl font-medium">
                Hiển thị sản phẩm
              </label>
              <select
                value={newProduct.displayType}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, displayType: +e.target.value })
                }
                required
                className="h-12 w-1/2 rounded-md border border-gray-300 p-2"
              >
                <option value={1}>Bật</option>
                <option value={2}>Tắt</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="h-12 w-32 rounded-md bg-gray-300 px-4 py-2 text-black hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="h-12 w-36 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-800"
            >
              Tạo sản phẩm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
