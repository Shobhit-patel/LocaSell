import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    condition: {
      type: String,
      required: true,
    },

    // Store all category-specific fields here
    categoryData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    product_age: {
      type: String,
      required: true,
    },

    original_price: {
      type: Number,
    },

    image: {
      type: [String],
      validate: {
        validator: (value) => value.length <= 4,
        message: "You can upload a maximum of 4 photos",
      },
      default: [],
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "sold"],
      default: "active",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

listingSchema.index({ location: "2dsphere" });

export default mongoose.model("Listing", listingSchema);