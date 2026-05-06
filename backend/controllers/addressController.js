import Address from "../models/address.js";

// ADD ADDRESS
export const addAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const { address } = req.body || {};

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Address data missing",
      });
    }

    await Address.create({
      ...address,
      userId,
    });

    res.status(201).json({
      success: true,
      message: "Address added successfully",
    });

  } catch (error) {
    console.error("ADD ADDRESS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ADDRESS
export const getAddress = async (req, res) => {
  try {
    const userId = req.userId;

    const addresses = await Address.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      addresses,
    });

  } catch (error) {
    console.error("GET ADDRESS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};