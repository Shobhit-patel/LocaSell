import Rating from "../../models/Rating.js";
import User from "../../models/User.js";

export const giveRating = async (req, res) => {
  try {
    const { sellerId, rating, review } = req.body;
    const reviewerId = req.user.id;

    // Check if already rated
    let existing = await Rating.findOne({
      reviewer: reviewerId,
      seller: sellerId,
    });

    if (existing) {
      existing.rating = rating;
      existing.review = review;
      await existing.save();
    } else {
      await Rating.create({
        reviewer: reviewerId,
        seller: sellerId,
        rating,
        review,
      });
    }

    // Calculate new average
    const ratings = await Rating.find({ seller: sellerId });

    const total = ratings.reduce((sum, item) => sum + item.rating, 0);

    const avg = total / ratings.length;

    const resPer = (avg.toFixed(1) * 100) / 5

    await User.findByIdAndUpdate(sellerId, {
      averageRating: avg.toFixed(1),
      reviewCount: ratings.length,
      responsePercent: resPer,
    });

    res.status(200).json({
      success: true,
      message: "Rating submitted",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};