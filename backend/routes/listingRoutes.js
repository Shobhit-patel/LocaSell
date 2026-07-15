import express from "express";
import { upload } from "../middleware/upload.js";
import { listing } from "../controllers/listing/listingController.js";
import { soListing } from "../controllers/listing/soListingController.js";
import { soOneListing } from "../controllers/listing/soOneListing.js";
import { verifyToken } from "../middleware/verify.js";
import { toggleListingStatus } from "../controllers/listing/markAsSoldController.js";

const router = express.Router();

router.post('/listings', upload.array("image"), listing);
router.get('/listings', soListing);
router.get('/listings/:id', soOneListing);
router.patch("/mark-sold/:listingId", verifyToken, toggleListingStatus);

export default router;