import jwt from "jsonwebtoken";

export const authUser = (req, res, next) => {
  try {
    //  Get token from cookies OR headers (flexible)
    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token",
      });
    }

    //  Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid token data",
      });
    }

    //  Attach user id
    req.userId = decoded.id;

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid or expired token",
    });
  }
};