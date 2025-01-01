import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPen,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import AddIngredient from "./AddIngredient";
import UpdateIngredient from "./UpdateIngredient";
import Loading from "../../website/Loading";

const ManageIngredient = () => {
  const [ingredients, setIngredients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Ingredients
  const fetchIngredients = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/ingredients"); // API for ingredients
      setIngredients(response.data.data);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  useEffect(() => {
    if (!showAddModal && !showUpdateModal) {
      fetchIngredients();
    }
  }, [showAddModal, showUpdateModal]);

  const handleCreateIngredient = async (ingredient) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/ingredients",
        ingredient,
      );
      setIngredients([...ingredients, response.data.data]);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error creating ingredient:", error.response.data.message);
    }
  };

  // Filter ingredients by search term
  const filteredIngredients = ingredients.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Toggle display type for ingredients
  const toggleDisplayType = async (id) => {
    try {
      const updatedIngredients = ingredients.map((ingredient) =>
        ingredient._id === id
          ? { ...ingredient, displayType: ingredient.displayType === 1 ? 2 : 1 }
          : ingredient,
      );
      setIngredients(updatedIngredients);

      // Update API
      await axios.put(`http://localhost:5000/api/ingredients/${id}`, {
        displayType: updatedIngredients.find((i) => i._id === id).displayType,
      });
    } catch (error) {
      console.error("Error updating display type:", error);
    }
  };

  const handleEditIngredient = (ingredient) => {
    setSelectedIngredient(ingredient);
    setShowUpdateModal(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-7xl rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 text-center text-2xl font-bold">
          Quản lý nguyên liệu
        </div>

        {/* Search Ingredients */}
        <div className="mb-4 flex items-center justify-between">
          <input
            type="text"
            placeholder="Tìm kiếm bằng tên nguyên liệu"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-72 rounded-md border border-gray-300 p-2"
          />
          <div className="flex gap-3">
            <button
              onClick={() =>
                (window.location.href =
                  "http://localhost:5000/api/ingredients/inventory-report")
              }
              className="rounded-full bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              Generate Inventory Report
            </button>
            <div className="group relative">
              <button
                onClick={() => setShowAddModal(true)}
                className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
              <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-gray-800 px-4 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                Thêm nguyên liệu
              </span>
            </div>
          </div>
        </div>

        {/* Component AddIngredient */}
        {showAddModal && (
          <AddIngredient
            showModal={showAddModal}
            setShowModal={setShowAddModal}
            onCreateIngredient={handleCreateIngredient}
          />
        )}

        {/* Component UpdateIngredient */}
        {selectedIngredient && showUpdateModal && (
          <UpdateIngredient
            showModal={showUpdateModal}
            setShowModal={setShowUpdateModal}
            ingredient={selectedIngredient}
            onUpdateIngredient={(updatedIngredient) => {
              setIngredients((prevIngredients) =>
                prevIngredients.map((i) =>
                  i._id === updatedIngredient._id ? updatedIngredient : i,
                ),
              );
              setShowUpdateModal(false);
            }}
          />
        )}

        {loading ? (
          <div className="flex h-[255px] w-full items-center justify-center lg:h-[400px]">
            <Loading /> {/* Show Loading when fetching ingredients */}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-center">Tên nguyên liệu</th>
                  <th className="px-4 py-3 text-center">Số lượng</th>
                  <th className="px-4 py-3 text-center">Ngưỡng an toàn</th>
                  <th className="px-4 py-3 text-center">Ngày cập nhật</th>
                  <th className="px-4 py-3 text-center">Hoạt động</th>
                  <th className="px-4 py-3 text-center">Chỉnh sửa</th>
                </tr>
              </thead>
              <tbody>
                {filteredIngredients.map((ingredient) => (
                  <tr key={ingredient._id} className="border-b">
                    <td className="px-4 py-2 font-bold">{ingredient.name}</td>
                    <td className="px-4 py-2 text-center">
                      {ingredient.quantity}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {ingredient.safeThreshold}
                    </td>
                    <td className="px-4 py-6 text-center">
                      {new Date(ingredient.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="group relative">
                        <FontAwesomeIcon
                          icon={
                            ingredient.displayType === 1 ? faEye : faEyeSlash
                          }
                          className={
                            ingredient.displayType === 1
                              ? "cursor-pointer text-2xl text-blue-500"
                              : "cursor-pointer text-xl text-gray-400"
                          }
                          onClick={() => toggleDisplayType(ingredient._id)}
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
                          onClick={() => handleEditIngredient(ingredient)}
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

export default ManageIngredient;
