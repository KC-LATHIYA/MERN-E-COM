import Wishlist from "../model/wishList.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import Product from "../model/product.js";

const getWishlist = asyncHandler(async function (req, res) {

    const userId = req.user?._id

    if (!userId) {
        throw new ApiError(400, "User Id Not Found!");
    }

    let wishlist = await Wishlist.findOne({ user: userId }).populate({
        path: "products.product",
        select: "name images category price countInStock"
    });

    if (!wishlist) {
        wishlist = await Wishlist.create({
            user: userId,
            products: []
        });
    }

    res.status(200)
        .json(
            new ApiResponse(
                200,
                wishlist,
                "User WishList Fetched Successfully!"
            )
        )

});

const addToWishlist = asyncHandler(async function (req, res) {

    const userId = req.user?._id
    const { productId } = req.params
    const { size } = req.body

    if (!size) {
        throw new ApiError(400, "Size Not Found!");
    }

    if (!userId) {
        throw new ApiError(400, "User Id Not Found!");
    }

    if (!productId) {
        throw new ApiError(400, "Product Id Not Found!");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product Not Found!");
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
        wishlist = await Wishlist.create({
            user: userId,
            products: []
        })
    }

    const existingItem = wishlist.products.find((item) => item.product.toString() === productId.toString());

    if (existingItem) {
        throw new ApiError(409, "Product Already Exist In WishList!");
    } else {
        wishlist.products.push({
            product: productId,
            size: size
        });
    }

    await wishlist.save({ validateBeforeSave: false });

    res.status(200)
        .json(
            new ApiResponse(
                200,
                wishlist,
                "Product Added In WishList Successfully!"
            )
        )

});

const removeFromWishlist = asyncHandler(async function (req, res) {

    const userId = req.user?._id
    const { productId } = req.params

    if (!userId) {
        throw new ApiError(400, "User Id Not Found!");
    }

    if (!productId) {
        throw new ApiError(400, "Product Id Not Found!");
    }

    const wishList = await Wishlist.findOne({ user: userId });

    if (!wishList) {
        throw new ApiError(404, "WishList Not Found!");
    }

    wishList.products = wishList.products.filter((item) => item.product.toString() !== productId.toString());
    await wishList.save({ validateBeforeSave: false });

    res.status(200)
        .json(
            new ApiResponse(
                200,
                wishList,
                "Product Removed From WishList Successfully!"
            )
        )

});

export {
    getWishlist,
    addToWishlist,
    removeFromWishlist
}