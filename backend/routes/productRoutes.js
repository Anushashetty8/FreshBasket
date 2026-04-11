import express from 'express';
import { authSeller } from '../middleware/authSeller.js';
import { upload } from "../config/multer.js";

import {
    addProduct,
    changeStock,
    getProductById,
    getProducts,
    deleteProduct,
    updateProduct
} from "../controllers/productController.js";

const router = express.Router();


router.post("/add-product", authSeller, upload.array("image"), addProduct);

router.get("/list", getProducts);

router.get("/:id", getProductById);

router.post("/stock", authSeller, changeStock);

router.delete("/:id", deleteProduct);


router.put("/update/:id", authSeller, upload.array("image"), updateProduct);

export default router;