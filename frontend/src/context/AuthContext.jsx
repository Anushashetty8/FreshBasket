import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL=import.meta.env.VITE_BACKEND_URL;
export const AuthContext = createContext(null);

const AuthContextProvider = ({children}) => {
    const navigate = useNavigate();
    const [user,setUser] = useState(null);
    const [isSeller,setIsSeller] = useState(null);
    const [showUserLogin,setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    
    //check seller status
    const fetchSeller = async () =>{
    try{
        const {data} = await axios.get("/api/seller/is-auth");
        if(data.success){
            setIsSeller(true);
        }else{
            setIsSeller(false);

        }
    }catch(error){
        toast.error(error.message);
    }       
};

    
//fetch all products data
const fetchProducts=async()=>{
    try{
        const{data} = await axios.get("/api/product/list");
        if(data.success){
        setProducts(data.products);
    }else{
        toast.error(data.message);
    }
}catch(error){
    toast.error(error.message);
};
}   
//add product to cart
const addToCart=(itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
        cartData[itemId] += 1;
    
    }else{
        cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success("added to cart");
};
//update cart item quantity
const updateCartItem = (itemId,quantity) =>{
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("cart updated");
};
//total cart items
const cartCount = () =>{
    let totalCount = 0;
    for (const item in cartItems) {
        totalCount += cartItems[item];

    }
    return totalCount;

};
//total cart Amount
const totalCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
        let itemInfo = products.find((product)=>product._id=== items);
        if(cartItems[items]>0){
            totalAmount += cartItems[items]*itemInfo.offerPrice;
        }
    }
    return Math.floor(totalAmount * 100) /100;
};
//remove product from cart
const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if(cartData[itemId]) {
        cartData[itemId] -=1;
        if(cartData[itemId] ===0){
            delete  cartData[itemId];
        }
        toast.success("removed from cart");
        setCartItems(cartData);
    }
};
useEffect(()=>{
    fetchProducts();
    fetchSeller();
},[]);
    const value ={
        navigate, 
        user, 
        setUser ,
        isSeller, 
        setIsSeller, 
        showUserLogin,
        setShowUserLogin ,
        products,
        addToCart,
        updateCartItem,
        cartCount,
        totalCartAmount,
        removeFromCart,
        cartItems,
        searchQuery,
        setSearchQuery,
        axios,
        fetchProducts,
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthContextProvider;