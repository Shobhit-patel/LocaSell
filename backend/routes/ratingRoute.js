import express from "express";
import { giveRating } from "../controllers/rating/rating.js";
import { verifyToken } from "../middleware/verify.js";

const router = express.Router();

router.post("/rate", verifyToken, giveRating);

export default router;