import User from "../../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, confirmPassword, location } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exist",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "password and confirm password are not same",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            location: {
                type: "Point",
                coordinates: [
                    location.lng,
                    location.lat
                ]
            }
        });

        let token;
        try {
            token = jwt.sign(
                {
                    _id: user._id,
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

        res.status(201).json({
            success: true,
            message: "signup successful",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                avatar: user.avatar,
                location: user.location,
                productListed:user.productListed,
                averageRating: user.averageRating,
                reviewCount: user.reviewCount,
                wishlist:user.wishlist,
                addToCart:user.addToCart,
                soldItem: user.soldItem,
                activeItem: user.activeItem,
                responsePercent: user.responsePercent,
                createdAt: user.createdAt,
            },
            token: token,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};