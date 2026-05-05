import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { connectCloudinary } from "./config/cloudinary.js";

// Routes
import userRoutes from "./routes/userRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

// Model
import DeliveryBoy from "./models/DeliveryBoy.js";

dotenv.config();

const app = express();

//  Connect services
await connectCloudinary();
await connectDB();

//  Middlewares
const allowedOrigins = ["http://localhost:5173"];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// API Routes
app.use("/images", express.static("uploads"));
app.use("/api/user", userRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);

// ================= DELIVERY BOY APIs =================

//  Get all delivery boys
app.get("/api/delivery-boy", async (req, res) => {
  try {
    const boys = await DeliveryBoy.find();
    res.status(200).json({ success: true, boys });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

//  Add new delivery boy
app.post("/api/delivery-boy", async (req, res) => {
  try {
    const { name, phone, vehicleNumber } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone are required",
      });
    }

    const newBoy = await DeliveryBoy.create({
      name,
      phone,
      vehicleNumber,
    });

    res.status(201).json({
      success: true,
      message: "Delivery boy added successfully",
      boy: newBoy,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});