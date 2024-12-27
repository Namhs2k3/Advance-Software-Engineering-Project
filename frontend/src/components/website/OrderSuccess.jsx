import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons"; // Sử dụng icon từ gói regular (light style)

const OrderSuccessPage = () => {
  return (
    <div className="success-container sm:mb-32 sm:mt-32 flex flex-col place-content-center items-center mb-28 mt-20">
      <FontAwesomeIcon
        icon={faCircleCheck}
        className="text-7xl text-green-500"
      />
      <h1 className="mt-4 font-josefin text-3xl font-bold text-center">
        Chúc mừng! Đơn hàng của bạn đã được thanh toán thành công!
      </h1>
      <p className="mt-2 font-josefin text-lg font-bold text-center">
        Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi. Đơn hàng của bạn sẽ
        sớm được xử lý và giao đến bạn.
      </p>
      <a
        href="/menu"
        className="mt-8 rounded-lg bg-[#d88453] px-6 pt-4 pb-2 text-2xl font-josefin text-white hover:rounded-3xl hover:bg-[#633c02]"
      >
        Tiếp tục mua sắm
      </a>
    </div>
  );
};

export default OrderSuccessPage;
