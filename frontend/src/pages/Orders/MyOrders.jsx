import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { axios, user } = useContext(AuthContext);

  // ================= FETCH ORDERS =================
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

  // ================= CANCEL =================
  const cancelOrder = async (orderId) => {
    try {
      if (!window.confirm("Are you sure you want to cancel this order?")) return;

      const { data } = await axios.post("/api/order/cancel", { orderId });

      if (data.success) {
        toast.success(data.message);
        fetchOrders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ================= RETURN =================
  const returnOrder = async (orderId) => {
    try {
      if (!window.confirm("Do you want to return this order?")) return;

      const { data } = await axios.post("/api/order/return", { orderId });

      if (data.success) {
        toast.success(data.message);
        fetchOrders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ================= LOAD =================
  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  return (
    <div className="mt-12 pb-16">
      <p className="text-2xl md:text-3xl font-medium">My Orders</p>

      {myOrders.map((order, index) => {
        const status = order.status?.toLowerCase();

        return (
          <div
            key={index}
            className="my-8 border border-gray-300 rounded-lg p-4 max-w-4xl"
          >
            {/* TOP INFO */}
            <div className="flex justify-between flex-wrap gap-4">
              <span>OrderId: {order._id}</span>
              <span>Payment: {order.paymentType}</span>
              <div>
  <p>
  Subtotal: ₹{(
    (order.amount || 0) - (order.deliveryCharge || 0)
  ).toLocaleString("en-IN")}
</p>

<p>
  Delivery: ₹{order.deliveryCharge === 0 ? "Free" : (order.deliveryCharge || 0)}
</p>
</div>
            </div>

            {/* ASSIGNING */}
            {status === "order placed" && (
              <div className="mt-3 p-3 bg-yellow-50 rounded-md">
                <p className="text-yellow-700 font-medium">
                  Assigning delivery partner...
                </p>
              </div>
            )}

            {/* DELIVERY DETAILS */}
            {order.deliveryBoy && status === "shipped" && (
              <div className="mt-3 p-3 bg-gray-100 rounded-md">
                <p className="font-medium">Delivery Details</p>

                <p>Name: {order.deliveryBoy?.name}</p>
                <p>Phone: {order.deliveryBoy?.phone}</p>
                <p>
                  Vehicle:{" "}
                  {order.deliveryBoy?.vehicleNumber ||
                    order.deliveryBoy?.vehicle ||
                    "N/A"}
                </p>

                <div className="flex gap-3 mt-2">
                  <a
                    href={`tel:${order.deliveryBoy?.phone}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Call
                  </a>

                  <a
                    href={`https://wa.me/${order.deliveryBoy?.phone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            )}

            {/* ITEMS */}
            {order.items.map((item, i) => {
              if (!item.product) return null;

              return (
                <div
                  key={i}
                  className="border-t mt-4 pt-4 flex flex-col md:flex-row justify-between"
                >
                  {/* PRODUCT */}
                  <div className="flex gap-4">
                    <img
                      src={
                        item.product?.image?.[0]
                          ? `http://localhost:5000/images/${item.product.image[0]}`
                          : "/placeholder.png"
                      }
                      className="w-16 h-16"
                      alt=""
                    />

                    <div>
                      <h2 className="font-medium">{item.product?.name}</h2>
                      <p>{item.product?.category}</p>
                    </div>
                  </div>

                  {/* STATUS */}
                  <div className="mt-3 md:mt-0">
                    <p>Qty: {item.quantity}</p>

                    <p
                      className={`font-semibold ${
                        status === "order placed"
                          ? "text-yellow-500"
                          : status === "shipped"
                          ? "text-blue-500"
                          : status === "delivered"
                          ? "text-green-600"
                          : status === "cancelled"
                          ? "text-red-500"
                          : status === "returned"
                          ? "text-purple-600"
                          : ""
                      }`}
                    >
                      Status: {order.status}
                    </p>

                    {/* TRACKER */}
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          ["order placed", "shipped", "delivered"].includes(status)
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <span>Placed</span>

                      <div className="w-6 h-[2px] bg-gray-300"></div>

                      <div
                        className={`w-3 h-3 rounded-full ${
                          ["shipped", "delivered"].includes(status)
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <span>Shipped</span>

                      <div className="w-6 h-[2px] bg-gray-300"></div>

                      <div
                        className={`w-3 h-3 rounded-full ${
                          status === "delivered"
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                      <span>Delivered</span>
                    </div>

                    <p className="text-sm mt-1">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* PRICE */}
                  <p className="mt-2 md:mt-0 font-medium">
                    ₹
                    {(
                      (item.product?.offerPrice || 0) * item.quantity
                    ).toLocaleString("en-IN")}
                  </p>

                  {/* ACTION BUTTONS */}
                  <div className="flex flex-col gap-2 mt-2">

                    {/* CANCEL */}
                    {status === "order placed" && (
                      <button
                        onClick={() => cancelOrder(order._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    )}

                    {/* RETURN */}
                    {status === "delivered" && (
                      <button
                        onClick={() => returnOrder(order._id)}
                        className="bg-purple-500 text-white px-3 py-1 rounded"
                      >
                        Return
                      </button>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default MyOrders;