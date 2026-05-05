import mongoose from "mongoose";

const deliveryBoySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    vehicleNumber: {
      type: String,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const DeliveryBoy = mongoose.model("DeliveryBoy", deliveryBoySchema);

export default DeliveryBoy;