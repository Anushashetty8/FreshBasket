import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { Eye, EyeOff, ShieldCheck, Mail, Lock } from "lucide-react";

const SellerLogin = () => {
  const {
    isSeller,
    setIsSeller,
    navigate,
    setShowUserLogin,
    axios,
  } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // AUTO REDIRECT
  useEffect(() => {
    if (isSeller) {
      navigate("/seller");
    }
  }, [isSeller, navigate]);

  // LOGIN
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await axios.post("/api/seller/login", {
        email,
        password,
      });

      if (data.success) {
        setIsSeller(true);

        localStorage.setItem("isSeller", "true");

        toast.success(data.message);

        navigate("/seller");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    !isSeller && (
      <div
        onClick={() => setShowUserLogin(false)}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-black px-4"
      >
        {/* BACKGROUND EFFECT */}
        <div className="absolute w-[400px] h-[400px] bg-indigo-500/30 blur-3xl rounded-full top-[-100px] left-[-100px]" />
        <div className="absolute w-[400px] h-[400px] bg-purple-500/30 blur-3xl rounded-full bottom-[-100px] right-[-100px]" />

        {/* LOGIN CARD */}
        <form
          onClick={(e) => e.stopPropagation()}
          onSubmit={submitHandler}
          className="relative z-10 w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8 text-white"
        >
          {/* TOP ICON */}
          <div className="flex justify-center mb-5">
            <div className="bg-indigo-500 p-4 rounded-full shadow-lg">
              <ShieldCheck size={34} />
            </div>
          </div>

          {/* HEADING */}
          <h1 className="text-3xl font-bold text-center">
            Admin Dashboard
          </h1>

          <p className="text-center text-gray-300 mt-2 mb-8">
            Login to manage products, orders & analytics
          </p>

          {/* EMAIL */}
          <div className="mb-5">
            <label className="text-sm text-gray-200">Email Address</label>

            <div className="flex items-center mt-2 bg-white/10 border border-white/20 rounded-xl px-4">
              <Mail size={18} className="text-gray-300" />

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent outline-none px-3 py-4 text-white placeholder:text-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="mb-3">
            <label className="text-sm text-gray-200">Password</label>

            <div className="flex items-center mt-2 bg-white/10 border border-white/20 rounded-xl px-4">
              <Lock size={18} className="text-gray-300" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full bg-transparent outline-none px-3 py-4 text-white placeholder:text-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} className="text-gray-300" />
                ) : (
                  <Eye size={20} className="text-gray-300" />
                )}
              </button>
            </div>
          </div>

          {/* FORGOT PASSWORD */}
          <div className="flex justify-end mb-6">
            <button
              type="button"
              className="text-sm text-indigo-300 hover:text-indigo-200 transition"
            >
              Forgot Password?
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-[1.02] active:scale-100 transition-all duration-300 font-semibold shadow-lg"
          >
            {loading ? "Logging in..." : "Login to Dashboard"}
          </button>

          {/* BOTTOM */}
          <div className="mt-8 text-center text-sm text-gray-300">
            Secure seller authentication system
          </div>
        </form>
      </div>
    )
  );
};

export default SellerLogin;