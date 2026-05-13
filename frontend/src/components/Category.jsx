import { useContext } from "react";
import { categories } from "../assets/assets";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

const Category = () => {
  const { navigate } = useContext(AuthContext);

  return (
    <div className="mt-20 px-4 md:px-8">
      {/* Heading */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Shop by Categories
          </h2>

          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Discover fresh products from top categories
          </p>
        </div>

        <button className="hidden md:block px-5 py-2 rounded-full bg-green-100 text-green-700 font-medium hover:bg-green-200 transition">
          View All
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-5">
        {categories.map((category, index) => (
          <motion.div
            whileHover={{
              y: -10,
              scale: 1.05,
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
            onClick={() => {
              navigate(
                `/products/${category.path.toLowerCase()}`
              );
              scrollTo(0, 0);
            }}
            key={index}
            className="group relative cursor-pointer overflow-hidden rounded-3xl p-5 flex flex-col items-center justify-center shadow-md hover:shadow-2xl transition-all duration-500 border border-white/30 backdrop-blur-lg"
            style={{
              background: `linear-gradient(135deg, ${category.bgColor}, #ffffff)`,
            }}
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition duration-500"></div>

            {/* Image */}
            <div className="relative z-10 bg-white rounded-full p-4 shadow-lg">
              <img
                src={category.image}
                alt={category.text}
                className="w-16 h-16 md:w-20 md:h-20 object-contain transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6"
              />
            </div>

            {/* Text */}
            <p className="relative z-10 mt-4 text-sm md:text-base font-semibold text-gray-800 text-center">
              {category.text}
            </p>

            {/* Hover Line */}
            <div className="w-0 group-hover:w-12 h-1 bg-green-500 rounded-full mt-2 transition-all duration-500"></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Category;