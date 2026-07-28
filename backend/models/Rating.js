import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1, 
      max: 5,
    },

    review: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

ratingSchema.index({ reviewer: 1, seller: 1 }, { unique: true });

export default mongoose.model("Rating", ratingSchema);