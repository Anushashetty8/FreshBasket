import Seller from "../models/Seller.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER SELLER
export const registerSeller = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check empty fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check existing seller
    const existingSeller = await Seller.findOne({ email });

    if (existingSeller) {
      return res.status(400).json({
        success: false,
        message: "Seller already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save seller
    const seller = await Seller.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Seller registered successfully",
      seller,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// LOGIN SELLER
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check seller
    const seller = await Seller.findOne({ email });

    if (!seller) {
      return res.status(400).json({
        success: false,
        message: "Only Admin Access Allowed",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, seller.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    // create token
    const token = jwt.sign(
      { id: seller._id, email: seller.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // save cookie
    res.cookie("sellerToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      seller,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CHECK AUTH
export const isAuthSeller = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Seller authenticated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// LOGOUT
export const sellerLogout = async (req, res) => {
  try {
    res.clearCookie("sellerToken");

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};