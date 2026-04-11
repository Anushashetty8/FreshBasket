import mongoose, { Types } from 'mongoose';
const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
    },
    description:{
        type: Array,
        required:true,
    },
    price:{
        type: Number,
        required:true,
    },
    offerPrice:{
        type: Number,
        required:true,
    },
    image:{
        type: Array,
        required:true,
    },
    category:{
        type: String,
        required:true,
    },
    inStock:{
        type: Boolean,
        default:true,
        required:true,
    },
    taxRate:{   
        type: Number,
        required:true,  
        default: 0,
    },  

});

const Product = mongoose.model("Product",productSchema);
export default Product;