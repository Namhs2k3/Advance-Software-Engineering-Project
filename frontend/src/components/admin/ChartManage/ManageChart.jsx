import { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

const ManageChart = () => {
  const [orders, setOrders] = useState([]); // Dữ liệu thực từ API
  const [revenueData, setRevenueData] = useState({
    labels: [],
    datasets: [{ label: "Doanh thu", data: [] }],
  });
  const [filteredTopProducts, setFilteredTopProducts] = useState([]);
  const [filteredBottomProducts, setFilteredBottomProducts] = useState([]);

  const getYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    return yesterday;
  };

  const [revenueStartDate, setRevenueStartDate] = useState(getYesterday());
  const [revenueEndDate, setRevenueEndDate] = useState(getYesterday());
  const [pieStartDateTopProducts, setPieStartDateTopProducts] =
    useState(getYesterday());
  const [pieEndDateTopProducts, setPieEndDateTopProducts] =
    useState(getYesterday());
  const [pieStartDateLessProucts, setPieStartDateLessProucts] =
    useState(getYesterday());
  const [pieEndDateLessProucts, setPieEndDateLessProucts] =
    useState(getYesterday());

  // Hàm gọi API để lấy dữ liệu đơn hàng
  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/orders");
      console.log("Dữ liệu từ API:", response.data.data);
      setOrders(response.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
    }
  };

  useEffect(() => {
    fetchOrders(); // Gọi API khi component được render lần đầu
  }, []);

  const calculateRevenueData = () => {
    const filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt); // Sử dụng createdAt
      const normalizedStartDate = new Date(revenueStartDate);
      normalizedStartDate.setHours(0, 0, 0, 0);

      const normalizedEndDate = new Date(revenueEndDate);
      normalizedEndDate.setHours(23, 59, 59, 999);

      return orderDate >= normalizedStartDate && orderDate <= normalizedEndDate;
    });

    const labels = [];
    const revenue = [];

    filteredOrders.forEach((order) => {
      const orderDate = order.createdAt; // Sử dụng createdAt
      const dateLabel = new Date(orderDate).toLocaleDateString("vi-VN");
      const orderRevenue = order.cart.reduce(
        (sum, item) => sum + item.totalPrice,
        0,
      );

      const existingIndex = labels.indexOf(dateLabel);
      if (existingIndex >= 0) {
        revenue[existingIndex] += orderRevenue;
      } else {
        labels.push(dateLabel);
        revenue.push(orderRevenue);
      }
    });

    setRevenueData({
      labels,
      datasets: [
        {
          label: "Doanh thu",
          data: revenue,
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 3,
        },
      ],
    });
  };

  const getTopProducts = () => {
    const productSales = {};

    const filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt); // Sử dụng createdAt
      const normalizedStartDate = new Date(
        pieStartDateTopProducts.setHours(0, 0, 0, 0),
      );
      const normalizedEndDate = new Date(
        pieEndDateTopProducts.setHours(23, 59, 59, 999),
      );
      return orderDate >= normalizedStartDate && orderDate <= normalizedEndDate;
    });

    filteredOrders.forEach((order) => {
      order.cart.forEach((item) => {
        const productName = item.product.name;
        if (!productSales[productName]) {
          productSales[productName] = 0;
        }
        productSales[productName] += item.quantity;
      });
    });

    const sortedProducts = Object.entries(productSales)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    setFilteredTopProducts(sortedProducts);
  };

  const topProductsChartData = {
    labels: filteredTopProducts.map((product) => product.name),
    datasets: [
      {
        label: "Số lượng bán",
        data: filteredTopProducts.map((product) => product.quantity),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const getBottomProducts = () => {
    const productSales = {};

    const filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt); // Sử dụng createdAt
      const normalizedStartDate = new Date(pieStartDateLessProucts);
      normalizedStartDate.setHours(0, 0, 0, 0);

      const normalizedEndDate = new Date(pieEndDateLessProucts);
      normalizedEndDate.setHours(23, 59, 59, 999);

      return orderDate >= normalizedStartDate && orderDate <= normalizedEndDate;
    });

    filteredOrders.forEach((order) => {
      order.cart.forEach((item) => {
        const productName = item.product.name;
        if (!productSales[productName]) {
          productSales[productName] = 0;
        }
        productSales[productName] += item.quantity;
      });
    });

    const sortedProducts = Object.entries(productSales)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => a.quantity - b.quantity)
      .slice(0, 5);

    setFilteredBottomProducts(sortedProducts);
  };

  useEffect(() => {
    calculateRevenueData();
  }, [revenueStartDate, revenueEndDate, orders]);

  useEffect(() => {
    getTopProducts();
  }, [pieStartDateTopProducts, pieEndDateTopProducts, orders]);

  useEffect(() => {
    getBottomProducts();
  }, [pieStartDateLessProucts, pieEndDateLessProucts, orders]);

  const bottomProductsChartData = {
    labels: filteredBottomProducts.map((product) => product.name),
    datasets: [
      {
        label: "Số lượng bán",
        data: filteredBottomProducts.map((product) => product.quantity),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-gray-50 p-6">
      {/* Biểu đồ Doanh thu */}
      <div className="mb-4">
        <h2 className="text-center font-josefin text-4xl font-bold">
          Doanh thu cửa hàng
        </h2>
        <div className="mb-4 flex justify-center">
          <label className="mr-2 mt-2 font-josefin text-xl font-bold">
            Lọc Từ Ngày:{" "}
          </label>
          <DatePicker
            selected={revenueStartDate}
            onChange={(date) => setRevenueStartDate(date)}
            dateFormat="dd/MM/yyyy"
            className="border border-gray-300 p-2 text-center"
          />
          <span className="mx-6 mt-2 font-josefin text-xl font-bold">
            Đến Ngày:
          </span>
          <DatePicker
            selected={revenueEndDate}
            onChange={(date) => setRevenueEndDate(date)}
            dateFormat="dd/MM/yyyy"
            className="border border-gray-300 p-2 text-center"
          />
        </div>
      </div>

      {/* Line Chart */}
      <div className="mb-16 w-full">
        <Line data={revenueData} />
      </div>

      {/* Biểu đồ Pie cho Top 5 sản phẩm bán chạy nhất */}
      <div className="mt-8 flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 font-josefin text-4xl font-bold">
            Top 5 Sản Phẩm Bán Chạy Nhất
          </h2>
        </div>
        <div className="mb-4 flex justify-center">
          <label className="mr-2 mt-2 font-josefin text-xl font-bold">
            Lọc Từ Ngày:{" "}
          </label>
          <DatePicker
            selected={pieStartDateTopProducts}
            onChange={(date) => setPieStartDateTopProducts(date)}
            dateFormat="dd/MM/yyyy"
            className="border border-gray-300 p-2 text-center"
          />
          <span className="mx-6 mt-2 font-josefin text-xl font-bold">
            Đến Ngày:
          </span>
          <DatePicker
            selected={pieEndDateTopProducts}
            onChange={(date) => setPieEndDateTopProducts(date)}
            dateFormat="dd/MM/yyyy"
            className="border border-gray-300 p-2 text-center"
          />
        </div>

        {/* Pie Chart for Top 5 Products */}
        <div className="mb-6 mt-4 h-5/6 w-full">
          <Bar data={topProductsChartData} />
        </div>
      </div>

      <div className="mt-11 flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 font-josefin text-4xl font-bold">
            Top 5 Sản Phẩm Bán Ít Nhất
          </h2>
        </div>
        <div className="mb-4 flex justify-center">
          <label className="mr-2 mt-2 font-josefin text-xl font-bold">
            Lọc Từ Ngày:{" "}
          </label>
          <DatePicker
            selected={pieStartDateLessProucts}
            onChange={(date) => setPieStartDateLessProucts(date)}
            dateFormat="dd/MM/yyyy"
            className="border border-gray-300 p-2 text-center"
          />
          <span className="mx-6 mt-2 font-josefin text-xl font-bold">
            Đến Ngày:
          </span>
          <DatePicker
            selected={pieEndDateLessProucts}
            onChange={(date) => setPieEndDateLessProucts(date)}
            dateFormat="dd/MM/yyyy"
            className="border border-gray-300 p-2 text-center"
          />
        </div>

        {/* Pie Chart for Top 5 Products */}
        <div className="mb-6 mt-4 w-full">
          <Bar data={bottomProductsChartData} />
        </div>
      </div>
    </div>
  );
};

export default ManageChart;
