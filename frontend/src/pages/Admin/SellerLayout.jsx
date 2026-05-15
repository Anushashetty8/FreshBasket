import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { assets } from "../../assets/assets";
import { NavLink, Outlet } from "react-router-dom";

const SellerLayout = () => {
  const { logout } = useContext(AuthContext);

  const sidebarLinks = [
    {
      name: "Add Product",
      path: "/seller",
      icon: assets.add_icon,
    },
    {
      name: "Product List",
      path: "/seller/product-list",
      icon: assets.product_list_icon,
    },
    {
      name: "Orders",
      path: "/seller/orders",
      icon: assets.order_icon,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ================= TOP HEADER ================= */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 bg-white/80 backdrop-blur-md border-b border-gray-200">

        {/* BRAND */}
        <div className="flex items-center gap-5">

          {/* BIG LOGO */}
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-3xl">
              F
            </span>
          </div>

          {/* BRAND TEXT */}
          <div className="leading-tight">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent tracking-wide">
              FreshBasket
            </h1>

            <p className="text-base text-gray-500 hidden md:block">
              Admin Dashboard
            </p>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6 md:gap-10">

          <p className="text-lg md:text-xl font-medium text-gray-700 hidden md:block">
            Hi, Admin 👋
          </p>

          <button
            onClick={logout}
            className="px-6 py-2.5 text-base font-medium rounded-full border border-gray-300
            hover:bg-red-500 hover:text-white hover:border-red-500
            transition-all duration-300 shadow-sm"
          >
            Logout
          </button>

        </div>

      </header>

      {/* ================= MAIN AREA ================= */}
      <div className="flex flex-1">

        {/* ================= SIDEBAR ================= */}
        <aside className="md:w-64 w-20 bg-white border-r border-gray-200 pt-6 flex flex-col">

          {sidebarLinks.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/seller"}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-4 mx-2 rounded-xl transition-all duration-200
                ${
                  isActive
                    ? "bg-indigo-500/10 text-indigo-600 border-r-4 border-indigo-500"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <img
                src={item.icon}
                alt={item.name}
                className="w-7 h-7"
              />

              <span className="hidden md:block text-base font-medium">
                {item.name}
              </span>
            </NavLink>
          ))}

        </aside>

        {/* ================= PAGE CONTENT ================= */}
        <main className="flex-1 p-6 md:p-10">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default SellerLayout;