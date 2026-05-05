import { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const { axios } = useContext(AuthContext);

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/seller");
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
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

  return (
    <div className="md:p-10 p-4 space-y-4">
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