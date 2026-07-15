import express from "express";
import { verifyToken } from "../middleware/verify.js";
import { getWishlist } from "../controllers/wishlist/getWishlist.js";
import { addToWishlist } from "../controllers/wishlist/addToWishlist.js";
import { removeFromWishlist } from "../controllers/wishlist/removeFromWishlist.js";
import { toggleWishlist } from "../controllers/wishlist/toggleWishlist.js";

const router = express.Router();

router.get("/", verifyToken, getWishlist);
router.post("/add", verifyToken, addToWishlist);  
router.delete("/remove/:productId", verifyToken, removeFromWishlist);

// Recommended (single endpoint)
router.post("/toggle", verifyToken, toggleWishlist);

export default router;