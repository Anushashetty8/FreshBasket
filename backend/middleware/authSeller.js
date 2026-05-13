import jwt from "jsonwebtoken";
import Seller from "../models/Seller.js";

export const authSeller = async (req, res, next) => {
  try {
    const { sellerToken } = req.cookies;

    if (!sellerToken) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    const seller = await Seller.findById(decoded.id);

    if (!seller) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    req.seller = seller;
    next();
  } catch (error) {
    console.error("Authentication error", error);
    return res.status(401).json({ message: "Unauthorized", success: false });
  }
};