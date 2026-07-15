import express from "express";
import { verifyToken } from "../middleware/verify.js";
import { getCart } from "../controllers/addToCart/getCart.js";
import { addToCart } from "../controllers/addToCart/addToCart.js";
import { removeFromCart } from "../controllers/addToCart/removeFromCart.js";
import { toggleCart } from "../controllers/addToCart/toggleCart.js";

const router = express.Router();

router.get("/", verifyToken, getCart);

router.post("/add", verifyToken, addToCart);

router.delete("/remove/:productId", verifyToken, removeFromCart);

// Recommended (single endpoint)
router.post("/toggle", verifyToken, toggleCart);

export default router;