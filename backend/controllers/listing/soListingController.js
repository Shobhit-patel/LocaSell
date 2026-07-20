import Listing from "../../models/Listing.js";

export const soListing = async (req, res) => {
    try {
        const {
            category,
            price,
            radius,
            latitude,
            longitude,
            condition,
            search,
        } = req.query;

        const filter = {};

        if (category && category !== "All listings") {
            filter.category = category;
        }

        if (price) {
            filter.price = {
                $lte: Number(price),
            };
        }

        if (condition) {
            filter.condition = condition;
        }

        if (search) {
            filter.name = {
                $regex: search,
                $options: "i",
            };
        }

        if (
            Number(latitude) !== 0 &&
            Number(longitude) !== 0 &&
            radius
        ) {
            filter.location = {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [Number(longitude), Number(latitude)],
                    },
                    $maxDistance: Number(radius) * 1000,
                },
            };
        }

        const products = await Listing.find(filter);

        return res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
