import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { assets } from "../assets/assets";
import axios from "axios";

const ProductCard = ({ product }) => {
  const context = useContext(AuthContext);

  const { navigate, addToCart, removeFromCart } = context || {};

  const cartItems = context?.cartItems || {};

  // =========================
  // DELETE PRODUCT
  // =========================

  const deleteProduct = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/${id}`
      );

      alert("Product deleted");

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  if (!product) return null;

  // =========================
  // EXPIRY DATE CALCULATION
  // =========================

  let expiryMessage = "";
  let expiryColor = "text-gray-500";

  if (product.expiryDate) {
    // Today's date only
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Expiry date only
    const expiry = new Date(product.expiryDate);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry - today;

    const diffDays = Math.floor(
      diffTime / (1000 * 60 * 60 * 24)
    );

    // EXPIRED
    if (diffDays < 0) {
      expiryMessage = "Expired";
      expiryColor = "text-red-600";
    }

    // TODAY
    else if (diffDays === 0) {
      expiryMessage = "Expires Today";
      expiryColor = "text-red-500";
    }

    // 1-3 DAYS
    else if (diffDays <= 3) {
      expiryMessage = `Expires in ${diffDays} day${
        diffDays > 1 ? "s" : ""
      }`;

      expiryColor = "text-orange-500";
    }

    // MORE THAN 3 DAYS
    else {
      expiryMessage = `Expires in ${diffDays} days`;

      expiryColor = "text-green-600";
    }
  }

  return (
    <div className="border border-gray-300 rounded-md bg-white w-56 md:px-4 px-3 py-3 flex flex-col shadow-sm hover:shadow-md transition">

      {/* CLICKABLE AREA */}
      <div
        className="cursor-pointer"
        onClick={() =>
          navigate(
            `/product/${product.category.toLowerCase()}/${product._id}`
          )
        }
      >

        {/* PRODUCT IMAGE */}
        <div className="group flex items-center justify-center px-2">
          <img
            className="group-hover:scale-105 transition duration-300 w-32 h-32 md:w-36 md:h-36 object-contain"
            src={`${import.meta.env.VITE_BACKEND_URL}/images/${product.image?.[0]}`}
            alt={product.name}
          />
        </div>

        {/* PRODUCT NAME */}
        <p className="text-gray-800 font-semibold text-lg truncate mt-2">
          {product.name}
        </p>

        {/* CATEGORY */}
        <p className="text-gray-500 text-sm">
          {product.category}
        </p>

        {/* STOCK */}
        <p className="text-sm font-medium mt-1">
          {(product.stock ?? 0) > 0 ? (
            <span className="text-red-500">
              Only {product.stock} left
            </span>
          ) : (
            <span className="text-gray-400">
              Out of stock
            </span>
          )}
        </p>

        {/* EXPIRY DATE */}
        {product.expiryDate && (
          <div className="mt-1">
            <p className="text-xs text-gray-500">
              Expiry:{" "}
              {new Date(product.expiryDate).toLocaleDateString(
                "en-IN"
              )}
            </p>

            <p className={`text-xs font-semibold mt-1 ${expiryColor}`}>
              {expiryMessage}
            </p>
          </div>
        )}
      </div>

      {/* RATING */}
      <div className="flex items-center gap-0.5 mt-3">
        {Array(5)
          .fill("")
          .map((_, i) => (
            <img
              key={i}
              src={
                i < 4
                  ? assets.star_icon
                  : assets.star_dull_icon
              }
              alt="rating"
              className="w-3 md:w-3.5"
            />
          ))}

        <p className="text-sm ml-1">(4)</p>
      </div>

      {/* PRICE + CART */}
      <div className="flex items-end justify-between mt-4">

        {/* PRICE */}
        <div>
          <p className="md:text-xl text-base font-semibold text-indigo-600">
            ₹{product.offerPrice?.toLocaleString("en-IN")}
          </p>

          <p className="text-gray-500 text-xs line-through">
            ₹{product.price?.toLocaleString("en-IN")}
          </p>
        </div>

        {/* CART BUTTONS */}
        <div
          className="text-indigo-500"
          onClick={(e) => e.stopPropagation()}
        >

          {/* OUT OF STOCK */}
          {(product.stock ?? 0) === 0 ? (
            <button className="bg-gray-300 text-gray-500 md:w-[80px] w-[64px] h-[34px] rounded cursor-not-allowed">
              Out
            </button>
          ) : !cartItems?.[product._id] ? (

            /* ADD BUTTON */
            <button
              className="flex items-center justify-center gap-1 md:w-[80px] w-[64px] h-[34px] rounded font-medium bg-indigo-100 border border-indigo-300 text-indigo-600 hover:bg-indigo-200 transition"
              onClick={() => addToCart(product._id)}
            >
              Add
            </button>

          ) : (

            /* QUANTITY BUTTONS */
            <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-indigo-100 rounded select-none">

              {/* MINUS */}
              <button
                onClick={() =>
                  removeFromCart(product._id)
                }
                className="cursor-pointer text-md px-2 h-full"
              >
                -
              </button>

              {/* QUANTITY */}
              <span className="w-5 text-center text-sm">
                {cartItems[product._id]}
              </span>

              {/* PLUS */}
              <button
                disabled={
                  cartItems[product._id] >= product.stock
                }
                onClick={() => addToCart(product._id)}
                className={`text-md px-2 h-full ${
                  cartItems[product._id] >= product.stock
                    ? "cursor-not-allowed opacity-40"
                    : "cursor-pointer"
                }`}
              >
                +
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;