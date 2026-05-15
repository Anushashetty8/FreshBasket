import { useContext, useState } from "react";
import React from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ShoppingBag,
  ShoppingBasket,
  ArrowRight,
} from "lucide-react";

const Login = () => {
  const [state, setState] = React.useState("login");

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = useState("");

  const [forgotMode, setForgotMode] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const { setShowUserLogin, setUser, axios, navigate } =
    useContext(AuthContext);

  // ================= LOGIN / REGISTER =================
  const submitHandler = async (e) => {
    try {
      e.preventDefault();

      if (state === "register") {
        if (!name || !email || !password) {
          toast.error("All fields are required");
          return;
        }
      }

      const endpoint =
        state === "login"
          ? "/api/user/login"
          : "/api/user/register";

      const payload =
        state === "login"
          ? { email, password }
          : { name, email, password };

      const { data } = await axios.post(endpoint, payload);

      if (data.success) {
        toast.success(data.message);

        setUser(data.user);

        setShowUserLogin(false);

        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred."
      );
    }
  };

  // ================= FORGOT PASSWORD =================
  const forgotPasswordHandler = async (e) => {
    try {
      e.preventDefault();

      if (!email) {
        toast.error("Enter your email");
        return;
      }

      const { data } = await axios.post(
        "/api/user/forgot-password",
        { email }
      );

      if (data.success) {
        toast.success(data.message);
        setForgotMode(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* ================= NAVBAR ================= */}
      <nav className="w-full bg-white shadow-md px-8 py-5 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-2xl text-white shadow-lg">
            <ShoppingBasket size={34} />
          </div>

          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            FreshBasket
          </h1>
        </div>

        {/* MENU */}
        <div className="hidden md:flex items-center gap-10 text-lg font-semibold">
          
          <NavLink
            to="/"
            className={({ isActive }) =>
              `transition hover:text-indigo-600 ${
                isActive
                  ? "text-indigo-600"
                  : "text-gray-700"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `transition hover:text-indigo-600 ${
                isActive
                  ? "text-indigo-600"
                  : "text-gray-700"
              }`
            }
          >
            Products
          </NavLink>

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `transition hover:text-indigo-600 ${
                isActive
                  ? "text-indigo-600"
                  : "text-gray-700"
              }`
            }
          >
            Orders
          </NavLink>

          <NavLink
            to="/login"
            className={({ isActive }) =>
              `transition hover:text-indigo-600 ${
                isActive
                  ? "text-indigo-600"
                  : "text-gray-700"
              }`
            }
          >
            Login
          </NavLink>
        </div>
      </nav>

      {/* ================= LOGIN MODAL ================= */}
      <div
        onClick={() => setShowUserLogin(false)}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-5xl grid md:grid-cols-2 overflow-hidden rounded-3xl shadow-2xl bg-white"
        >
          {/* LEFT SIDE */}
          <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-10 text-white relative overflow-hidden">
            
            <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-24 -translate-y-24"></div>

            <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/10 rounded-full translate-x-24 translate-y-24"></div>

            <div className="relative z-10">
              <div className="bg-white/20 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                <ShoppingBag size={40} />
              </div>

              <h1 className="text-5xl font-bold leading-tight">
                Welcome Back
              </h1>

              <p className="mt-6 text-lg text-white/90 leading-8">
                Login to continue shopping, track your
                orders, manage your cart and enjoy a
                premium grocery delivery experience.
              </p>

              <div className="mt-10 flex items-center gap-3 text-lg font-medium">
                <span>Fresh Basket</span>
                <ArrowRight size={20} />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <form
            onSubmit={
              forgotMode
                ? forgotPasswordHandler
                : submitHandler
            }
            className="bg-white p-8 md:p-12 flex flex-col justify-center"
          >
            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={() => setShowUserLogin(false)}
              className="self-end text-2xl text-gray-400 hover:text-black transition"
            >
              ×
            </button>

            {/* TITLE */}
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-800">
                {forgotMode
                  ? "Forgot Password"
                  : state === "login"
                  ? "Login"
                  : "Create Account"}
              </h2>

              <p className="text-gray-500 mt-2">
                {forgotMode
                  ? "We’ll send a password reset link"
                  : "Access your account instantly"}
              </p>
            </div>

            {/* NAME */}
            {state === "register" && !forgotMode && (
              <div className="mb-5">
                <label className="text-sm font-semibold text-gray-600">
                  Full Name
                </label>

                <div className="flex items-center gap-3 border-2 border-gray-200 rounded-xl px-4 py-3 mt-2 focus-within:border-indigo-500 transition">
                  <User size={20} className="text-gray-400" />

                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full outline-none bg-transparent"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    required
                  />
                </div>
              </div>
            )}

            {/* EMAIL */}
            <div className="mb-5">
              <label className="text-sm font-semibold text-gray-600">
                Email Address
              </label>

              <div className="flex items-center gap-3 border-2 border-gray-200 rounded-xl px-4 py-3 mt-2 focus-within:border-indigo-500 transition">
                <Mail size={20} className="text-gray-400" />

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full outline-none bg-transparent"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            {!forgotMode && (
              <div className="mb-3">
                <label className="text-sm font-semibold text-gray-600">
                  Password
                </label>

                <div className="flex items-center gap-3 border-2 border-gray-200 rounded-xl px-4 py-3 mt-2 focus-within:border-indigo-500 transition">
                  <Lock size={20} className="text-gray-400" />

                  <input
                    type={
                      showPassword ? "text" : "password"
                    }
                    placeholder="Enter your password"
                    className="w-full outline-none bg-transparent"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? (
                      <EyeOff
                        size={20}
                        className="text-gray-400"
                      />
                    ) : (
                      <Eye
                        size={20}
                        className="text-gray-400"
                      />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* FORGOT PASSWORD */}
            {!forgotMode && state === "login" && (
              <div className="w-full text-right mb-6">
                <button
                  type="button"
                  onClick={() => setForgotMode(true)}
                  className="text-indigo-600 text-sm font-medium hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* BUTTON */}
            <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold text-lg shadow-lg hover:scale-[1.02] transition-all duration-300">
              {forgotMode
                ? "Send Reset Link"
                : state === "register"
                ? "Create Account"
                : "Login"}
            </button>

            {/* SWITCH */}
            {!forgotMode ? (
              <div className="mt-6 text-center text-gray-600">
                {state === "login" ? (
                  <>
                    Don’t have an account?{" "}
                    <button
                      type="button"
                      onClick={() =>
                        setState("register")
                      }
                      className="text-indigo-600 font-semibold hover:underline"
                    >
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() =>
                        setState("login")
                      }
                      className="text-indigo-600 font-semibold hover:underline"
                    >
                      Login
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="mt-6 text-center text-gray-600">
                Back to{" "}
                <button
                  type="button"
                  onClick={() => setForgotMode(false)}
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  Login
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;