import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";

const BestSeller = () => {
  const { products } = useContext(AuthContext);

  return (
    <div className="mt-24 px-4 md:px-8">
      {/* Heading Section */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Best Sellers
          </h2>

          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Most loved fresh products by our customers
          </p>
        </div>

        <button className="hidden md:block px-6 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium shadow-lg hover:scale-105 transition duration-300">
          View More
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {products
          .filter((product) => product.inStock)
          .slice(0, 5)
          .map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              viewport={{ once: true }}
              whileHover={{
                y: -12,
              }}
              className="relative"
            >
              {/* Trending Badge */}
              <div className="absolute -top-3 left-3 z-20 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-1 rounded-full shadow-md font-semibold">
                🔥 Trending
              </div>

              {/* Glow Background */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-200/30 to-emerald-200/30 blur-xl opacity-0 hover:opacity-100 transition duration-500"></div>

              {/* Product Card */}
              <div className="relative bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
                <ProductCard product={product} />
              </div>
            </motion.div>
          ))}
      </div>

      {/* Bottom Banner */}
      <div className="mt-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl overflow-hidden relative">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            Fresh Deals Everyday
          </h3>

          <p className="text-green-100 mt-3 max-w-lg">
            Save more with exclusive offers on groceries,
            vegetables, fruits, and daily essentials.
          </p>
        </div>

        <button className="relative z-10 mt-6 md:mt-0 px-8 py-4 bg-white text-green-700 font-semibold rounded-2xl shadow-lg hover:scale-105 transition duration-300">
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default BestSeller;