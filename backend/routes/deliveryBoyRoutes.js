import express from "express";
import { getDeliveryBoys } from "../controllers/deliveryBoyController.js";
import { authSeller } from "../middleware/authSeller.js";

const router = express.Router();

router.get("/", authSeller, getDeliveryBoys);

export default router;