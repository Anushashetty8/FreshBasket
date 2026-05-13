import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import profile_icon from "../assets/profile_icon.png";
import cart_icon from "../assets/cart_icon.svg";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const {
    user,
    setUser,
    navigate,
    setShowUserLogin,
    cartCount,
    searchQuery,
    setSearchQuery,
  } = useContext(AuthContext);

  // SEARCH NAVIGATION
  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/productList");
    }
  }, [searchQuery]);

  // SCROLL EFFECT
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);

    navigate("/");
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300
        ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-lg"
            : "bg-white"
        }
        border-b border-gray-200`}
      >
        <div className="flex items-center justify-between px-5 md:px-12 lg:px-20 py-4">

          {/* LOGO */}
          <Link to={"/"} className="group">
            <h1 className="text-3xl md:text-5xl font-black tracking-wide bg-gradient-to-r from-orange-500 via-green-500 to-emerald-600 bg-clip-text text-transparent group-hover:scale-105 transition duration-300">
              FreshBasket
            </h1>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-8">

            {/* NAV LINKS */}
            <div className="flex items-center gap-7 text-[17px] font-semibold text-gray-700">

              <Link
                to={"/"}
                className="relative hover:text-green-600 transition"
              >
                Home
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-green-600 transition-all duration-300 hover:w-full"></span>
              </Link>

              <Link
                to={"/ProductList"}
                className="relative hover:text-green-600 transition"
              >
                Products
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-green-600 transition-all duration-300 hover:w-full"></span>
              </Link>

              <Link
                to={"/my-orders"}
                className="relative hover:text-green-600 transition"
              >
                Orders
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-green-600 transition-all duration-300 hover:w-full"></span>
              </Link>
            </div>

            {/* SEARCH BAR */}
            <div className="flex items-center gap-3 bg-gray-100 border border-gray-200 px-5 py-3 rounded-full w-[320px] hover:shadow-md transition">

              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                className="text-gray-500"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fresh groceries..."
                className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* CART */}
            <div
              onClick={() => navigate("/cart")}
              className="relative cursor-pointer group"
            >
              <div className="bg-gradient-to-r from-green-100 to-orange-100 p-3 rounded-full shadow-sm group-hover:scale-110 transition duration-300">
                <img
                  src={cart_icon}
                  alt=""
                  className="w-7 h-7"
                />
              </div>

              <span className="absolute -top-1 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                {cartCount()}
              </span>
            </div>

            {/* USER PROFILE */}
            {user ? (
              <div className="relative group">

                <div className="flex items-center gap-2 cursor-pointer bg-gray-100 hover:bg-gray-200 transition px-3 py-2 rounded-full">
                  <img
                    src={profile_icon}
                    alt=""
                    className="w-10 h-10 rounded-full border-2 border-green-500"
                  />

                  <div className="hidden xl:block">
                    <p className="text-sm font-semibold text-gray-800">
                      Hello 👋
                    </p>

                    <p className="text-xs text-gray-500">
                      {user?.name || "User"}
                    </p>
                  </div>
                </div>

                {/* DROPDOWN */}
                <div className="absolute top-14 right-0 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-hidden">

                  <button
                    onClick={() => navigate("/my-orders")}
                    className="w-full text-left px-5 py-4 hover:bg-green-50 transition font-medium"
                  >
                    📦 My Orders
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-4 hover:bg-red-50 transition text-red-500 font-medium"
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowUserLogin(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 transition duration-300 text-white px-8 py-3 rounded-full font-semibold shadow-lg"
              >
                Login
              </button>
            )}
          </div>

          {/* MOBILE RIGHT */}
          <div className="flex lg:hidden items-center gap-4">

            {/* CART */}
            <div
              onClick={() => navigate("/cart")}
              className="relative cursor-pointer"
            >
              <img
                src={cart_icon}
                alt=""
                className="w-7 h-7"
              />

              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount()}
              </span>
            </div>

            {/* MENU BUTTON */}
            <button
              onClick={() => setOpen(!open)}
              className="flex flex-col gap-1"
            >
              <span className="w-7 h-[3px] bg-gray-700 rounded"></span>
              <span className="w-7 h-[3px] bg-gray-700 rounded"></span>
              <span className="w-7 h-[3px] bg-gray-700 rounded"></span>
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`lg:hidden transition-all duration-300 overflow-hidden
          ${
            open
              ? "max-h-[500px] py-5"
              : "max-h-0"
          } bg-white border-t border-gray-200`}
        >
          <div className="flex flex-col gap-5 px-6">

            {/* SEARCH */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="border border-gray-300 rounded-full px-5 py-3 outline-none"
            />

            <Link
              to={"/"}
              onClick={() => setOpen(false)}
              className="font-medium"
            >
              Home
            </Link>

            <Link
              to={"/ProductList"}
              onClick={() => setOpen(false)}
              className="font-medium"
            >
              Products
            </Link>

            {user ? (
              <>
                <button
                  onClick={() => {
                    navigate("/my-orders");
                    setOpen(false);
                  }}
                  className="text-left font-medium"
                >
                  My Orders
                </button>

                <button
                  onClick={handleLogout}
                  className="text-left text-red-500 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowUserLogin(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-full font-semibold"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;