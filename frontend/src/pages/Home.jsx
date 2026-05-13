import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import Category from "../components/Category";
import BestSeller from "../components/BestSeller";
import NewsLetter from "../components/NewsLetter";

const Home = () => {
  return (
    <div className="w-full">

      {/* ================= HERO SECTION ================= */}
      <div className="relative w-full overflow-hidden rounded-3xl min-h-[500px] md:min-h-[650px] shadow-2xl">

        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2070&auto=format&fit=crop"
          alt="banner"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

        {/* Floating Blur Circle */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-green-400/20 rounded-full blur-3xl"></div>

        <div className="absolute bottom-10 right-10 w-52 h-52 bg-purple-500/20 rounded-full blur-3xl"></div>

        {/* CONTENT */}
        <div className="relative z-10 flex items-center h-full px-6 md:px-20 py-20">

          <div className="max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-14 shadow-2xl">

            {/* SMALL TAG */}
            <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-300/20 text-green-100 px-4 py-2 rounded-full text-sm mb-6">
              🌿 100% Fresh Organic Products
            </div>

            {/* HEADING */}
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
              Fresh Groceries <br />
              Delivered To <br />
              Your Doorstep
            </h1>

            {/* SUBTEXT */}
            <p className="text-gray-200 text-lg md:text-xl mt-6 leading-relaxed">
              Discover farm fresh vegetables, fruits, dairy products,
              and daily essentials with fast delivery and amazing offers.
            </p>

            {/* BUTTONS */}
            <div className="mt-10 flex flex-col sm:flex-row gap-5">

              {/* SHOP NOW */}
              <Link
                to="/ProductList"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Shop Now

                <img
                  src={assets.white_arrow_icon}
                  alt="arrow"
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2"
                />
              </Link>

              {/* EXPLORE */}
              <Link
                to="/ProductList"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105"
              >
                Explore Deals
              </Link>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-6 mt-12">

              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  10K+
                </h2>

                <p className="text-gray-300 text-sm mt-1">
                  Happy Customers
                </p>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  500+
                </h2>

                <p className="text-gray-300 text-sm mt-1">
                  Fresh Products
                </p>
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  24/7
                </h2>

                <p className="text-gray-300 text-sm mt-1">
                  Fast Delivery
                </p>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* ================= CATEGORIES ================= */}
      <div className="mt-16">
        <Category />
      </div>

      {/* ================= BEST SELLER ================= */}
      <div className="mt-10">
        <BestSeller />
      </div>

      {/* ================= NEWSLETTER ================= */}
      <div className="mt-16 mb-10">
        <NewsLetter />
      </div>

    </div>
  );
};

export default Home;