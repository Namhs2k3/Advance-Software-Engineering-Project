import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./app.css";
import PaymentPage from "./components/PaymentPage";
import Admin from "./components/admin/Admin";
import AuthenticationCode from "./components/website/AuthenticationCode";
import OrderTable from "./components/website/ManageOrder/OrderTable";
import ModalForgotPassword from "./components/website/ModalForgotPassword";
import ModalLogin from "./components/website/ModalLogin";
import Navbar from "./components/website/Navbar";
import OrderSuccess from "./components/website/OrderSuccess";
import CustomerProfile from "./components/website/ProfileCustomer/CustomerProfile";
import ResetPassword from "./components/website/ResetPassword";

// Layout chung có Navbar và Footer
const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Navbar />
      {children}
    </div>
  );
};

// Layout dành riêng cho Admin không có Navbar và Footer
const AdminLayout = ({ children }) => {
  return <div className="admin-container">{children}</div>;
};

const PaymentLayout = ({ children }) => {
  return (
    <div className="payment-container">
      <Navbar />
      {children}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route cho các trang chung có Navbar và Footer */}
        <Route
          path="/"
          element={
            <MainLayout>
              <OrderTable />
            </MainLayout>
          }
        />
        <Route
          path="/home"
          element={
            <MainLayout>
              <OrderTable />
            </MainLayout>
          }
        />
        <Route
          path="/payment"
          element={
            <PaymentLayout>
              <PaymentPage />
            </PaymentLayout>
          }
        />
        <Route
          path="/order-success"
          element={
            <MainLayout>
              <OrderSuccess />
            </MainLayout>
          }
        />
        <Route
          path="/login"
          element={
            <MainLayout>
              <ModalLogin />
            </MainLayout>
          }
        />
        <Route
          path="/forgotpassword"
          element={
            <MainLayout>
              <ModalForgotPassword />
            </MainLayout>
          }
        />
        <Route
          path="/authenticationcode"
          element={
            <MainLayout>
              <AuthenticationCode />
            </MainLayout>
          }
        />
        <Route
          path="/resetpassword"
          element={
            <MainLayout>
              <ResetPassword />
            </MainLayout>
          }
        />
        <Route
          path="/customerprofile"
          element={
            <MainLayout>
              <CustomerProfile />
            </MainLayout>
          }
        />

        {/* Route cho Admin, không có Navbar và Footer */}
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <Admin />
            </AdminLayout>
          }
        />

        {/* Route cho các trang khác */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
