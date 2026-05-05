import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},

    items:[
        {
            product:{type: mongoose.Schema.Types.ObjectId, ref: "Product"},
            quantity: {type: Number, required: true},
        },
    ],
    amount: {type: Number, required: true},
    address:{type: mongoose.Schema.Types.ObjectId, ref:"Address"},
    status:{type:String, default: "order placed"},
    paymentType:{type:String, required: true},
    isPaid:{type: Boolean, required: true, default: false},
    deliveryBoy: {type: mongoose.Schema.Types.ObjectId, ref: "DeliveryBoy"},

},
{timestamps: true}
);
const Order = mongoose.model("Order", orderSchema);
export default Order;