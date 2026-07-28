import express from "express";
import { giveRating } from "../controllers/rating/rating.js";
import { verifyToken } from "../middleware/verify.js";
import { getSellerRatings } from "../controllers/rating/getSellerRatings.js";

const router = express.Router();

router.post("/rate", verifyToken, giveRating);
router.get("/:sellerId", getSellerRatings);

export default router;