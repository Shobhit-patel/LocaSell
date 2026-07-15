import Listing from "../../models/Listing.js";
import User from "../../models/User.js";


export const toggleListingStatus = async (req, res) => {
  try {
    const { listingId } = req.params;
    const userId = req.user._id.toString();

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found.",
      });
    }

    // Only the seller can update status
    if (listing.sellerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to perform this action.",
      });
    }

    // Toggle status
    if (listing.status === "sold") {
      listing.status = "active";
      await User.findByIdAndUpdate(listing.sellerId, {
        $inc: {
          soldItem: -1,
          activeItem: 1,
        },
      });

    } else {
      listing.status = "sold";
      await User.findByIdAndUpdate(listing.sellerId, {
        $inc: {
          soldItem: 1,
          activeItem: -1,
        },
      });

    }

    await listing.save();

    return res.status(200).json({
      success: true,
      message: `Listing marked as ${listing.status} successfully.`,
      listing,
    });
  } catch (error) {
    console.error("Toggle Listing Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};