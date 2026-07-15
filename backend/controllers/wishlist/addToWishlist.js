import User from "../../models/User.js";
import mongoose from "mongoose";

export const addToWishlist = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { productId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product id",
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Prevent duplicates
        if (user.wishlist.includes(productId)) {
            return res.status(400).json({ 
                success: false,
                message: "Product already in wishlist",
            });
        } 

        user.wishlist.push(productId);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Product added to wishlist",
            wishlist: user.wishlist,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


