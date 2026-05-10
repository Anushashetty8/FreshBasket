import Order from "../models/Order.js";
import Product from "../models/product.model.js";
import DeliveryBoy from "../models/DeliveryBoy.js";

/* =========================
   PLACE ORDER (COD)
========================= */
export const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.user;
    const { items, address } = req.body;

    if (!address || !items || items.length === 0) {
      return res.status(400).json({
        message: "Invalid order details",
        success: false,
      });
    }

    let amount = 0;
    let totalTax = 0;

    // Validate first (IMPORTANT FIX)
    const productsToUpdate = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock`,
        });
      }

      const itemPrice = product.offerPrice * item.quantity;
      const tax = (itemPrice * (product.taxRate || 0)) / 100;

      amount += itemPrice;
      totalTax += tax;

      productsToUpdate.push({
        product,
        quantity: item.quantity,
      });
    }

    // Reduce stock AFTER validation
    for (const p of productsToUpdate) {
      p.product.stock -= p.quantity;
      await p.product.save();
    }

    const deliveryCharge = amount > 200 ? 0 : 30;
    const finalAmount = amount + totalTax + deliveryCharge;

    await Order.create({
      userId,
      items,
      address,
      amount: finalAmount,
      totalTax,
      deliveryCharge,
      paymentType: "COD",
      isPaid: false,
      status: "Order Placed",
      deliveryBoy: null,
    });

    res.status(201).json({
      message: "Order placed successfully",
      success: true,
      amount: finalAmount,
      totalTax,
      deliveryCharge,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

/* =========================
   GET USER ORDERS
========================= */
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user;

    const orders = await Order.find({ userId })
      .populate("items.product deliveryBoy")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

/* =========================
   GET ALL ORDERS (ADMIN)
========================= */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("items.product deliveryBoy userId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

/* =========================
   CANCEL ORDER (RESTOCK FIX)
========================= */
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const status = order.status?.toLowerCase();

    if (status !== "order placed") {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled",
      });
    }

    // RESTOCK ITEMS
    for (const item of order.items) {
      const product = await Product.findById(item.product);

      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.status = "Cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =========================
   UPDATE ORDER STATUS
========================= */
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

    if (status?.toLowerCase() === "delivered") {
      order.deliveryBoy = null;
    }

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

/* =========================
   ASSIGN DELIVERY BOY
========================= */
export const assignDeliveryBoy = async (req, res) => {
  try {
    const { orderId, deliveryBoyId } = req.body;

    if (!orderId || !deliveryBoyId) {
      return res.status(400).json({
        success: false,
        message: "Please select a delivery boy",
      });
    }

    const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message: "Delivery boy not found",
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        deliveryBoy: deliveryBoyId,
        status: "Shipped",
      },
      { new: true }
    ).populate("deliveryBoy");

    res.status(200).json({
      success: true,
      message: "Delivery boy assigned successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   RETURN ORDER (REQUEST)
========================= */
export const returnOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status?.toLowerCase() !== "delivered") {
      return res.status(400).json({
        success: false,
        message: "Only delivered orders can be returned",
      });
    }

    if (order.status === "Return Requested") {
      return res.status(400).json({
        success: false,
        message: "Return already requested",
      });
    }

    order.status = "Return Requested";
    order.returnStatus = "Requested";
    order.isReturned = false;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Return request sent to admin",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =========================
   APPROVE RETURN (RESTOCK FIX)
========================= */
export const approveReturn = async (req, res) => {
  try {
    const { orderId } = req.body;

    console.log("approveReturn called", { orderId, body: req.body });

    const order = await Order.findById(orderId).populate("items.product");

    if (!order) {
      console.log("approveReturn: order not found", orderId);
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const status = (order.status || "").trim().toLowerCase();

    console.log("approveReturn: current order status", status, "items count", order.items.length);

    if (status !== "return requested") {
      return res.status(400).json({
        success: false,
        message: "No return request found",
      });
    }

    let restockedCount = 0;

    for (const item of order.items) {
      const productId = item.product?._id || item.product;
      const quantity = Number(item.quantity || 0);

      console.log("approveReturn: item", {
        itemProduct: item.product,
        productId,
        quantity,
      });

      if (!productId) {
        console.log("approveReturn: skipping item because productId is missing", item);
        continue;
      }

      if (Number.isNaN(quantity) || quantity <= 0) {
        console.log("approveReturn: invalid quantity for product", productId, quantity);
        continue;
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { $inc: { stock: quantity } },
        { new: true }
      );

      if (!updatedProduct) {
        console.log("approveReturn: product not found for update", productId);
        continue;
      }

      console.log("approveReturn: updated stock", {
        productId,
        newStock: updatedProduct.stock,
      });

      restockedCount += 1;
    }

    order.status = "Returned";
    order.returnStatus = "Approved";
    order.isReturned = true;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Return approved successfully",
      restockedCount,
    });
  } catch (error) {
    console.error("approveReturn error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};