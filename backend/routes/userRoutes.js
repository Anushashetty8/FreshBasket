import express from "express";

import {
  isAuthUser,
  loginUser,
  logoutUser,
  registerUser,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";

import { authUser } from "../middleware/authUser.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/logout", authUser, logoutUser);
router.get("/is-auth", authUser, isAuthUser);

export default router;