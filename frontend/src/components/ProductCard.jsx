import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { assets } from "../assets/assets";
import axios from "axios";

const ProductCard = ({ product }) => {
  const context = useContext(AuthContext);

  const { navigate, addToCart, removeFromCart } = context || {};

  const cartItems = context?.cartItems || {};

  // ================= DELETE PRODUCT =================
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

  // ================= EXPIRY DATE =================
  let expiryMessage = "";
  let expiryColor = "text-gray-500";

  if (product.expiryDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(product.expiryDate);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry - today;

    const diffDays = Math.floor(
      diffTime / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) {
      expiryMessage = "Expired";
      expiryColor = "text-red-600";
    } else if (diffDays === 0) {
      expiryMessage = "Expires Today";
      expiryColor = "text-red-500";
    } else if (diffDays <= 3) {
      expiryMessage = `Expires in ${diffDays} day${
        diffDays > 1 ? "s" : ""
      }`;

      expiryColor = "text-orange-500";
    } else {
      expiryMessage = `Fresh for ${diffDays} days`;

      expiryColor = "text-green-600";
    }
  }

  // ================= IMAGE FIX =================
  const getProductImage = () => {

    // CASE 1 => image array
    if (
      Array.isArray(product.image) &&
      product.image.length > 0
    ) {

      const img = product.image[0];

      // cloudinary/full url
      if (img.startsWith("http")) {
        return img;
      }

      // local upload
      return `${import.meta.env.VITE_BACKEND_URL}/images/${img}`;
    }

    // CASE 2 => image string
    if (typeof product.image === "string") {

      // cloudinary/full url
      if (product.image.startsWith("http")) {
        return product.image;
      }

      // local upload
      return `${import.meta.env.VITE_BACKEND_URL}/images/${product.image}`;
    }

    // fallback image
    return "https://placehold.co/300x300?text=No+Image";
  };

  return (
    <div
      className="
      group
      bg-white
      rounded-3xl
      overflow-hidden
      shadow-md
      hover:shadow-2xl
      transition-all
      duration-500
      border
      border-gray-100
      h-[560px]
      flex
      flex-col
      "
    >

      {/* CLICKABLE AREA */}
      <div
        className="flex flex-col h-full cursor-pointer"
        onClick={() =>
          navigate(
            `/product/${product.category.toLowerCase()}/${product._id}`
          )
        }
      >

        {/* IMAGE SECTION */}
        <div
          className="
          relative
          bg-gradient-to-b
          from-gray-50
          to-gray-100
          h-[250px]
          flex
          items-center
          justify-center
          overflow-hidden
          "
        >

          {/* SALE BADGE */}
          <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
            SALE
          </div>

          {/* PRODUCT IMAGE */}
          <img
            className="
            hover:scale-110
            transition
            duration-500
            w-[180px]
            h-[180px]
            object-contain
            "
            src={getProductImage()}
            alt={product.name}
            onError={(e) => {
              e.target.src =
                "https://placehold.co/300x300?text=No+Image";
            }}
          />

        </div>

        {/* CONTENT */}
        <div className="flex flex-col justify-between flex-1 p-5">

          {/* TOP CONTENT */}
          <div>

            {/* CATEGORY */}
            <p className="text-sm text-indigo-500 font-semibold uppercase tracking-wide">
              {product.category}
            </p>

            {/* PRODUCT NAME */}
            <h3
              className="
              text-xl
              font-bold
              text-gray-800
              mt-2
              h-[56px]
              overflow-hidden
              "
            >
              {product.name}
            </h3>

            {/* STOCK */}
            <div className="mt-3 h-[30px]">

              {(product.stock ?? 0) > 0 ? (
                <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                  {product.stock} Items Left
                </span>
              ) : (
                <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-medium">
                  Out of Stock
                </span>
              )}

            </div>

            {/* EXPIRY */}
            <div className="mt-3 h-[50px]">

              {product.expiryDate ? (
                <>
                  <p className="text-xs text-gray-500">
                    Expiry:{" "}
                    {new Date(product.expiryDate).toLocaleDateString(
                      "en-IN"
                    )}
                  </p>

                  <p
                    className={`text-sm font-semibold mt-1 ${expiryColor}`}
                  >
                    {expiryMessage}
                  </p>
                </>
              ) : (
                <div className="h-[40px]" />
              )}

            </div>

            {/* RATING */}
            <div className="flex items-center gap-1 mt-3 h-[24px]">

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
                    className="w-4"
                  />
                ))}

              <span className="text-sm text-gray-500 ml-1">
                4.0
              </span>

            </div>

          </div>

          {/* BOTTOM */}
          <div className="mt-6">

            {/* PRICE + CART */}
            <div className="flex items-center justify-between">

              {/* PRICE */}
              <div>

                <p className="text-2xl font-extrabold text-indigo-600">
                  ₹{product.offerPrice?.toLocaleString("en-IN")}
                </p>

                <p className="text-sm text-gray-400 line-through">
                  ₹{product.price?.toLocaleString("en-IN")}
                </p>

              </div>

              {/* CART */}
              <div onClick={(e) => e.stopPropagation()}>

                {(product.stock ?? 0) === 0 ? (

                  <button className="bg-gray-300 text-gray-500 px-5 py-2 rounded-xl cursor-not-allowed w-[110px]">
                    Out
                  </button>

                ) : !cartItems?.[product._id] ? (

                  <button
                    className="
                    bg-indigo-600
                    hover:bg-indigo-700
                    text-white
                    w-[110px]
                    py-2
                    rounded-xl
                    font-medium
                    transition
                    "
                    onClick={() => addToCart(product._id)}
                  >
                    Add
                  </button>

                ) : (

                  <div
                    className="
                    flex
                    items-center
                    justify-center
                    gap-4
                    bg-indigo-100
                    w-[110px]
                    py-2
                    rounded-xl
                    "
                  >

                    <button
                      onClick={() =>
                        removeFromCart(product._id)
                      }
                      className="text-lg font-bold"
                    >
                      -
                    </button>

                    <span className="font-semibold">
                      {cartItems[product._id]}
                    </span>

                    <button
                      disabled={
                        cartItems[product._id] >=
                        product.stock
                      }
                      onClick={() =>
                        addToCart(product._id)
                      }
                      className={`text-lg font-bold ${
                        cartItems[product._id] >=
                        product.stock
                          ? "opacity-40 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      +
                    </button>

                  </div>

                )}

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductCard;