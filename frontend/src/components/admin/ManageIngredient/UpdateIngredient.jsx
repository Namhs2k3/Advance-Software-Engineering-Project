import { useState, useEffect } from "react";
import axios from "axios";

const UpdateIngredient = ({
  showModal,
  setShowModal,
  ingredient,
  onUpdateIngredient,
}) => {
  const [updatedIngredient, setUpdatedIngredient] = useState({
    name: "",
    quantity: "",
    safeThreshold: "",
    displayType: 1, // Default as visible
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (showModal && ingredient) {
      setUpdatedIngredient({
        ...ingredient, // Set current inventory data
        displayType: ingredient.displayType || 1, // Ensure display type is included
      });
    }
  }, [showModal, ingredient]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate if quantity is greater than safe threshold
    if (parseInt(updatedIngredient.quantity) <= 0) {
      setError("Số lượng phải lớn hơn 0");
      return;
    }

    if (
      parseInt(updatedIngredient.quantity) <=
      parseInt(updatedIngredient.safeThreshold)
    ) {
      setError("Số lượng phải lớn hơn ngưỡng an toàn");
      return;
    }

    setError("");

    try {
      const response = await axios.put(
        `http://localhost:5000/api/ingredients/${updatedIngredient._id}`, // Update the API URL with the ingredient ID
        updatedIngredient,
      );
      onUpdateIngredient(response.data.data); // Update the parent component with the updated ingredient
      setShowModal(false); // Close the modal
    } catch (error) {
      console.error(
        "Error updating ingredient:",
        error.response?.data?.message || error.message,
      );
    }
  };

  // Handle numeric input validation
  const handleNumericInput = (value, field) => {
    if (/^\d*$/.test(value)) {
      setUpdatedIngredient({ ...updatedIngredient, [field]: value });
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="h-auto w-full max-w-xl rounded-lg bg-white p-6">
        <h2 className="mb-4 flex justify-center text-4xl font-bold">
          Chỉnh sửa nguyên liệu
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Ingredient Name */}
          <div className="mb-4">
            <label className="block pb-2 text-xl font-medium">
              Tên nguyên liệu
            </label>
            <input
              type="text"
              value={updatedIngredient.name}
              onChange={(e) =>
                setUpdatedIngredient({
                  ...updatedIngredient,
                  name: e.target.value,
                })
              }
              required
              className="h-12 w-full rounded-md border border-gray-300 p-2"
            />
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <label className="block pb-2 text-xl font-medium">Số lượng</label>
            <input
              type="text"
              value={updatedIngredient.quantity}
              onChange={(e) => handleNumericInput(e.target.value, "quantity")}
              required
              className={`h-12 w-full rounded-md border ${error ? "border-red-500" : "border-gray-300"} p-2`}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>

          {/* Safe Threshold */}
          <div className="mb-4">
            <label className="block pb-2 text-xl font-medium">
              Ngưỡng an toàn
            </label>
            <input
              type="text"
              value={updatedIngredient.safeThreshold}
              onChange={(e) =>
                handleNumericInput(e.target.value, "safeThreshold")
              }
              required
              className="h-12 w-full rounded-md border border-gray-300 p-2"
            />
          </div>

          {/* Display Type */}
          <div className="mb-4">
            <label className="block pb-2 text-xl font-medium">
              Trạng thái hiển thị
            </label>
            <select
              value={updatedIngredient.displayType}
              onChange={(e) =>
                setUpdatedIngredient({
                  ...updatedIngredient,
                  displayType: parseInt(e.target.value),
                })
              }
              required
              className="h-12 w-full rounded-md border border-gray-300 p-2"
            >
              <option value={1}>Hiển thị</option>
              <option value={2}>Ẩn</option>
            </select>
          </div>

          {/* Actions */}
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
              Cập Nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateIngredient;
