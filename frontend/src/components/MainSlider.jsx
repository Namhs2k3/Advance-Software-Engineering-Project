import imgBackground from "../../../backend/assets/img_background.png"; // Đường dẫn tới ảnh

const MainSlider = () => {
  return (
    <div className="flex flex-col-reverse items-center justify-center gap-x-0 lg:flex-row">
      <div className="content mb-8 mt-8 px-4 text-[#633c02] lg:ml-32 lg:mt-8">
        <h1 className="animated-title mb-3 text-4xl font-bold lg:text-5xl">
          ĐÔNG ĐẾN GIẢM 30%
        </h1>
        <h4 className="mb-6 font-josefin text-2xl">
          Áp dụng cho học sinh sinh viên
        </h4>
        <a
          href="/menu"
          className="btn-buy rounded-lg bg-[#d88453] px-6 font-josefin py-3 text-2xl text-white hover:rounded-3xl hover:bg-[#633c02] "
        >
          Mua ngay
        </a>
      </div>
      <div className="image-container mt-4 lg:mt-0">
        <img
          src={imgBackground}
          alt="Background"
          className="background-image h-auto w-full"
        />
      </div>
    </div>
  );
};

export default MainSlider;
