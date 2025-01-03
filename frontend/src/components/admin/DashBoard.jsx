import {
  faBars,
  faBellConcierge,
  faClipboardList,
  faCouch,
  faGlassWater,
  faReceipt,
  faRightToBracket,
  faTicket,
  faUser,
  faUsersGear,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import imgpersonportal from "../../../../backend/assets/imgpersonportal.png";
import { decodeJWT } from "../utils/jwtUtils";
import ManageAccount from "./AccountManage/ManageAccount";
import ManageCategory from "./CategoryManage/ManageCategory";
import ManageCoupon from "./CouponManage/ManageCoupon";
import ManageEmployee from "./EmployeeManage/ManageEmployee";
import ProfileAdmin from "./ManageProfile/ProfileAdmin";
import ManageOrder from "./OrderManage/ManageOrder";
import ManageProduct from "./ProductManage/ManageProduct";
import ManageRequest from "./RequestManage/ManageRequest";
import ManageTable from "./TableManage/ManageTable";

const SidebarItem = ({ icon, label, isSidebarExpanded, onClick, isActive }) => (
  <li
    className={`flex cursor-pointer items-center px-4 py-6 ${
      isActive
        ? "ml-2 mr-2 flex items-center justify-center rounded-2xl bg-black text-white"
        : "hover:mx-2 hover:rounded-xl hover:bg-gray-100"
    }`}
    onClick={onClick}
  >
    <FontAwesomeIcon icon={icon} className="text-2xl" />
    <span
      className={`ml-4 ${!isSidebarExpanded && "hidden group-hover:block"}`}
    >
      {label}
    </span>
  </li>
);

const DashBoard = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [activeComponent, setActiveComponent] = useState("Account");
  const [isHovered, setIsHovered] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Đọc giá trị activeComponent từ localStorage khi trang được tải lại
  useEffect(() => {
    const token = Cookies.get("jwtToken"); // Lấy token từ cookie
    if (token) {
      try {
        const decoded = decodeJWT(token);
        console.log("Decoded token:", decoded); // In thông tin decoded
        setUserRole(decoded ? decoded.role : null); // Lưu role từ token
      } catch (error) {
        console.error("Error decoding token", error);
      }
    }

    // Lấy activeComponent từ localStorage
    const savedComponent = localStorage.getItem("activeComponent");
    if (savedComponent) {
      setActiveComponent(savedComponent);
    }
  }, []);

  // Lưu giá trị activeComponent vào localStorage khi thay đổi
  const handleSetActiveComponent = (component) => {
    setActiveComponent(component);
    localStorage.setItem("activeComponent", component); // Lưu vào localStorage
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    // Xóa cookie chứa JWT token
    try {
      // Gửi yêu cầu logout tới backend (xóa JWT cookie ở server)
      const response = await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true },
      );

      if (response.data.success) {
        // Xóa JWT token từ cookies ở frontend
        Cookies.remove("jwtToken");

        // Điều hướng đến trang login hoặc trang chính
        window.location.href = "/login";
        toast.success("Đăng xuất thành công!");
      }
    } catch (error) {
      toast.error("Lỗi đăng xuất:", error);
    }
  };

  const renderContent = () => {
    if (
      userRole &&
      userRole.includes("chef") &&
      activeComponent === "Request"
    ) {
      return <ManageRequest />;
    }

    if (userRole && userRole.includes("admin")) {
      switch (activeComponent) {
        case "Account":
          return <ManageAccount />;
        case "Product":
          return <ManageProduct />;
        case "Category":
          return <ManageCategory />;
        case "Order":
          return <ManageOrder />;
        case "Coupon":
          return <ManageCoupon />;
        case "ProfileAdmin":
          return <ProfileAdmin />;
        case "Table":
          return <ManageTable />;
        case "Employee":
          return <ManageEmployee />;
        default:
          return <ManageAccount />;
      }
    }

    // Nếu không có quyền, hiển thị trang không được phép truy cập
    return <div>Bạn không có quyền truy cập vào nội dung này.</div>;
  };

  return (
    <div className="flex h-screen">
      {" "}
      1{/* Sidebar */}
      <div
        className={`group bg-white text-gray-800 ${
          isSidebarExpanded ? "w-64" : "w-16"
        } fixed h-screen transition-all duration-300 hover:w-64`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-4">
          <span
            className={`text-lg font-bold ${
              !isSidebarExpanded && "hidden group-hover:block"
            }`}
          >
            Bamos<span className="text-orange-900 admin-name-app">Coffee</span>
          </span>
          <button
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className="px-1 text-gray-400 hover:text-black focus:outline-none"
          >
            <FontAwesomeIcon icon={faBars} className="text-2xl" />
          </button>
        </div>

        {/* Sidebar Menu */}
        <ul className="mt-4">
          {/* Mục dành cho admin */}
          {Array.isArray(userRole) && userRole.includes("admin") && (
            <>
              <SidebarItem
                icon={faUser}
                label="Tài khoản"
                isSidebarExpanded={isSidebarExpanded}
                onClick={() => handleSetActiveComponent("Account")}
                isActive={activeComponent === "Account"}
              />
              <SidebarItem
                icon={faReceipt}
                label="Đơn Hàng"
                isSidebarExpanded={isSidebarExpanded}
                onClick={() => handleSetActiveComponent("Order")}
                isActive={activeComponent === "Order"}
              />
              <SidebarItem
                icon={faGlassWater}
                label="Sản phẩm"
                isSidebarExpanded={isSidebarExpanded}
                onClick={() => handleSetActiveComponent("Product")}
                isActive={activeComponent === "Product"}
              />
              <SidebarItem
                icon={faClipboardList}
                label="Thực đơn"
                isSidebarExpanded={isSidebarExpanded}
                onClick={() => handleSetActiveComponent("Category")}
                isActive={activeComponent === "Category"}
              />
              <SidebarItem
                icon={faTicket}
                label="Mã giảm giá"
                isSidebarExpanded={isSidebarExpanded}
                onClick={() => handleSetActiveComponent("Coupon")}
                isActive={activeComponent === "Coupon"}
              />
              <SidebarItem
                icon={faCouch}
                label="Bàn"
                isSidebarExpanded={isSidebarExpanded}
                onClick={() => handleSetActiveComponent("Table")}
                isActive={activeComponent === "Table"}
              />
              <SidebarItem
                icon={faUsersGear}
                label="Nhân viên"
                isSidebarExpanded={isSidebarExpanded}
                onClick={() => handleSetActiveComponent("Employee")}
                isActive={activeComponent === "Employee"}
              />
            </>
          )}

          {/* Mục dành cho chef */}
          {Array.isArray(userRole) && userRole.includes("chef") && (
            <SidebarItem
              icon={faBellConcierge}
              label="Phiếu ghi món"
              isSidebarExpanded={isSidebarExpanded}
              onClick={() => handleSetActiveComponent("Request")}
              isActive={activeComponent === "Request"}
            />
          )}
        </ul>
      </div>
      {/* Main Content */}
      <div
        className={`flex flex-1 flex-col ${
          isSidebarExpanded ? "ml-64" : "ml-16"
        } transition-all duration-300`}
      >
        {/* Navbar */}
        <div className="flex justify-between p-4 bg-white shadow-md">
          <div
            className="flex items-center justify-center w-10 h-10 ml-16 bg-black rounded-full cursor-pointer"
            onMouseEnter={toggleDropdown}
            onMouseLeave={toggleDropdown}
          >
            <span className="text-white">
              <FontAwesomeIcon icon={faUser} />
            </span>
          </div>

          {/* Dropdown Menu */}
          {isOpen && (
            <div
              className="absolute top-[56px] w-[180px] rounded-xl border-2 border-black bg-white text-black shadow-lg"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
            >
              <ul>
                <li
                  className="px-4 py-3 border-b-2 border-black rounded-t-lg cursor-pointer hover:bg-black hover:text-white"
                  onClick={() => handleSetActiveComponent("ProfileAdmin")}
                >
                  Thông tin cá nhân
                </li>
                <li>
                  <a
                    className="block px-4 py-3 text-center rounded-b-lg cursor-pointer hover:bg-black hover:text-white"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </a>
                </li>
              </ul>
            </div>
          )}

          <div
            className="relative pr-8"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Link to="/">
              {isHovered ? (
                <img
                  src={imgpersonportal}
                  alt="Person Portal"
                  className="w-8 h-8 cursor-pointer"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faRightToBracket}
                  className="text-3xl cursor-pointer"
                />
              )}
            </Link>
            {isHovered && (
              <span className="absolute px-4 py-2 mt-2 text-sm text-white transform -translate-x-1/2 bg-gray-800 rounded-md shadow-lg -left-4 whitespace-nowrap">
                Đến Trang Web
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
