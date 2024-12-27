import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPen,
  faToggleOn,
  faToggleOff,
} from "@fortawesome/free-solid-svg-icons";
import AddCategory from "./AddCategory";
import UpdateCategory from "./UpdateCategory";
import axios from "axios";
import Loading from "../../website/Loading";

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddFormVisible, setAddFormVisible] = useState(false);
  const [isUpdateFormVisible, setUpdateFormVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true); // Bắt đầu hiển thị loading
      try {
        const response = await axios.get(
          "http://localhost:5000/api/categories",
          {
            withCredentials: true,
          },
        );
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false); // Kết thúc loading sau khi lấy dữ liệu xong
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleIsActive = async (id) => {
    try {
      const updatedCategories = categories.map((category) =>
        category._id === id
          ? { ...category, isActive: category.isActive === 1 ? 2 : 1 }
          : category,
      );
      setCategories(updatedCategories);

      await axios.put(`http://localhost:5000/api/categories/${id}`, {
        isActive: updatedCategories.find((p) => p._id === id).isActive,
      });
    } catch (error) {
      console.error("Error updating isActive:", error);
    }
  };

  const handleAddCategory = (newCategory) => {
    axios
      .post("http://localhost:5000/api/categories", newCategory)
      .then((response) => {
        setCategories([...categories, response.data.data]);
      })
      .catch((error) => console.error("Error adding category:", error));
  };

  const handleUpdateCategory = (updatedCategory) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category._id === updatedCategory._id ? updatedCategory : category,
      ),
    );
  };

  const openUpdateForm = (category) => {
    setSelectedCategory(category);
    setUpdateFormVisible(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-5xl rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 text-center text-2xl font-bold">
          Quản lý thực đơn
        </div>

        <div className="mb-4 flex items-center justify-between">
          <input
            type="text"
            placeholder="Tìm kiếm bằng tên"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-72 rounded-md border border-gray-300 p-2"
          />
          <div className="group relative">
            <button
              onClick={() => setAddFormVisible(true)}
              className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-gray-800 px-4 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              Tạo thực đơn
            </span>
          </div>
        </div>
        {loading ? (
          // Hiển thị phần loading nếu dữ liệu chưa được tải
          <div className="flex h-[255px] w-full items-center justify-center lg:h-[300px]">
            <Loading /> {/* Hiển thị Loading khi đang tải dữ liệu */}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left">Tên thực đơn</th>
                  <th className="px-4 py-3 text-center">Ngày tạo</th>
                  <th className="px-4 py-3 text-center">Ngày cập nhật</th>
                  <th className="px-4 py-3 text-center">Hoạt động</th>
                  <th className="px-4 py-3 text-center">Chỉnh sửa</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category._id} className="border-b">
                    <td className="px-4 py-6 font-bold">{category.name}</td>
                    <td className="px-4 py-6 text-center">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-6 text-center">
                      {new Date(category.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-6 text-center text-2xl">
                      <div className="group relative">
                        <FontAwesomeIcon
                          icon={
                            category.isActive === 1 ? faToggleOn : faToggleOff
                          }
                          className={
                            category.isActive === 1
                              ? "cursor-pointer text-green-500"
                              : "cursor-pointer text-gray-400"
                          }
                          onClick={() => toggleIsActive(category._id)}
                        />
                        <span className="absolute bottom-full left-1/2 mb-3 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-gray-800 px-2 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                          Bật hoạt động
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-6 text-center text-xl">
                      <div className="group relative">
                        <button
                          onClick={() => openUpdateForm(category)}
                          className="rounded-full px-3 py-1 text-blue-400 hover:bg-slate-300"
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </button>
                        <span className="absolute bottom-full left-1/2 mb-3 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-gray-800 px-2 py-2 text-sm text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
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
      {isAddFormVisible && (
        <AddCategory
          onClose={() => setAddFormVisible(false)}
          onAddCategory={handleAddCategory}
        />
      )}

      {isUpdateFormVisible && (
        <UpdateCategory
          category={selectedCategory}
          onClose={() => setUpdateFormVisible(false)}
          onUpdateCategory={handleUpdateCategory}
        />
      )}
    </div>
  );
};

export default ManageCategory;
