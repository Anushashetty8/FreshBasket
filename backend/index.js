import path from "path";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
dotenv.config();
import userRoutes from "./routes/userRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import { connectCloudinary } from "./config/cloudinary.js";


const app=express();
connectDB();
connectCloudinary();

const allowedOrigins=["http://localhost:5173"];
//middleware
app.use(express.json());
app.use(cors({origin: true, credentials: true}));
app.use(cookieParser());
app.use("/images", express.static("uploads"));

//api endpointes
app.use("/images", express.static("uploads"));
app.use("/api/user",userRoutes);
app.use("/api/seller",sellerRoutes);
app.use("/api/product",productRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/order",orderRoutes);
app.use("/api/address",addressRoutes);


const PORT = process.env.PORT||5000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});