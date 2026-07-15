import Listing from "../../models/Listing.js";
import jwt from 'jsonwebtoken'
import cloudinary from "../../config/cloudinary.js";
import User from "../../models/User.js";

export const listing = async (req, res) => {
    try {
        const { name, description, price, category, condition, brand, model, product_age, original_price, location, status } = req.body

        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401)
                .json(
                    {
                        success: false,
                        message: "Unauthorized user"
                    }
                );
        }

        let decodedToken
        try {
            decodedToken = jwt.verify(
                token,
                process.env.JWT_SECRET_KEY
            );
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

        const imageUrls = [];

        for (const file of req.files) {

            const result = await cloudinary.uploader.upload(
                `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
                {
                    folder: "listings"
                }
            );
            imageUrls.push(result.secure_url);
        }

        const listing = await Listing.create({
            name,
            description,
            price,
            category,
            condition,
            brand,
            model,
            product_age,
            original_price,
            image: imageUrls,
            location: JSON.parse(location),
            sellerId: decodedToken._id,
            status
        })

        await User.findByIdAndUpdate(
            decodedToken._id,
            {
                $push: {
                    productListed: listing._id,
                },
                $inc: {
                    activeItem: 1,
                },
            }
        );

        res.status(201).json({
            success: true,
            message: "product uploaded successful",
            listing: listing
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
        console.log(error)
    }
}