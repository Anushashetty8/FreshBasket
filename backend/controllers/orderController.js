import Order from "../models/Order.js";
import Product from "../models/product.model.js";
// Place order COD: /api/order/place
export const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.user;
    const { items, address } = req.body;
    if (!address || !items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid order details", success: false });
    }
    // calculate amount using items;
 let amount = 0;
let totalTax = 0;

for (const item of items) {
  const product = await Product.findById(item.product);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
      success: false,
    });
  }

  const itemPrice = product.offerPrice * item.quantity;

  // calculate tax for this product
  const tax = (itemPrice * (product.taxRate||0)) / 100;

  amount += itemPrice;
  totalTax += tax;
}
const finalAmount = amount + totalTax;
    
    await Order.create({
      userId,
      items,
      address,
      amount:finalAmount,
      totalTax:totalTax,
      paymentType: "COD",
      isPaid: false,
      status: "Order Placed",
    });
    res
      .status(201)
      .json({ message: "Order placed successfully", success: true ,
        amount: finalAmount,
        totalTax: totalTax
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// order details for individual user :/api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user;
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// get all orders for admin :/api/order/all
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: false }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
 //cancel order :/api/order/cancel/
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (order.status?.toLowerCase() !== "order placed")
      return res.status(400).json({ success: false, message: "Order cannot be cancelled" });

    order.status = "Cancelled";
    await order.save();

    res.status(200).json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// update order status : /api/order/update-status
export const updateOrderStatus = async (req, res) => {
  try {

    const { orderId, status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};