import User from "../../models/User.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import Listing from "../../models/Listing.js";

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const isPasswordMatch = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        let token;
        try {
            token = jwt.sign(
                {
                    _id: existingUser._id,
                },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "7d" }
            );
        } catch (err) {
            console.log(err);
            const error =
                new Error("Something went wrong");
            return next(error);
        }

        const postByUser = await Listing.find({
            _id: { $in: existingUser.productListed }
        })

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                _id: existingUser._id,
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                email: existingUser.email,
                avatar: existingUser.avatar,
                location: existingUser.location,
                productListed: existingUser.productListed,
                averageRating: existingUser.averageRating,
                reviewCount: existingUser.reviewCount,
                wishlist: existingUser.wishlist,
                addToCart: existingUser.addToCart,
                soldItem: existingUser.soldItem,
                activeItem: existingUser.activeItem,
                responsePercent: existingUser.responsePercent,
                createdAt: existingUser.createdAt,
            },
            token: token,
            listing: postByUser,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};