import { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";

const ResetPassword = () => {
  const { token } = useParams();

  const navigate = useNavigate();

  const { axios } = useContext(AuthContext);

  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    try {
      e.preventDefault();

      if (!password) {
        return toast.error("Enter new password");
      }

      const { data } = await axios.post(
        `/api/user/reset-password/${token}`,
        { password }
      );

      if (data.success) {
        toast.success(data.message);

        navigate("/");
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
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={submitHandler}
        className="flex flex-col gap-4 p-8 w-80 border rounded-lg shadow-lg bg-white"
      >
        <h2 className="text-2xl font-semibold text-center text-indigo-500">
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="Enter new password"
          className="border p-2 rounded outline-indigo-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;