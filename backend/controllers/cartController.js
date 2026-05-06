import User from "../models/User.js";

// ================= UPDATE CART =================
// POST: /api/cart/update

export const updateCart = async (req, res) => {
  try {
    const userId = req.userId; 
    const { cartItems } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { cart: cartItems }, 
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart: updatedUser.cart, 
    });
  } catch (error) {
    console.error("Cart Update Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};