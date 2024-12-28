import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCheck } from "@fortawesome/free-solid-svg-icons";

const steps = ["Chờ", "Đang chuẩn bị", "Hoàn thành"]; // 3 steps

const UpdateRequest = ({ order, onClose }) => {
  const [activeStep, setActiveStep] = useState(order.activeStep);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      onClose(); // Đóng modal nếu đã hoàn thành bước cuối cùng
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="h-[650px] w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold">Yêu cầu của bàn {order.name}</h2>
          <button
            onClick={onClose}
            className="text-4xl text-gray-500 hover:text-black"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="mt-6">
          {/* Progress Bar */}
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
                  <li key={index} className="flex flex-col items-center h-24 w-24 rounded-full bg-white">
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
                    {/* Text description below each step */}
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

          {/* Step Numbers */}

          {/* Order details */}
          <div className="mx-auto h-[350px] max-w-3xl overflow-y-scroll">
            <div className="grid grid-cols-2 gap-4 p-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex min-h-[150px] items-center gap-4 rounded-xl border-2 border-gray-300 p-4"
                >
                  {/* Ảnh sản phẩm */}
                  <img
                    src={item.image} // Đảm bảo mỗi item có trường `image`
                    alt={item.name}
                    className="h-32 w-auto object-cover"
                  />

                  {/* Thông tin sản phẩm */}
                  <div className="flex-1">
                    <h6 className="text-lg font-bold text-[#00561e]">
                      {item.name}
                    </h6>
                    <p className="text-lg font-bold text-[#925802]">
                      Số lượng: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step control buttons */}
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
