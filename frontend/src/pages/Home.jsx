import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import Category from "../components/Category";
import BestSeller from "../components/BestSeller";
import NewsLetter from "../components/NewsLetter";

const Home = () => {
  return (
    <div>
      {/* Banner Section with background*/}
      <div className="relative w-full bg-green-100 rounded-lg overflow-hidden">
        <img
          src={assets.main_banner_bg}
          alt="background desktop"
          className="hidden md:block w-full"
        />
        <img
          src={assets.main_banner_bg_sm}
          alt="background mobile"
          className="md:hidden w-full"
        />

        {/* Text overlay */}
        <div className="absolute inset-0 flex items-center justify-center md:justify-start px-8 md:px-24 py-12">
          <div className="text-center md:text-left max-w-xl">
            <h1 className="text-xl md:text-2xl font-bold text-green-900 leading-tight">
              Freshness You Can <br />
              Trust, Savings You <br />
              will Love!
            </h1>

            {/* Buttons */}
            <div className="mt-8 flex flex-col md:flex-row items-center md:items-start gap-4">
              <Link
                to="/ProductList"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-800 text-white font-semibold rounded-md hover:bg-purple-900 transition duration-300"
              >
                <span>Shop Now</span>
                <img
                  src={assets.white_arrow_icon}
                  alt="arrow"
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/ProductList"
                className="inline-flex items-center justify-center px-6 py-3 bg-purple-800 text-white font-semibold rounded-md hover:bg-purple-900 transition duration-300"
              >
                <span>Explore Deals</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <Category />
      <BestSeller />
      <NewsLetter />
    </div>
  );
};

export default Home;