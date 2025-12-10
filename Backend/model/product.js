import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    username: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: [0, "Rating must be at least 0"],
        max: [5, "Rating cannot exceed 5"]
    },
    comment: {
        type: String,
        required: true
    },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    images: [
        {
            public_id: String,
            url: String,
        }
    ],
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0
    },
    sizes: [
        {
            type: String,
            required: true
        }
    ],
    totalRating: {
        type: Number
    },
    reviews: [reviewSchema],
}, { timestamps: true });

productSchema.pre("save", function (next) {
    if (this.images.length > 5) {
        this.images = this.images.slice(0, 5);
    }
    next();
});


const Product = mongoose.model("Product", productSchema);
export default Product;
