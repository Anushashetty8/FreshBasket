import { Routes, Route, useLocation} from "react-router-dom";
import Home from "./pages/Home";
import ProductList from "./pages/User/ProductList";
import ProductDetails from "./pages/User/ProductDetails";
import Cart from "./pages/User/Cart";
import Navbar from "./components/Navbar";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import MyOrders from "./pages/Orders/MyOrders";
import Login from "./pages/Auth/Login";
import ProductCard from "./components/ProductCard";
import ProductCategory from "./components/ProductCategory";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import AddAddress from "./pages/User/AddAddress";
import SellerLayout from './pages/Admin/SellerLayout';
import Products from './pages/Admin/Products';
import SellerLogin from "./pages/Admin/SellerLogin";
import ManageProducts from "./pages/Admin/ManageProducts";
import ManageOrders from "./pages/Admin/ManageOrders";
import EditProduct from "./pages/Admin/EditProduct";
import ResetPassword from "./pages/Auth/ResetPassword";
const App = () => {
  const {isSeller, showUserLogin} = useContext(AuthContext);
  const isSellerPath = useLocation().pathname.includes("seller");
  return (
    <div className="text-default min-h-screen">
      {isSellerPath ? null : <Navbar/>}
      {
        showUserLogin ? <Login /> :null
      }
<Toaster />
      <div className="px-6 md:px-16 lg:px-24 xl:px-32">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productList" element={<ProductList />} />
        <Route path="/product/:category/:id" element={<ProductDetails />} />
        <Route path="/products/:category" element={<ProductCategory/>} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/add-address" element={<AddAddress />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/seller" element={isSeller ? <SellerLayout /> : <SellerLogin />}>
            <Route index element={isSeller ? <ManageProducts/> : null}/>
            <Route path="product-list"element={isSeller ? <Products/> : null }/>
            <Route path="edit-product/:id" element={isSeller ? <EditProduct/> : null }/>
            <Route path="orders"element={isSeller ? <ManageOrders/> : null }/>
           
            </Route>
        </Routes>
    </div>
    {isSellerPath ? null:<Footer/>}
    </div>
  );
};

export default App;