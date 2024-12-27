import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import ModalProduct from "./ModalProduct";
import axios from "axios";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Loading from "../components/website/Loading";

const ProductSlider = () => {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const swiperRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);
  const [loading, setLoading] = useState(true);

  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.5 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/mainPages");
        if (response.data.success) {
          setProducts(response.data.data);
        } else {
          console.error("Failed to fetch products.");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    setSelectedProduct(product);
  };

  const handleToggleFavorite = (productId) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [productId]: !prevFavorites[productId],
    }));
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setQuantity(1);
  };

  return (
    <div
      className="product-slider relative mx-auto mb-20 max-w-screen-xl overflow-visible bg-white px-5 py-10"
      ref={ref}
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <div className="slider-title my-6 text-center text-4xl font-bold text-[#633c02]">
        Sản phẩm bán chạy
      </div>
      <div className="divider mx-auto mb-14 h-1 w-12 bg-[#633c02]"></div>
      {loading ? (
        // Hiển thị phần loading nếu dữ liệu chưa được tải
        <div className="flex h-[255px] w-full items-center justify-center lg:h-[350px]">
          <Loading /> {/* Hiển thị Loading khi đang tải dữ liệu */}
        </div>
      ) : (
        <Swiper
          ref={swiperRef}
          spaceBetween={0}
          slidesPerView={5}
          navigation={{
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          }}
          breakpoints={{
            430: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 5 },
          }}
        >
          {products.map((product, index) => (
            <SwiperSlide key={product._id}>
              <motion.div
                className="product-card group relative flex h-[350px] flex-col justify-between border-l border-r border-[#e7e6e6] bg-white p-4 text-center hover:border-l-2 hover:border-r-2 hover:border-t-2 hover:border-[#d5d5d5]"
                initial="hidden"
                animate={controls}
                variants={{
                  hidden: { opacity: 0, y: 100 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: index * 0.2,
                      type: "spring",
                      stiffness: 80,
                    },
                  },
                }}
              >
                <div className="product-image">
                  <Link to={`/detailfood/${product._id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="mx-auto h-[223px] transform transition-transform duration-300 ease-in-out group-hover:scale-110"
                    />
                  </Link>
                </div>
                <div className="product-bubble absolute right-4 top-2 rounded-full bg-[#ff4d4f] px-2 py-1 font-josefin text-sm text-white">
                  HOT
                </div>
                <div className="product-info mb-10 mt-2">
                  <h6 className="product-name font-josefin text-xl font-bold text-[#00561e]">
                    <Link to={`/detailfood/${product._id}`}>
                      {product.name.split(" ").slice(0, 4).join(" ")}
                      {/* Giới hạn 20 từ */}
                      {product.name.split(" ").length > 4 && "..."}{" "}
                      {/* Hiển thị ... nếu vượt quá 20 từ */}
                    </Link>
                  </h6>

                  <div className="product-price">
                    <span className="font-josefin text-base font-bold text-[#9d6817]">
                      {product.sell_price.toLocaleString()} đ
                    </span>
                    {product.price !== product.sell_price && (
                      <span className="price-old ml-2 text-sm font-bold text-[#999] line-through">
                        {product.price.toLocaleString()} đ
                      </span>
                    )}
                  </div>
                </div>

                <div className="red-button absolute bottom-0 left-0 w-full opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full cursor-pointer bg-[#d88453] py-3 text-sm font-semibold text-white transition-colors duration-300 ease-in-out hover:bg-[#633c02]"
                  >
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      <div
        className="swiper-button-prev"
        style={{
          backgroundColor: "rgba(78, 78, 78, 0.5)",
          color: "#fff",
          width: "40px",
          height: "70px",
          marginTop: "10px",
          marginLeft: "10px",
          display: showArrows ? "flex" : "none", // Hiển thị khi hover
          justifyContent: "center", // Căn giữa theo chiều ngang
          alignItems: "center", // Căn giữa theo chiều dọc
          fontSize: "30px", // Kích thước chữ
        }}
        onClick={() => swiperRef.current?.swiper.slidePrev()}
      ></div>

      <div
        className="swiper-button-next"
        style={{
          backgroundColor: "rgba(78, 78, 78, 0.5)",
          color: "#fff",
          width: "40px",
          height: "70px",
          marginTop: "10px",
          marginRight: "10px",
          display: showArrows ? "flex" : "none", // Hiển thị khi hover
          justifyContent: "center", // Căn giữa theo chiều ngang
          alignItems: "center", // Căn giữa theo chiều dọc
          fontSize: "30px", // Kích thước chữ
        }}
        onClick={() => swiperRef.current?.swiper.slideNext()}
      ></div>

      {selectedProduct && (
        <ModalProduct
          selectedProduct={selectedProduct}
          quantity={quantity}
          setQuantity={setQuantity}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ProductSlider;
