import Listing from "../../models/Listing.js";
import User from "../../models/User.js";
import jwt from "jsonwebtoken";

export const getBack = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized user"
            });
        }

        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY
        );

        const existingUser = await User.findById(decodedToken._id);
        
        const postByUser = await Listing.find({
            _id: { $in: existingUser.productListed }
        })

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                _id: existingUser._id,
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                email: existingUser.email,
                avatar: existingUser.avatar,
                location: existingUser.location,
                productListed:existingUser.productListed,
                averageRating: existingUser.averageRating,
                reviewCount: existingUser.reviewCount,
                wishlist:existingUser.wishlist,
                addToCart:existingUser.addToCart,
                soldItem: existingUser.soldItem,
                activeItem: existingUser.activeItem,
                responsePercent: existingUser.responsePercent,
                createdAt: existingUser.createdAt,
            },
            token: token,
            listing: postByUser,
        });

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};