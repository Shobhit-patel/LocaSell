import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
            trim: true,
        },
        description: {
            type: String,
            require: true,
            trim: true,
        },
        price: {
            type: Number,
            require: true,
            trim: true,
        },
        category: {
            type: String,
            require: true,
        },
        condition: {
            type: String,
            require: true,
        },
        brand: {
            type: String,
            require: true,
        },
        model: {
            type: String,
        },
        product_age: {
            type: String,
            require: true,
        },
        original_price: {
            type: Number,
        },
        image: {
            type: Array,
            validate: {
                validator: function (value) {
                    return value.length <= 4;
                },
                message: "You can upload a maximum 4 photos",
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
            type: String,
            require: true,
        },
        status: {
            type: String,
            enum: ['active', 'sold']
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