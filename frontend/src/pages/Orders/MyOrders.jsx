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
            <span>Total Amount :${order.amount} </span>
          </p>
          {order.items.map((item, index) => (
            <div
              key={index}
              className={`relative bg-white text-gray-800/70 ${
                order.items.length !== index + 1 && "border-b"
              } border-gray-300 flex flex-col md:flex-row md:items-center  justify-between p-4 py-5 w-full max-w-4xl`}
            >
              <div className="flex items-center mb-4 md:mb-0">
                <div className="p-4 rounded-lg">
                  <img
                    src={`http://localhost:5000/images/${item.product.image[0]}`}
                    alt=""
                    className="w-16 h-16"
                  />
                </div>

                <div className="ml-4">
                  <h2 className="text-xl font-medium">{item.product.name}</h2>
                  <p>{item.product.category}</p>
                </div>
              </div>

              <div className=" text-lg font-medium">
                <p>Quantity:{item.quantity || "1"}</p>
                <p
  className={`${
    order.status?.toLowerCase() === "order placed"
      ? "text-yellow-500"
      : order.status?.toLowerCase() === "cancelled"
      ? "text-red-500"
      : "text-green-500"
  }`}
>
  Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
</p>
                <p>Date:{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <p className=" text-lg">
                Amount:${item.product.offerPrice * item.quantity}
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
          ))}
        </div>
      );
      })}
    </div>
  );
};
export default MyOrders;