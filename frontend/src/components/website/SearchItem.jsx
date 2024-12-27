import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Loading from "./Loading"
import { Link } from "react-router-dom"; 

const SearchItem = () => {
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [products, setProducts] = useState([]); // State to store search results
  const [isPopoverVisible, setPopoverVisible] = useState(false); // To control the visibility of the popover
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Handle showing/hiding the popover
  const handlePopoverEnter = () => setPopoverVisible(true);
  const handlePopoverLeave = () => setPopoverVisible(false);

  // Fetch products as the user types
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setProducts([]);
      return; // Do nothing if the search term is empty
    }

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `http://localhost:5000/api/products?searchTerm=${searchTerm}`,
        );
        setProducts(response.data.data); // Update products state
      } catch (error) {
        setError("Error fetching products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts(); // Call the function to fetch products

    // Add delay to avoid calling the API on every keystroke immediately (debounce effect)
    const timeoutId = setTimeout(() => fetchProducts(), 500);

    return () => clearTimeout(timeoutId); // Clean up the timeout on component unmount or searchTerm change
  }, [searchTerm]); // This effect runs whenever searchTerm changes

  return (
    <div
      className="relative"
      onMouseEnter={handlePopoverEnter}
      onMouseLeave={handlePopoverLeave}
    >
      <button className="cursor-pointer text-2xl text-[#333] transition-all duration-300">
        <FontAwesomeIcon icon={faSearch} />
      </button>

      {isPopoverVisible && (
        <div className="absolute right-[-8rem] top-[2rem] z-10 w-[300px] bg-white p-2 shadow-lg">
          <div className="flex items-center">
            <input
              type="text"
              className="flex-1 border border-gray-300 p-2"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm state on input change
            />
            <button className="bg-black p-2 text-white transition-all duration-300 hover:bg-gray-300 hover:text-black">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>

          {/* Display loading, error, or results */}
          {loading && (
            <div className="mt-2">
              <Loading />
            </div>
          )}
          {error && <div className="mt-2 text-red-500">{error}</div>}

          {products.length > 0 && (
            <div className="mt-2 bg-white">
              <ul className="max-h-96 overflow-y-auto">
                {products.map((product) => (
                  <li
                    key={product._id}
                    className="border-b border-gray-200 py-2"
                  >
                    <Link
                      to={`/detailfood/${product._id}`}
                      className="block hover:bg-gray-100"
                    >
                      <div className="flex items-center space-x-4">
                        {/* Image Section */}
                        <div className="h-24 w-[60px]">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-24 w-auto rounded-md object-cover"
                          />
                        </div>

                        {/* Product Info Section */}
                        <div className="flex-1">
                          {/* Product Name */}
                          <div className="h-12 flex items-center font-josefin text-2xl font-bold text-[#00561e]">
                            {product.name}
                          </div>

                          {/* Product Price */}
                          <div className="mt-4 font-josefin text-lg font-bold text-[#925802]">
                            {product.sell_price.toLocaleString()} ₫
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchItem;
