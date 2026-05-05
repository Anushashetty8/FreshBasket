import DeliveryBoy from "../models/DeliveryBoy.js";

// GET all delivery boys
export const getDeliveryBoys = async (req, res) => {
  try {
    const boys = await DeliveryBoy.find();
    res.status(200).json({ success: true, boys });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};