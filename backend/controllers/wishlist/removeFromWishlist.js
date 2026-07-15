import User from "../../models/User.js";

export const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.wishlist = user.wishlist.filter(
            (id) => id.toString() !== productId
        );

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist",
            wishlist: user.wishlist,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};