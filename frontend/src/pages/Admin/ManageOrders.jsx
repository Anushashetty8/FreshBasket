import { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [approvingOrderId, setApprovingOrderId] = useState(null);
  const [error, setError] = useState("");

  const { axios, products } = useContext(AuthContext);

  const totalProducts = products.length;
  const outOfStockProducts = products.filter(
    (product) =>
      product.inStock === false || (product.stock ?? 0) <= 0
  ).length;

  const totalSales = orders
    .filter((order) => order.status?.toLowerCase() === "delivered")
    .reduce((sum, order) => sum + (order.amount || 0), 0);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const { data } = await axios.get("/api/order/seller");
      if (data.success) setOrders(data.orders);
      else setError(data.message);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchDeliveryBoys = async () => {
    try {
      const { data } = await axios.get("/api/delivery-boy");
      if (data.success) setDeliveryBoys(data.boys);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const { data } = await axios.post("/api/order/update-status", {
        orderId,
        status,
      });

      if (data.success) {
        toast.success("Status updated");
        fetchOrders();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const approveReturn = async (orderId) => {
    try {
      setApprovingOrderId(orderId);

      const { data } = await axios.post("/api/order/approve-return", {
        orderId,
      });

      if (data.success) {
        toast.success("Return approved");
        fetchOrders();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setApprovingOrderId(null);
    }
  };

  const assignDeliveryBoy = async (orderId, deliveryBoyId) => {
    try {
      const { data } = await axios.post("/api/order/assign-delivery-boy", {
        orderId,
        deliveryBoyId,
      });

      if (data.success) {
        toast.success("Assigned successfully");
        fetchOrders();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchDeliveryBoys();
  }, []);

  const returnRequests = orders.filter(
    (order) => order?.status?.toLowerCase() === "return requested"
  );

  return (
    <div className="md:p-10 p-4 space-y-6 bg-gradient-to-br from-indigo-50 via-sky-50 to-pink-50 min-h-screen">

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-3">

        <div className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white p-5 shadow-lg">
          <p className="text-sm opacity-90">Total Products</p>
          <p className="text-3xl font-bold">{totalProducts}</p>
        </div>

        <div className="rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white p-5 shadow-lg">
          <p className="text-sm opacity-90">Out of Stock</p>
          <p className="text-3xl font-bold">{outOfStockProducts}</p>
        </div>

        <div className="rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white p-5 shadow-lg">
          <p className="text-sm opacity-90">Total Sales</p>
          <p className="text-3xl font-bold">
            ₹{totalSales.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* RETURN REQUESTS */}
      <div>
        <h2 className="text-xl font-bold text-indigo-700 mb-3">
          Return Requests
        </h2>

        {returnRequests.length === 0 ? (
          <div className="bg-white border p-4 rounded-lg text-gray-600">
            No return requests
          </div>
        ) : (
          returnRequests.map((order) => (
            <div
              key={order._id}
              className="bg-orange-50 border border-orange-200 p-4 rounded-lg mb-4 shadow-sm"
            >
              <div className="flex justify-between flex-wrap gap-3">
                <p className="font-semibold">
                  {order?.userId?.name || "Customer"}
                </p>

                <p className="text-orange-600 font-bold">
                  ₹{order.amount}
                </p>

                <p className="text-red-500 font-semibold">
                  {order.status}
                </p>

                <button
                  onClick={() => approveReturn(order._id)}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded hover:scale-105 transition"
                >
                  {approvingOrderId === order._id
                    ? "Approving..."
                    : "Approve Return"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ORDERS LIST */}
      <h2 className="text-xl font-bold text-gray-800">Orders List</h2>

      {orders.map((order) => {
        const items = order?.items || [];
        const firstImage = items[0]?.product?.image?.[0];

        return (
          <div
            key={order._id}
            className="bg-white border-l-4 border-indigo-500 rounded-2xl shadow-md p-5 mb-5"
          >

            {/* PRODUCTS */}
            <div className="flex gap-4">
              <img
                src={
                  firstImage
                    ? `http://localhost:5000/images/${firstImage}`
                    : assets.box_icon
                }
                className="w-14 h-14 rounded object-cover border"
              />

              <div>
                {items.map((item, i) => (
                  <p key={i} className="font-medium">
                    {item.product?.name}{" "}
                    <span className="text-indigo-500">
                      x{item.quantity}
                    </span>
                  </p>
                ))}
              </div>
            </div>

            {/* DETAILS */}
            <div className="grid md:grid-cols-3 gap-4 mt-4 text-sm">

              <div>
                <p className="text-gray-500">Customer</p>
                <p className="font-semibold">
                  {order?.userId?.name}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Amount</p>
                <p className="text-emerald-600 font-bold text-lg">
                  ₹{order.amount}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Payment</p>
                <p>{order.isPaid ? "Paid" : "Pending"}</p>
              </div>
            </div>

            {/* CONTROLS */}
            <div className="mt-4 grid md:grid-cols-3 gap-3">

              <select
                className="border border-indigo-300 bg-indigo-50 p-2 rounded-lg"
                value={order.status}
                onChange={(e) =>
                  updateStatus(order._id, e.target.value)
                }
              >
                <option>Order Placed</option>
                <option>Shipped</option>
                <option>Delivered</option>
              </select>

              <select
                className="border border-green-300 bg-green-50 p-2 rounded-lg"
                onChange={(e) =>
                  assignDeliveryBoy(order._id, e.target.value)
                }
                value={order?.deliveryBoy?._id || ""}
              >
                <option value="">Assign Delivery Boy</option>
                {deliveryBoys.map((boy) => (
                  <option key={boy._id} value={boy._id}>
                    {boy.name}
                  </option>
                ))}
              </select>

              <div className="text-green-600 font-medium">
                {order?.deliveryBoy?.name || "Not Assigned"}
              </div>

            </div>

          </div>
        );
      })}
    </div>
  );
};

export default ManageOrders;