import Listing from "../../models/Listing.js";
import User from "../../models/User.js";

export const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select("wishlist");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const products = await Listing  .find({
            _id: { $in: user.wishlist },
          });      
        
        return res.status(200).json({
            success: true,
            wishlist: products,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};