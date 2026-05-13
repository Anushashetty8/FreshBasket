import express from "express";

import {
  registerSeller,
  sellerLogin,
  sellerLogout,
  isAuthSeller,
} from "../controllers/sellerController.js";

import { authSeller } from "../middleware/authSeller.js";

const router = express.Router();

// REGISTER
router.post("/register", registerSeller);

// LOGIN
router.post("/login", sellerLogin);

// CHECK AUTH
router.get("/is-auth", isAuthSeller);

// LOGOUT
router.post("/logout", sellerLogout);

export default router;