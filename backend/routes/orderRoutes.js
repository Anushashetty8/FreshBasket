import express from "express";
import {authUser} from "../middleware/authUser.js";
import { getAllOrders, getUserOrders, placeOrderCOD ,cancelOrder} from "../controllers/orderController.js";
import {authSeller} from "../middleware/authSeller.js";
const router = express.Router();

router.post("/cod", authUser,placeOrderCOD);
router.get("/user",authUser,getUserOrders);
router.post("/cancel", authUser, cancelOrder);
router.get("/seller",authSeller,getAllOrders);
export default router;