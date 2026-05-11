import { useContext, useState } from "react";
import React from "react";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const [state, setState] = React.useState("login");

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = useState("");

  const [forgotMode, setForgotMode] = useState(false);

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
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-40 flex items-center justify-center bg-black/50 text-gray-600"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={
          forgotMode
            ? forgotPasswordHandler
            : submitHandler
        }
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-indigo-500">User</span>{" "}
          {forgotMode
            ? "Forgot Password"
            : state === "login"
            ? "Login"
            : "Sign Up"}
        </p>

        {/* NAME */}
        {state === "register" && !forgotMode && (
          <div className="w-full">
            <p>Name</p>

            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
              type="text"
              required
            />
          </div>
        )}

        {/* EMAIL */}
        <div className="w-full ">
          <p>Email</p>

          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
            type="email"
            required
          />
        </div>

        {/* PASSWORD */}
        {!forgotMode && (
          <div className="w-full ">
            <p>Password</p>

            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
              type="password"
              required
            />
          </div>
        )}

        {/* FORGOT PASSWORD */}
        {!forgotMode && state === "login" && (
          <p
            onClick={() => setForgotMode(true)}
            className="text-indigo-500 cursor-pointer text-sm"
          >
            Forgot Password?
          </p>
        )}

        {/* LOGIN / REGISTER SWITCH */}
        {!forgotMode &&
          (state === "register" ? (
            <p>
              Already have account?{" "}
              <span
                onClick={() => setState("login")}
                className="text-indigo-500 cursor-pointer"
              >
                click here
              </span>
            </p>
          ) : (
            <p>
              Create an account?{" "}
              <span
                onClick={() => setState("register")}
                className="text-indigo-500 cursor-pointer"
              >
                click here
              </span>
            </p>
          ))}

        {/* BACK TO LOGIN */}
        {forgotMode && (
          <p>
            Back to Login?{" "}
            <span
              onClick={() => setForgotMode(false)}
              className="text-indigo-500 cursor-pointer"
            >
              click here
            </span>
          </p>
        )}

        {/* BUTTON */}
        <button className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white w-full py-2 rounded-md cursor-pointer">
          {forgotMode
            ? "Send Reset Link"
            : state === "register"
            ? "Create Account"
            : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;