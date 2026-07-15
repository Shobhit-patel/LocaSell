import Listing from "../../models/Listing.js";
import User from "../../models/User.js";

export const soOneListing = async (req, res) => {
    try {
        const id = req.params.id

        const listing = await Listing.findById(id)
        const seller = await User.findById(listing.sellerId)

        res.status(200).json({
            product: listing,
            seller: seller
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}