import { useState } from "react";
import axios from "axios";

const AddIngredient = ({ showModal, setShowModal, onCreateIngredient }) => {
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    quantity: "",
    safeThreshold: "",
    displayType: 1, // Default as visible
  });
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra số lượng phải lớn hơn 0
    if (parseInt(newIngredient.quantity) <= 0) {
      setError("Số lượng phải lớn hơn 0");
      return;
    }

    // Kiểm tra số lượng phải lớn hơn ngưỡng an toàn
    if (
      parseInt(newIngredient.quantity) <= parseInt(newIngredient.safeThreshold)
    ) {
      setError("Số lượng phải lớn hơn ngưỡng an toàn");
      return;
    }

    setError(""); // Xóa thông báo lỗi khi tất cả điều kiện hợp lệ

    try {
      const response = await axios.post(
        "http://localhost:5000/api/ingredients", // Your API endpoint for ingredients
        newIngredient,
      );
      onCreateIngredient(response.data.data); // Update the parent component with the new ingredient
      setShowModal(false); // Close the modal
    } catch (error) {
      console.error(
        "Error adding ingredient:",
        error.response?.data?.message || error.message,
      );
    }
  };

  // Handle numeric input validation
  const handleNumericInput = (value, field) => {
    if (/^\d*$/.test(value)) {
      setNewIngredient({ ...newIngredient, [field]: value });
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="h-auto w-full max-w-xl rounded-lg bg-white p-6">
        <h2 className="mb-4 flex justify-center text-4xl font-bold">
          Thêm nguyên liệu
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block pb-2 text-xl font-medium">
              Tên nguyên liệu
            </label>
            <input
              type="text"
              value={newIngredient.name}
              onChange={(e) =>
                setNewIngredient({ ...newIngredient, name: e.target.value })
              }
              required
              className="h-12 w-full rounded-md border border-gray-300 p-2"
            />
          </div>

          <div className="mb-4">
            <label className="block pb-2 text-xl font-medium">Số lượng</label>
            <input
              type="text"
              value={newIngredient.quantity}
              onChange={(e) => handleNumericInput(e.target.value, "quantity")}
              required
              className={`h-12 w-full rounded-md border ${error ? "border-red-500" : "border-gray-300"} p-2`}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>

          <div className="mb-4">
            <label className="block pb-2 text-xl font-medium">
              Ngưỡng an toàn
            </label>
            <input
              type="text"
              value={newIngredient.safeThreshold}
              onChange={(e) =>
                handleNumericInput(e.target.value, "safeThreshold")
              }
              required
              className="h-12 w-full rounded-md border border-gray-300 p-2"
            />
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
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIngredient;
