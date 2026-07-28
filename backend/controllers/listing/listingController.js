import Listing from "../../models/Listing.js";
import jwt from "jsonwebtoken";
import cloudinary from "../../config/cloudinary.js";
import User from "../../models/User.js";

export const listing = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            condition,
            product_age,
            original_price,
            location,
            status,
            categoryData,
        } = req.body;

        // Get JWT Token
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized user",
            });
        }

        let decodedToken;

        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            });
        }

        // Upload Images
        const imageUrls = [];

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(
                    `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
                    {
                        folder: "listings",
                    }
                );

                imageUrls.push(result.secure_url);
            }
        }

        // Parse JSON fields if they come as strings
        const parsedLocation =
            typeof location === "string" ? JSON.parse(location) : location;

        const parsedCategoryData =
            typeof categoryData === "string"
                ? JSON.parse(categoryData)
                : categoryData;

        // Create Listing
        const newListing = await Listing.create({
            name,
            description,
            price,
            category,
            condition,
            product_age,
            original_price,
            image: imageUrls,
            location: parsedLocation,
            categoryData: parsedCategoryData,
            sellerId: decodedToken._id,
            status,
        });

        // Update User
        await User.findByIdAndUpdate(decodedToken._id, {
            $push: {
                productListed: newListing._id,
            },
            $inc: {
                activeItem: 1,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Product uploaded successfully",
            listing: newListing,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};