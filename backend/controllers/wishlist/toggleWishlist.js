import User from "../../models/User.js";

export const toggleWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
       
        const index = user.wishlist.findIndex(
            (id) => id.toString() === productId
        );

        let action = "";
        let message = "";

        if (index === -1) {
            user.wishlist.push(productId);
            action = "added";
            message = "Product added to wishlist";
        } else {
            user.wishlist.splice(index, 1);
            action = "removed";
            message = "Product removed from wishlist";
        }

        await user.save();

        return res.status(200).json({
            success: true,
            action,
            message,
            wishlist: user.wishlist,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};