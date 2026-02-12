import User from "../models/User.js";

//update user cartData:/api/cart/update

export const updateCart = async(req,res)=>{
    try{
        const userId = req.user; 
        const {cartItems} = req.body;
        const updatedCart = await User.findByIdAndUpdate(
            userId,
            {cartData: cartItems},
                {new: true}
             );
             if(!updatedCart){
                return res
                .status(404)
                .json({message: "User not found",success:false});
             }
             res.status(200).json({updatedUser, success:true,message: "Cart updated successfully"});
    }catch(error){
        res.status(500).json({message: "Server error", error: error.message})
    }
};