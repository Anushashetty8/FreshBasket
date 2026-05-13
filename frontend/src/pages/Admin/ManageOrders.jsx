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
    .filter((order) =>
      order.status?.toLowerCase() === "delivered"
    )
    .reduce((sum, order) => sum + (order.amount || 0), 0);

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      setError("");
      const { data } = await axios.get("/api/order/seller");
      if (data.success) {
        setOrders(data.orders);
      } else {
        setError(data.message || "Failed to load orders");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch Delivery Boys
  const fetchDeliveryBoys = async () => {
    try {
      const { data } = await axios.get("/api/delivery-boy");
      if (data.success) {
        setDeliveryBoys(data.boys);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Update Order Status
  const updateStatus = async (orderId, status) => {
    try {
      const { data } = await axios.post("/api/order/update-status", {
        orderId,
        status,
      });

      if (data.success) {
        toast.success("Order status updated");
        fetchOrders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Approve Return Request
  const approveReturn = async (orderId) => {
    try {
      setApprovingOrderId(orderId);
      const { data } = await axios.post("/api/order/approve-return", {
        orderId,
      });

      if (data.success) {
        toast.success(data.message || "Return approved successfully");
        fetchOrders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setApprovingOrderId(null);
    }
  };

  // Assign Delivery Boy
  const assignDeliveryBoy = async (orderId, deliveryBoyId) => {
    try {
      const { data } = await axios.post(
        "/api/order/assign-delivery-boy",
        {
          orderId,
          deliveryBoyId,
        }
      );

      if (data.success) {
        toast.success("Delivery boy assigned");
        fetchOrders();
      } else {
        toast.error(data.message);
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
    <div className="md:p-10 p-4 space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-3xl font-semibold text-gray-900">{totalProducts}</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Out of Stock</p>
          <p className="text-3xl font-semibold text-red-600">{outOfStockProducts}</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Sales</p>
          <p className="text-3xl font-semibold text-green-600">
            ₹{totalSales.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Return Requests</h2>
          {loadingOrders && (
            <span className="text-sm text-gray-500">Loading return requests...</span>
          )}
        </div>

        {error && (
          <div className="rounded bg-red-50 border border-red-200 text-red-700 px-4 py-3">
            {error}
          </div>
        )}

        {returnRequests.length === 0 ? (
          <div className="rounded bg-gray-50 border border-gray-200 p-4 text-gray-600">
            No return requests at the moment.
          </div>
        ) : (
          returnRequests.map((order) => {
            const items = order?.items || [];
            const userName = order?.userId?.name || order?.userId?.email || "Customer";

            return (
              <div
                key={order._id}
                className="rounded-md border border-gray-300 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-medium">{userName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-medium">₹{(order?.amount || 0).toLocaleString("en-IN")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Status</p>
                    <p className="font-semibold text-orange-600">{order.status}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => approveReturn(order._id)}
                    disabled={approvingOrderId === order._id}
                    className="rounded bg-indigo-500 px-4 py-2 text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {approvingOrderId === order._id ? "Approving..." : "Approve Return"}
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-500">Products</p>
                  {items.map((item) => (
                    <div key={item._id || item.product?._id} className="flex items-center justify-between rounded border border-gray-200 bg-gray-50 p-3">
                      <p className="text-sm text-gray-800">
                        {item?.product?.name || "Product"}
                      </p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      <h2 className="text-lg font-medium">Orders List</h2>

      {orders.map((order, index) => {
        const items = order?.items || [];
        const firstImage = items[0]?.product?.image?.[0];
        const imgSrc = firstImage
          ? `http://localhost:5000/images/${firstImage}`
          : assets.box_icon;

        return (
          <div
            key={index}
            className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-5 max-w-4xl rounded-md border border-gray-300 text-gray-800"
          >
            {/* Product Section */}
            <div className="flex gap-5">
              <img
                className="w-12 h-12 object-cover opacity-60"
                src={imgSrc}
                alt="boxIcon"
              />

              <div>
                {items.map((item, itemIdx) => (
                  <p key={itemIdx} className="font-medium">
                    {item?.product?.name || "Product"}
                    {item?.quantity > 1 && (
                      <span className="text-indigo-500">
                        {" "}
                        x {item.quantity}
                      </span>
                    )}
                  </p>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="text-sm">
              <p className="font-medium mb-1">
                {order?.address?.firstName} {order?.address?.lastName}
              </p>
              <p>
                {order?.address?.street}, {order?.address?.city},{" "}
                {order?.address?.state}, {order?.address?.zipcode},{" "}
                {order?.address?.country}
              </p>
            </div>

            {/* Amount */}
            <p className="font-medium text-base my-auto text-black/70">
              ₹{(order?.amount || 0).toLocaleString("en-IN")}
            </p>

            {/* Controls */}
            <div className="flex flex-col text-sm">
              <p>Method: {order?.paymentType || "N/A"}</p>
              <p>Date: {order?.orderDate || "N/A"}</p>
              <p>Payment: {order?.isPaid ? "Paid" : "Pending"}</p>

              {/* Status Dropdown */}
              <select
                value={order.status}
                onChange={(e) =>
                  updateStatus(order._id, e.target.value)
                }
                className="border mt-2 p-1 rounded"
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>

              {/* ✅ FIXED DELIVERY BOY DROPDOWN */}
              <select
                value={order?.deliveryBoy?._id || ""}
                onChange={(e) =>
                  assignDeliveryBoy(order._id, e.target.value)
                }
                className="border mt-2 p-1 rounded"
              >
                <option value="">Assign Delivery Boy</option>

                {deliveryBoys.map((boy) => (
                  <option key={boy._id} value={boy._id}>
                    {boy.name}
                  </option>
                ))}
              </select>

              {/* Show assigned delivery boy */}
              <p className="text-xs text-green-600 mt-1">
                Assigned:{" "}
                {order?.deliveryBoy?.name || "Not assigned"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ManageOrders;