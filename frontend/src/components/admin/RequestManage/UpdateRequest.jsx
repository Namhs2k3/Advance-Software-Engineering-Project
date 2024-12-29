import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCheck } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const steps = ["Chờ", "Đang chuẩn bị", "Hoàn thành"]; // 3 steps

const UpdateRequest = ({ table, onClose }) => {
  const [activeStep, setActiveStep] = useState(table.activeStep);
  const [cart, setCart] = useState(table.cart);

  const handleNext = async () => {
    if (activeStep < steps.length - 1) {
      const newActiveStep = activeStep + 1;
      setActiveStep(newActiveStep); // Cập nhật state activeStep

      // Gửi cập nhật qua API
      try {
        const response = await axios.put(
          `http://localhost:5000/api/tables/${table._id}`,
          {
            activeStep: newActiveStep, // Cập nhật activeStep
            cart: cart, // Giữ nguyên giỏ hàng
          },
        );

        if (response.data.success) {
          console.log("Table updated successfully:", response.data.data);
        } else {
          console.error("Error updating table:", response.data.message);
        }
      } catch (error) {
        console.error("Error calling API:", error.message);
      }
    } else {
      // Nếu bước đã hoàn thành, quay lại bước đầu tiên và cập nhật trạng thái sản phẩm trong giỏ hàng
      const updatedCart = cart.map((item) => ({
        ...item,
        statusProduct: item.statusProduct.map((status) => ({
          ...status,
          state: 1, // Đặt trạng thái là hoàn thành
          doneQuantity:
            status.doneQuantity + (item.quantity - status.doneQuantity),
        })),
      }));

      setCart(updatedCart);

      // Gửi cập nhật qua API
      try {
        const response = await axios.put(
          `http://localhost:5000/api/tables/${table._id}`,
          {
            activeStep: 0, // Cập nhật activeStep về 0
            cart: updatedCart, // Gửi giỏ hàng đã cập nhật
            notice: 1,
            request: 0,
          },
        );

        if (response.data.success) {
          console.log("Table updated successfully:", response.data.data);
        } else {
          console.error("Error updating table:", response.data.message);
        }
      } catch (error) {
        console.error("Error calling API:", error.message);
      }

      onClose(); // Đóng modal
    }
  };

  const handleBack = async () => {
    if (activeStep > 0) {
      const newActiveStep = activeStep - 1;
      setActiveStep(newActiveStep);

      // Gửi cập nhật về API khi quay lại bước trước
      try {
        const response = await axios.put(
          `http://localhost:5000/api/tables/${table._id}`,
          {
            activeStep: newActiveStep, // Cập nhật activeStep về bước trước
          },
        );

        if (!response.data.success) {
          console.error("Error updating table:", response.data.message);
        }
      } catch (error) {
        console.error("Error calling API:", error.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="h-[650px] w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold">Yêu cầu của bàn {table.name}</h2>
          <button
            onClick={onClose}
            className="text-4xl text-gray-500 hover:text-black"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="mt-6">
          <div className="relative mb-4 pt-2">
            <div className="absolute top-[43px] ml-10 h-1 w-11/12 rounded-full bg-gray-300">
              <div
                className="me-2 h-1 rounded-full bg-blue-500"
                style={{
                  width: `${(activeStep / (steps.length - 1)) * 100}%`,
                }}
              ></div>
            </div>
            <div className="relative mb-4">
              <ul className="mb-4 flex justify-between">
                {steps.map((step, index) => (
                  <li
                    key={index}
                    className="flex h-24 w-24 flex-col items-center rounded-full bg-white"
                  >
                    <div
                      className={`step flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold ${
                        activeStep >= index
                          ? "bg-blue-500 text-white"
                          : "border-2 bg-white text-gray-400"
                      }`}
                    >
                      {activeStep >= index ? (
                        <FontAwesomeIcon icon={faCheck} />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className="mt-2 text-xl font-semibold text-gray-500">
                      {index === 0
                        ? "Đã nhận"
                        : index === 1
                          ? "Đang nấu"
                          : "Gửi món"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mx-auto h-[350px] max-w-4xl overflow-y-scroll">
            <div className="grid grid-cols-2 gap-4 p-4">
              {cart?.map((cartItem, index) => (
                <div
                  key={index}
                  className="flex min-h-[180px] items-center gap-4 rounded-xl border-2 border-gray-300 p-4"
                >
                  <img
                    src={cartItem.product?.image}
                    alt={cartItem.product?.name}
                    className="h-32 w-auto object-cover"
                  />
                  <div className="flex-1">
                    <h6 className="line-clamp-2 h-16 pb-4 text-lg font-bold text-[#00561e]">
                      {cartItem.product?.name}
                    </h6>
                    <p className="pb-4 text-lg font-bold text-[#925802]">
                      Số lượng:{" "}
                      {cartItem.quantity -
                        cartItem.statusProduct[0]?.doneQuantity}
                    </p>
                    <p className="text-lg font-bold text-black">
                      Trạng thái:{" "}
                      {activeStep === 0
                        ? "Đã nhận"
                        : activeStep === 1
                          ? "Đang nấu"
                          : "Hoàn thành"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={handleBack}
              disabled={activeStep === 0}
              className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 disabled:opacity-50"
            >
              Quay lại
            </button>
            <button
              onClick={handleNext}
              className="rounded-md bg-blue-500 px-4 py-2 text-white"
            >
              {activeStep === steps.length - 1 ? "Hoàn thành" : "Tiếp theo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateRequest;
