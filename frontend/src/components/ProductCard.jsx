import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { assets } from "../assets/assets";
import axios from "axios";

const ProductCard = ({ product }) => {
  const context = useContext(AuthContext);
  const { navigate, addToCart, removeFromCart } = context || {};
  const cartItems = context?.cartItems || {};

  // Delete function
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/product/${id}`);
      alert("Product deleted");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  if (!product) return null;

  return (
    <div className="border border-gray-500/20 rounded-md bg-white w-56 md:px-4 px-3 py-2 flex flex-col">

      {/* Clickable area: image + name + category */}
      <div
        className="cursor-pointer"
        onClick={() => navigate(`/product/${product.category.toLowerCase()}/${product._id}`)}
      >
        <div className="group flex items-center justify-center px-2">
          <img
            className="group-hover:scale-105 transition w-32 h-32 md:w-36 md:h-36 object-contain"
            src={`${import.meta.env.VITE_BACKEND_URL}/images/${product.image?.[0]}`}
            alt={product.name}
          />
        </div>
        <p className="text-gray-700 font-medium text-lg truncate w-full mt-2">{product.name}</p>
        <p className="text-gray-500/60 text-sm">{product.category}</p>
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
      </div>

      {/* Rating */}
      <div className="flex items-center gap-0.5 mt-2">
        {Array(5)
          .fill("")
          .map((_, i) => (
            <img
              key={i}
              src={i < 4 ? assets.star_icon : assets.star_dull_icon}
              alt="rating"
              className="w-3 md:w-3.5"
            />
          ))}
        <p>(4)</p>
      </div>

      {/* Price + Cart */}
      <div className="flex items-end justify-between mt-3">
       <p className="md:text-xl text-base font-medium text-indigo-500">
  ₹{product.offerPrice.toLocaleString("en-IN")}{" "}
  <span className="text-gray-500/60 md:text-sm text-xs line-through">
    ₹{product.price.toLocaleString("en-IN")}
  </span>
</p>

        <div className="text-indigo-500" onClick={(e) => e.stopPropagation()}>
         {(product.stock ?? 0) === 0 ? (
  <button className="bg-gray-300 text-gray-500 md:w-[80px] w-[64px] h-[34px] rounded">
    Out
  </button>
) : !cartItems?.[product._id] ? (
            <button
  disabled={product.stock === 0}
  className={`flex items-center justify-center gap-1 md:w-[80px] w-[64px] h-[34px] rounded font-medium ${
    product.stock === 0
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "bg-indigo-100 border border-indigo-300 text-indigo-600"
  }`}
  onClick={() => addToCart(product._id)}
>
  {product.stock === 0 ? "Out" : "Add"}
</button>
          ) : (
            <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-indigo-500/25 rounded select-none">
              <button 
                onClick={() => removeFromCart(product._id)} className="cursor-pointer text-md px-2 h-full">
                -
              </button>
              <span className="w-5 text-center">{cartItems[product._id]}</span>
             <button
  disabled={cartItems[product._id] >= product.stock}
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