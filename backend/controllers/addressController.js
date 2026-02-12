import Address from "../models/address.js";

//add address :/api/address/add

export const addAddress = async(req, res) =>{
    try{
         const userId = req.user;
         const {address} = req.body;
         await Address.create({
            ...address,
            userId,
         });
         res.status(201).json({
            message: "Address added successfully",
            success:true,
         });
    }catch (error){
        console.error("error adding:",error);
        res.status(500).json({message: "Internal server error"});
    }
}

// get adderess: /api/address/get
export const getAddress = async(req, res)=>{
    try{
    const userId = req.user;
        const addresses = (await Address.find({userId})).toSorted({createdAt: -1})
        res.status(200).json({
            success: true,
            addresses,
        });
    }catch(error){
        console.error("error fetching address:",error);
        res.status(500).json({message:"Internal server error"});
    }
};