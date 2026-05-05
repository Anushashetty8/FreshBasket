import express from "express";
import {authUser} from "../middleware/authUser.js";
import { getAllOrders,
     getUserOrders, 
     placeOrderCOD ,
     cancelOrder,
     updateOrderStatus,
     assignDeliveryBoy
    } from "../controllers/orderController.js";
import {authSeller} from "../middleware/authSeller.js";
const router = express.Router();

router.post("/cod", authUser,placeOrderCOD);
router.get("/user",authUser,getUserOrders);
router.post("/cancel", authUser, cancelOrder);
router.get("/seller",authSeller,getAllOrders);
router.post("/update-status", authSeller, updateOrderStatus);
router.post("/assign-delivery-boy", authSeller, assignDeliveryBoy);
export default router;