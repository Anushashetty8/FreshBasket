import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// ================= REGISTER =================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "User registered successfully",
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        cart: user.cartItems || {},
      },
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// ================= LOGIN =================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Logged in successfully",
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        cart: user.cartItems || {},
      },
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Reset URL
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    // Mail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "FreshBasket Password Reset",
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">
          Reset Password
        </a>

        <p>This link expires in 15 minutes.</p>
      `,
    });

    res.status(200).json({
      message: "Password reset link sent to email",
      success: true,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
        success: false,
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password
    await User.findByIdAndUpdate(decoded.id, {
      password: hashedPassword,
    });

    res.status(200).json({
      message: "Password reset successful",
      success: true,
    });

  } catch (error) {
    console.log(error);

    res.status(400).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
};

// ================= LOGOUT =================
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.json({
      message: "User logged out successfully",
      success: true,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// ================= IS AUTH =================
export const isAuthUser = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const user = await User.findById(userId).select("-password");

    res.json({
      success: true,
      user,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};