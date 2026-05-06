import { Routes, Route } from "react-router-dom";
import AdminLogin from "../auth/AdminLogin";
import SellerLayout from "../admin/SellerLayout"; // adjust if needed

const AppRoutes = () => {
  return (
    <Routes>

      {/* Admin Login */}
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* Admin Dashboard */}
      <Route path="/admin" element={<SellerLayout />} />

    </Routes>
  );
};

export default AppRoutes;