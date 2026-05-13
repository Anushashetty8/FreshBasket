import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
  Truck,
  PackageCheck,
  Clock3,
  XCircle,
  RotateCcw,
  Phone,
  MessageCircle,
  ShoppingBag,
  MapPin,
  Star,
} from "lucide-react";

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
      if (!window.confirm("Are you sure you want to cancel this order?"))
        return;

      const { data } = await axios.post("/api/order/cancel", {
        orderId,
      });

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

      const { data } = await axios.post("/api/order/return", {
        orderId,
      });

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

  // ================= STATUS UI =================
  const getStatusColor = (status) => {
    switch (status) {
      case "order placed":
        return "bg-yellow-100 text-yellow-700";

      case "shipped":
        return "bg-blue-100 text-blue-700";

      case "delivered":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      case "returned":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getProgress = (status) => {
    switch (status) {
      case "order placed":
        return "10%";

      case "shipped":
        return "60%";

      case "delivered":
        return "100%";

      default:
        return "0%";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 md:px-10 py-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            My Orders
          </h1>

          <p className="text-gray-500 mt-3 text-lg">
            Track and manage all your orders
          </p>
        </div>

        <div className="bg-white shadow-2xl rounded-3xl px-8 py-5 mt-6 md:mt-0 border border-gray-100">
          <p className="text-gray-500">Total Orders</p>

          <h2 className="text-4xl font-bold text-green-600">
            {myOrders.length}
          </h2>
        </div>
      </div>

      {/* EMPTY */}
      {myOrders.length === 0 && (
        <div className="bg-white rounded-[40px] shadow-2xl p-16 text-center">
          <ShoppingBag size={90} className="mx-auto text-green-500" />

          <h2 className="text-4xl font-bold mt-6 text-gray-700">
            No Orders Yet
          </h2>

          <p className="text-gray-500 mt-4 text-lg">
            Your ordered products will appear here
          </p>
        </div>
      )}

      {/* ORDERS */}
      <div className="space-y-10">
        {myOrders.map((order, index) => {
          const status = order.status?.toLowerCase();

          return (
            <div
              key={index}
              className="bg-white rounded-[35px] shadow-2xl overflow-hidden border border-gray-100"
            >

              {/* TOP SECTION */}
              <div className="bg-gradient-to-r from-green-600 via-emerald-500 to-green-400 p-8 text-white">

                <div className="flex flex-col xl:flex-row justify-between gap-8">

                  {/* LEFT */}
                  <div>
                    <p className="uppercase tracking-widest text-sm opacity-80">
                      Order ID
                    </p>

                    <h2 className="text-xl font-bold break-all mt-2">
                      {order._id}
                    </h2>

                    <p className="mt-4 opacity-90">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* RIGHT */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

                    <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-5">
                      <p className="text-sm opacity-80">Payment</p>

                      <h3 className="font-bold mt-1">
                        {order.paymentType}
                      </h3>
                    </div>

                    <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-5">
                      <p className="text-sm opacity-80">Items</p>

                      <h3 className="font-bold mt-1">
                        {order.items.length}
                      </h3>
                    </div>

                    <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-5">
                      <p className="text-sm opacity-80">Delivery</p>

                      <h3 className="font-bold mt-1">
                        {order.deliveryCharge === 0
                          ? "FREE"
                          : `₹${order.deliveryCharge}`}
                      </h3>
                    </div>

                    <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-5">
                      <p className="text-sm opacity-80">Total</p>

                      <h3 className="text-2xl font-bold mt-1">
                        ₹{order.amount}
                      </h3>
                    </div>

                  </div>
                </div>

                {/* TRACKING */}
                {status !== "cancelled" && status !== "returned" && (
                  <div className="mt-10">

                    <div className="flex justify-between mb-3 text-sm font-semibold">
                      <span>Order Placed</span>
                      <span>Shipped</span>
                      <span>Delivered</span>
                    </div>

                    {/* TRACK LINE */}
                    <div className="relative w-full h-4 bg-white/30 rounded-full overflow-hidden">

                      <div
                        className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-1000"
                        style={{
                          width: getProgress(status),
                        }}
                      ></div>

                      {/* MOVING TRUCK */}
                      <div
                        className="absolute top-[-14px] transition-all duration-1000"
                        style={{
                          left: getProgress(status),
                          transform: "translateX(-50%)",
                        }}
                      >
                        <div className="bg-white text-green-600 p-2 rounded-full shadow-2xl animate-bounce">
                          <Truck size={22} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <span
                        className={`px-5 py-2 rounded-full text-sm font-bold ${getStatusColor(
                          status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* PRODUCTS */}
              <div className="p-8 space-y-8">

                {order.items.map((item, i) => {
                  if (!item.product) return null;

                  return (
                    <div
                      key={i}
                      className="border border-gray-100 rounded-[30px] p-6 hover:shadow-2xl transition-all duration-500"
                    >

                      <div className="flex flex-col lg:flex-row justify-between gap-8">

                        {/* PRODUCT */}
                        <div className="flex gap-6">

                          <img
                            src={
                              item.product?.image?.[0]
                                ? `http://localhost:5000/images/${item.product.image[0]}`
                                : "/placeholder.png"
                            }
                            alt=""
                            className="w-36 h-36 object-cover rounded-3xl shadow-lg"
                          />

                          <div>

                            <h2 className="text-2xl font-bold text-gray-800">
                              {item.product?.name}
                            </h2>

                            <div className="flex items-center gap-2 mt-3 text-gray-500">
                              <MapPin size={18} />
                              <span>
                                {item.product?.category}
                              </span>
                            </div>

                            <div className="mt-5 flex gap-4 flex-wrap">

                              <div className="bg-gray-100 rounded-xl px-4 py-2 font-semibold">
                                Qty: {item.quantity}
                              </div>

                              <div className="bg-green-100 text-green-700 rounded-xl px-4 py-2 font-semibold">
                                ₹
                                {(
                                  (item.product?.offerPrice || 0) *
                                  item.quantity
                                ).toLocaleString("en-IN")}
                              </div>

                            </div>

                            {/* DELIVERY DETAILS */}
                            {order.deliveryBoy &&
                              status === "shipped" && (
                                <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-5">

                                  <h3 className="font-bold text-blue-700 text-lg mb-3">
                                    Delivery Partner
                                  </h3>

                                  <p>
                                    Name: {order.deliveryBoy?.name}
                                  </p>

                                  <p>
                                    Phone: {order.deliveryBoy?.phone}
                                  </p>

                                  <div className="flex gap-4 mt-5">

                                    <a
                                      href={`tel:${order.deliveryBoy?.phone}`}
                                      className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:scale-105 transition-all"
                                    >
                                      <Phone size={18} />
                                      Call
                                    </a>

                                    <a
                                      href={`https://wa.me/${order.deliveryBoy?.phone}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl hover:scale-105 transition-all"
                                    >
                                      <MessageCircle size={18} />
                                      WhatsApp
                                    </a>

                                  </div>
                                </div>
                              )}

                          </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex flex-col justify-between">

                          <div className="flex items-center gap-3">

                            {status === "delivered" ? (
                              <PackageCheck
                                className="text-green-600"
                                size={28}
                              />
                            ) : status === "shipped" ? (
                              <Truck
                                className="text-blue-600"
                                size={28}
                              />
                            ) : status === "cancelled" ? (
                              <XCircle
                                className="text-red-600"
                                size={28}
                              />
                            ) : (
                              <Clock3
                                className="text-yellow-600"
                                size={28}
                              />
                            )}

                            <span className="font-bold text-lg capitalize">
                              {order.status}
                            </span>
                          </div>

                          <div className="flex flex-col gap-4 mt-8">

                            {/* CANCEL */}
                            {status === "order placed" && (
                              <button
                                onClick={() =>
                                  cancelOrder(order._id)
                                }
                                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 transition-all"
                              >
                                Cancel Order
                              </button>
                            )}

                            {/* RETURN */}
                            {status === "delivered" && (
                              <button
                                onClick={() =>
                                  returnOrder(order._id)
                                }
                                className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2 justify-center"
                              >
                                <RotateCcw size={18} />
                                Return Order
                              </button>
                            )}

                            {/* RATING */}
                            {status === "delivered" && (
                              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">

                                <div className="flex gap-1 justify-center">

                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      size={22}
                                      className="fill-yellow-400 text-yellow-400"
                                    />
                                  ))}

                                </div>

                                <p className="text-center text-sm mt-2 text-gray-600">
                                  Thanks for shopping ❤️
                                </p>
                              </div>
                            )}

                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;