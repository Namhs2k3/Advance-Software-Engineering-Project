import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons"; // Sử dụng icon từ gói regular (light style)

const OrderSuccessPage = () => {
  return (
    <div className="success-container mb-28 mt-20 flex flex-col place-content-center items-center sm:mb-32 sm:mt-32">
      <FontAwesomeIcon
        icon={faCircleCheck}
        className="text-7xl text-green-500"
      />
      <h1 className="mt-4 text-center font-josefin text-3xl font-bold">
        Đơn hàng đã được thanh toán thành công!
      </h1>
      <p className="mt-2 text-center font-josefin text-lg font-bold">
        Vui lòng để ý thông báo từ đầu bếp để phục vụ món cho khách hàng
      </p>
      <a
        href="/menu"
        className="mt-8 rounded-lg bg-[#d88453] px-6 pb-2 pt-4 font-josefin text-2xl text-white hover:rounded-3xl hover:bg-[#633c02]"
      >
        Hoàn Tất
      </a>
    </div>
  );
};

export default OrderSuccessPage;
