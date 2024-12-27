import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faChartColumn,
  faBars,
  faGlassWater,
  faFileWord,
  faRightToBracket,
  faClipboardList,
  faReceipt,
  faTicket,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import ManageProduct from "./ProductManage/ManageProduct";
import ManageAccount from "./AccountManage/ManageAccount";
import ManageCategory from "./CategoryManage/ManageCategory";
import { Link } from "react-router-dom";
import imgpersonportal from "../../../../backend/assets/imgpersonportal.png";
import Cookies from "js-cookie";
import ManageOrder from "./OrderManage/ManageOrder";
import ManageChart from "./ChartManage/ManageChart";
import ManageCoupon from "./CouponManage/ManageCoupon";
import ProfileAdmin from "./ManageProfile/ProfileAdmin";
import axios from "axios";
import { toast } from "react-toastify";
import { decodeJWT } from "../utils/jwtUtils";

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
    if (userRole && userRole.includes("customer")) {
      return (
        <div className="p-6">
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p>You do not have permission to access this page.</p>
        </div>
      );
    }

    switch (activeComponent) {
      case "Account":
        return userRole && userRole.includes("admin") ? (
          <ManageAccount />
        ) : null;
      case "Product":
        return <ManageProduct />;
      case "Category":
        return <ManageCategory />;
      case "Order":
        return <ManageOrder />;
      case "Chart":
        return <ManageChart />;
      case "Coupon":
        return <ManageCoupon />;
      case "ProfileAdmin":
        return <ProfileAdmin />;
      default:
        return <ManageAccount />;
    }
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
            Bamos<span className="admin-name-app text-orange-900">Coffee</span>
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
          {Array.isArray(userRole) && userRole.includes("admin") && (
            <SidebarItem
              icon={faUser}
              label="Tài khoản"
              isSidebarExpanded={isSidebarExpanded}
              onClick={() => handleSetActiveComponent("Account")}
              isActive={activeComponent === "Account"}
            />
          )}
          <SidebarItem
            icon={faChartColumn}
            label="Thống kê"
            isSidebarExpanded={isSidebarExpanded}
            onClick={() => handleSetActiveComponent("Chart")}
            isActive={activeComponent === "Chart"}
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
        </ul>
      </div>
      {/* Main Content */}
      <div
        className={`flex flex-1 flex-col ${
          isSidebarExpanded ? "ml-64" : "ml-16"
        } transition-all duration-300`}
      >
        {/* Navbar */}
        <div className="flex justify-between bg-white p-4 shadow-md">
          <div
            className="ml-16 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black"
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
                  className="cursor-pointer rounded-t-lg border-b-2 border-black px-4 py-3 hover:bg-black hover:text-white"
                  onClick={() => handleSetActiveComponent("ProfileAdmin")}
                >
                  Thông tin cá nhân
                </li>
                <li>
                  <a
                    className="block cursor-pointer rounded-b-lg px-4 py-3 text-center hover:bg-black hover:text-white"
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
                  className="h-8 w-8 cursor-pointer"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faRightToBracket}
                  className="cursor-pointer text-3xl"
                />
              )}
            </Link>
            {isHovered && (
              <span className="absolute -left-4 mt-2 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-gray-800 px-4 py-2 text-sm text-white shadow-lg">
                Đến Trang Web
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
