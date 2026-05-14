import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
      },
    ],

    amount: { type: Number, required: true },
    deliveryCharge: { type: Number, default: 0 },
    address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },

    status: { type: String, default: "order placed" },

    paymentType: { type: String, required: true },

    isPaid: { type: Boolean, required: true, default: false },

    deliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryBoy",
    },

    // ADD THESE TWO FIELDS (FOR RETURN FEATURE)
    returnStatus: {
      type: String,
      default: "Not Requested", // Not Requested | Requested | Approved | Rejected
    },

    isReturned: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    review: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;