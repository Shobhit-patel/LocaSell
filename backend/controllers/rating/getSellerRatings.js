import Rating from "../../models/Rating.js";
import User from "../../models/User.js";

export const getSellerRatings = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const seller = await User.findById(sellerId).select(
      "name profileImage averageRating reviewCount responsePercent"
    );

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    const ratings = await Rating.find({ seller: sellerId })
      .populate("reviewer", "firstName lastName profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      seller,
      ratings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};