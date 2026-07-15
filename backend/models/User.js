import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },

        lastName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        password: {
            type: String,
            min: 6,
            required: true,
        },

        avatar: {
            type: String,
            default: "",
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

        productListed: {
            type: Array,
            default: [],
        },

        averageRating: {
            type: Number,
            default: 0,
        },

        reviewCount: {
            type: Number,
            default: 0,
        },

        wishlist: {
            type: Array,
            default: [],
        },

        addToCart: {
            type: Array,
            default: [],
        },

        soldItem: {
            type: Number,
            default: 0,
        },

        activeItem: {
            type: Number,
            default: 0,
        },

        responsePercent: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("User", userSchema);