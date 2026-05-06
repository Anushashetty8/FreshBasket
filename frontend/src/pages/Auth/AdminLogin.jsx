import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const AdminLogin = () => {

  const { axios, navigate, setIsAdmin } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/admin/login", {
        email,
        password,
      });

      if (data.success) {
        setIsAdmin(true);
        localStorage.setItem("isAdmin", "true"); // keeps login after refresh
        toast.success("Login successful");
        navigate("/admin");
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">

      <form
        onSubmit={submitHandler}
        className="bg-white p-6 rounded-lg shadow-md w-80"
      >

        <h2 className="text-xl font-bold mb-4 text-center">
          Admin Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          className="w-full bg-indigo-600 text-white p-2 rounded"
        >
          Login
        </button>

      </form>

    </div>
  );
};

export default AdminLogin;