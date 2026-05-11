import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {
  try {
    // Get token from cookies OR authorization header
    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1];

    // No token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Invalid token
    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // Attach user ID
    req.userId = decoded.id;

    next();
  } catch (error) {
    console.log(error);

    return res.status(401).json({
      success: false,
      message: "Unauthorized - Token expired",
    });
  }
};