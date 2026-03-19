import { useContext, useEffect, useState } from "react";
import { dummyOrders } from "../../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { axios, user } = useContext(AuthContext);
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/user");
      if (data.success) {
        setMyOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
//add cancel order functionality
  const cancelOrder = async (orderId) => {
    try {
      if (!window.confirm("Are you sure you want to cancel this order?")) 
        return;
    
      const { data } = await axios.post("/api/order/cancel", { orderId });
      if (data.success) {
        toast.success(data.message);
        fetchOrders(); // Refresh the order list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);
  return (
    <div className="mt-12 pb-16">
      <div>
        <p className="text-2xl md:text-3xl font-medium">My Orders</p>
      </div>

      {myOrders.map((order, index) => {

      return (
        <div
          key={index}
          className="my-8 border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl"
        >
          <p className="flex justify-between items-center gap-6 ">
            <span>orderId :{order._id} </span>
            <span>payment :{order.paymentType} </span>
      <span>
  Total Amount : ₹{order.amount.toLocaleString("en-IN")}
</span>
          </p>
        {order.items.map((item, index) => {
  if (!item.product) return null;

  return (
            <div
              key={index}
              className={`relative bg-white text-gray-800/70 ${
                order.items.length !== index + 1 && "border-b"
              } border-gray-300 flex flex-col md:flex-row md:items-center  justify-between p-4 py-5 w-full max-w-4xl`}
            >
              <div className="flex items-center mb-4 md:mb-0">
                <div className="p-4 rounded-lg">
                 <img
  src={
    item.product?.image?.[0]
      ? `http://localhost:5000/images/${item.product.image[0]}`
      : "/placeholder.png"
  }
  alt={item.product?.name || "product"}
  className="w-16 h-16"
/>
                </div>

                <div className="ml-4">
             

             <h2 className="text-xl font-medium">{item.product?.name}</h2>
<p>{item.product?.category}</p>
                  <p>{item.product.category}</p>
                </div>
              </div>

              <div className=" text-lg font-medium">
                <p>Quantity:{item.quantity || "1"}</p>
                <p
  className={`font-semibold ${
    order.status?.toLowerCase() === "order placed"
      ? "text-yellow-500"
      : order.status?.toLowerCase() === "shipped"
      ? "text-blue-500"
      : order.status?.toLowerCase() === "delivered"
      ? "text-green-600"
      : order.status?.toLowerCase() === "cancelled"
      ? "text-red-500"
      : "text-gray-500"
  }`}
>
  Status: {order.status}
</p>
<div className="flex items-center gap-4 mt-3 text-sm">

{/* Order Placed */}
<div className="flex items-center gap-1">
  <div className={`w-4 h-4 rounded-full ${
    order.status === "order placed" ||
    order.status === "shipped" ||
    order.status === "delivered"
      ? "bg-green-500"
      : "bg-gray-300"
  }`}></div>
  <p>Placed</p>
</div>

<div className="flex-1 h-[2px] bg-gray-300"></div>

{/* Shipped */}
<div className="flex items-center gap-1">
  <div className={`w-4 h-4 rounded-full ${
    order.status === "shipped" ||
    order.status === "delivered"
      ? "bg-green-500"
      : "bg-gray-300"
  }`}></div>
  <p>Shipped</p>
</div>

<div className="flex-1 h-[2px] bg-gray-300"></div>

{/* Delivered */}
<div className="flex items-center gap-1">
  <div className={`w-4 h-4 rounded-full ${
    order.status === "delivered"
      ? "bg-green-500"
      : "bg-gray-300"
  }`}></div>
  <p>Delivered</p>
</div>

</div>
                <p>Date:{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <p className=" text-lg">
            
          Amount: ₹{((item.product?.offerPrice || 0) * item.quantity).toLocaleString("en-IN")}
              </p>
                         {order.status?.toLowerCase() === "order placed" && (
  <button
    onClick={() => cancelOrder(order._id)}
    className="bg-red-500 text-white px-4 py-1 rounded-md mt-2 hover:bg-red-600"
  >
    Cancel Order
  </button>
)}
            </div>
          );
       } )}
        </div>
      );
      })}
    </div>
  );
};
export default MyOrders;