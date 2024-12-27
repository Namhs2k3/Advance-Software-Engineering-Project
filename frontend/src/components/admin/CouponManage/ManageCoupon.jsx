import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen } from "@fortawesome/free-solid-svg-icons";
import UpdateCoupon from "./UpdateCoupon";
import AddCoupon from "./AddCoupon";
import Loading from "../../website/Loading";

const ManageCoupon = () => {
  const [coupons, setCoupons] = useState([]); // Danh sách coupon
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [showDetailModal, setShowDetailModal] = useState(false); // Modal chi tiết
  const [selectedCoupon, setSelectedCoupon] = useState(null); // Coupon được chọn
  const [showAddModal, setShowAddModal] = useState(false); // Modal thêm coupon mới
  const [loading, setLoading] = useState(true);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/coupons"); // Thay bằng endpoint API thực tế
      if (response.data && Array.isArray(response.data.data)) {
        setCoupons(response.data.data);
      } else {
        setCoupons([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách coupon:", error);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Kiểm tra trước khi filter
  const filteredCoupons = Array.isArray(coupons)
    ? coupons.filter((coupon) =>
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedCoupon(null);
  };

  const handleShowCouponDetail = (coupon) => {
    setSelectedCoupon(coupon);
    setShowDetailModal(true);
  };

  const handleShowAddCoupon = () => {
    setShowAddModal(true);
  };

  const handleCloseAddCoupon = () => {
    setShowAddModal(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-5xl rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 text-center text-2xl font-bold">
          Quản lý Coupon
        </div>

        {/* Search box */}
        <div className="mb-4 flex items-center justify-between">
          <input
            type="text"
            placeholder="Tìm kiếm coupon"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-60 rounded-md border border-gray-300 p-2"
          />
          <div className="group relative">
            <button
              onClick={handleShowAddCoupon}
              className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <span className="absolute bottom-full left-1/2 mb-3 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-gray-800 px-2 py-2 text-base text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              Tạo mã giảm giá
            </span>
          </div>
        </div>

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
                  <th className="px-4 py-3 text-center">Mã Coupon</th>
                  <th className="px-4 py-3 text-center">Giá trị giảm</th>
                  <th className="px-4 py-3 text-center">Tổng số lượng</th>
                  <th className="px-4 py-3 text-center">Còn lại</th>
                  <th className="px-4 py-3 text-center">Ngày tạo</th>
                  <th className="px-4 py-3 text-center">Chỉnh sửa</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon._id} className="bg-white">
                    <td className="px-4 py-6 text-center font-bold">
                      {coupon.code}
                    </td>
                    <td className="px-4 py-6 text-center">
                      {coupon.discountValue.toLocaleString()}
                    </td>
                    <td className="px-4 py-6 text-center">{coupon.maxUsage}</td>
                    <td className="px-4 py-6 text-center">
                      {coupon.maxUsage - coupon.currentUsage}
                    </td>
                    <td className="px-4 py-6 text-center">
                      {new Date(coupon.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-6 text-center text-xl">
                      <div className="group relative">
                        <button
                          onClick={() => handleShowCouponDetail(coupon)}
                          className="px-3 py-1 text-blue-400 hover:rounded-full hover:bg-slate-300"
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </button>
                        <span className="absolute bottom-full left-1/2 mb-3 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-gray-800 px-2 py-2 text-base text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                          Xem chi tiết
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Show coupon Detail Modal */}
        {showDetailModal && (
          <UpdateCoupon
            coupon={selectedCoupon}
            onClose={handleCloseDetailModal}
            onUpdateSuccess={fetchCoupons}
          />
        )}

        {/* Show Add Coupon Modal */}
        {showAddModal && (
          <AddCoupon
            onClose={handleCloseAddCoupon}
            onAddSuccess={fetchCoupons}
          />
        )}
      </div>
    </div>
  );
};

export default ManageCoupon;
