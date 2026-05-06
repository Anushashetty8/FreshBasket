import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AuthContext = createContext(null);

const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // 🔥 persist seller login
  const [isSeller, setIsSeller] = useState(
    localStorage.getItem("isSeller") === "true"
  );

  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // =========================
  // CHECK SELLER AUTH
  // =========================
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");

      if (data.success) {
        setIsSeller(true);
        localStorage.setItem("isSeller", "true");
      } else {
        setIsSeller(false);
        localStorage.removeItem("isSeller");
      }
    } catch {
      setIsSeller(false);
      localStorage.removeItem("isSeller");
    }
  };

  // =========================
  // CHECK USER AUTH
  // =========================
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");

      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cart || data.user.cartData || {});
      } else {
        setUser(null);
        setCartItems({});
      }
    } catch {
      setUser(null);
      setCartItems({});
    }
  };

  // =========================
  // FETCH PRODUCTS
  // =========================
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");

      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // =========================
  // 🚨 FIXED CART FUNCTIONS
  // =========================
  const addToCart = (itemId) => {
    // ❌ BLOCK guest users
    if (!user) {
      toast.error("Please login to add items to cart");
      setShowUserLogin(true);
      return;
    }

    let cartData = structuredClone(cartItems) || {};

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }

    setCartItems(cartData);
    toast.success("Added to cart");
  };

  const updateCartItem = (itemId, quantity) => {
    if (!user) return;

    let cartData = structuredClone(cartItems) || {};
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("Cart updated");
  };

  const removeFromCart = (itemId) => {
    if (!user) return;

    let cartData = structuredClone(cartItems) || {};

    if (cartData[itemId]) {
      cartData[itemId] -= 1;

      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }

      setCartItems(cartData);
      toast.success("Removed from cart");
    }
  };

  const cartCount = () => {
    let total = 0;
    for (const item in cartItems) {
      total += cartItems[item];
    }
    return total;
  };

  const totalCartAmount = () => {
    let total = 0;

    for (const item in cartItems) {
      let product = products.find((p) => p._id === item);

      if (product && cartItems[item] > 0) {
        total += cartItems[item] * product.offerPrice;
      }
    }

    return Math.floor(total * 100) / 100;
  };

  // =========================
  // SYNC CART (ONLY IF LOGIN)
  // =========================
  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", {
          cartItems,
        });

        if (!data.success) {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (user) {
      updateCart();
    }
  }, [cartItems]);

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    fetchProducts();
    fetchSeller();
    fetchUser();
  }, []);

  const value = {
    navigate,
    user,
    setUser,

    isSeller,
    setIsSeller,

    showUserLogin,
    setShowUserLogin,

    products,
    cartItems,
    setCartItems,

    addToCart,
    updateCartItem,
    removeFromCart,
    cartCount,
    totalCartAmount,

    searchQuery,
    setSearchQuery,

    axios,
    fetchProducts,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;