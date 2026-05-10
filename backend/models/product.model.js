import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: Array,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    offerPrice: {
      type: Number,
      required: true,
    },

    image: {
      type: Array,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    inStock: {
      type: Boolean,
      default: true,
    },

    taxRate: {
      type: Number,
      default: 0,
    },

    // STOCK
    stock: {
      type: Number,
      default: 0,
    },

    // EXPIRY DATE
    expiryDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema);

export default Product;