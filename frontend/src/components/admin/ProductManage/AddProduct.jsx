import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { toast } from "react-toastify";

const AddProduct = ({ showModal, setShowModal }) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    image: null,
    price: "",
    sell_price: "",
    category: "",
    ingredients: [],
    displayType: 1,
  });
  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

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

    const fetchIngredients = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/ingredients");
        const data = await response.json();
        const ingredientOptions = data.data
          .filter((ingredient) => ingredient.displayType === 1)
          .map((ingredient) => ({
            value: ingredient._id,
            label: ingredient.name,
          }));
        setIngredients(ingredientOptions);
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    };

    fetchCategories();
    fetchIngredients();
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

    console.log(newProduct.ingredients.map((ingredient) => ingredient.value));

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("image", newProduct.image);
    formData.append("price", newProduct.price);
    formData.append("sell_price", newProduct.sell_price);
    formData.append("category", newProduct.category);
    formData.append("displayType", newProduct.displayType);
    formData.append(
      "ingredients",
      JSON.stringify(
        newProduct.ingredients.map((ingredient) => ingredient.value),
      ),
    );

    try {
      const response = await axios.post(
        "http://localhost:5000/api/products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      console.log("Tạo sản phẩm thành công", response.data);
      setShowModal(false);
    } catch (error) {
      if (error.response) {
        console.error("Error adding product", error.response.data);
      } else if (error.request) {
        console.error("No response received from server", error.request);
      } else {
        toast.error("Error", error.message);
      }
    }
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
          <div className="mb-4">
            <label className="block pb-2 text-xl font-medium">
              Thành phần (Ingredients)
            </label>
            <Select
              isMulti
              options={ingredients}
              value={newProduct.ingredients}
              onChange={(selected) =>
                setNewProduct({ ...newProduct, ingredients: selected })
              }
              placeholder="Chọn thành phần..."
              className="basic-multi-select"
              classNamePrefix="select"
              required
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
