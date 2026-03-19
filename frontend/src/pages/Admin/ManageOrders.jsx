import { useContext, useEffect, useState } from "react";
import { dummyOrders } from "../../assets/assets";
import { assets } from "../../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
const ManageOrders = () => {
    const [orders, setOrders]=useState([]);
    const{ axios } = useContext(AuthContext);
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
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="md:p-10 p-4 space-y-4">
      <h2 className="text-lg font-medium">Orders List</h2>
      {orders.map((order, index) => {
        const items = order?.items || [];
        const firstImage = items[0]?.product?.image?.[0];
        const imgSrc = firstImage ? `http://localhost:5000/images/${firstImage}` : assets.box_icon;
        return (
        <div
          key={index}
          className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-5 max-w-4xl rounded-md border border-gray-300 text-gray-800"
        >
          <div className="flex gap-5">
            <img
              className="w-12 h-12 object-cover opacity-60"
              src={imgSrc}
              alt="boxIcon"
            />
            <>
              {items.map((item, itemIdx) => (
                <div key={itemIdx} className="flex flex-col justify-center">
                  <p className="font-medium">
                    {item?.product?.name || "Product"}{" "}
                    <span
                      className={`text-indigo-500 ${
                        item?.quantity < 2 && "hidden"
                      }`}
                    >
                      x {item?.quantity || 0}
                    </span>
                  </p>
                </div>
              ))}
            </>
          </div>

          <div className="text-sm">
            <p className="font-medium mb-1">
              {order?.address?.firstName} {order?.address?.lastName}
            </p>
            <p>
              {order?.address?.street}, {order?.address?.city},{" "}
              {order?.address?.state},{order?.address?.zipcode},{" "}
              {order?.address?.country}
            </p>
          </div>
<p className="font-medium text-base my-auto text-black/70">
  ₹{(order?.amount || 0).toLocaleString("en-IN")}
</p>
          <div className="flex flex-col text-sm">
            <p>Method: {order?.paymentType || "N/A"}</p>
            <p>Date: {order?.orderDate || "N/A"}</p>
            <p>Payment: {order?.isPaid ? "Paid" : "Pending"}</p>
            {/* Order Status Update */}
  <select
    value={order.status}
    onChange={(e) => updateStatus(order._id, e.target.value)}
    className="border mt-2 p-1 rounded"
  >
    <option value="order placed">Order Placed</option>
    <option value="shipped">Shipped</option>
    <option value="delivered">Delivered</option>
  </select>
          </div>
        </div>
        );
      })}
    </div>
  );
};
export default ManageOrders;