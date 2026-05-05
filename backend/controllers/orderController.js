import Order from "../models/Order.js";
import Product from "../models/product.model.js";
import DeliveryBoy from "../models/DeliveryBoy.js";

//  Place Order (COD) → NO delivery boy here
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

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
          success: false,
        });
      }

      const itemPrice = product.offerPrice * item.quantity;
      const tax = (itemPrice * (product.taxRate || 0)) / 100;

      amount += itemPrice;
      totalTax += tax;
    }

    const finalAmount = amount + totalTax;

    //  IMPORTANT: deliveryBoy = null initially
    await Order.create({
      userId,
      items,
      address,
      amount: finalAmount,
      totalTax: totalTax,
      paymentType: "COD",
      isPaid: false,
      status: "Order Placed",
      deliveryBoy: null,
    });

    res.status(201).json({
      message: "Order placed successfully",
      success: true,
      amount: finalAmount,
      totalTax: totalTax,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

//  Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user;

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product deliveryBoy") // ❗ removed address populate
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

//  Get all orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
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

//  Cancel Order
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

    if (order.status?.toLowerCase() !== "order placed") {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled",
      });
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

//  Update Order Status
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

//  Assign Delivery Boy (ONLY here)
export const assignDeliveryBoy = async (req, res) => {
  try {
    const { orderId, deliveryBoyId } = req.body;

  
    if (!orderId || !deliveryBoyId || deliveryBoyId === "") {
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
      { deliveryBoy: deliveryBoyId },
      { new: true }
    ).populate("deliveryBoy");

    return res.status(200).json({
      success: true,
      message: "Delivery boy assigned successfully",
      order,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};