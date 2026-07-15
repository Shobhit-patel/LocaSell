import Listing from "../../models/Listing.js";

export const soListing = async (req, res) => {
    try {
        const { category, price, radius, latitude, longitude, condition, search } = req.query;

        const filter = {};
        if (category !== 'All listings') {
            filter.category = category; 
        } else {
            filter;
        }

        if (price) {
            filter.price = {
                ...filter.price,
                $lte: Number(price),
            };
        }

        if (radius && latitude && longitude) {
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

        if (condition) {
            filter.condition = condition;
        }

        // add if searching
        if (search) {
            filter.name = {
                $regex: search,
                $options: "i",
            };
        }

        const products = await Listing.find(filter);

        res.status(200).json({
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
}