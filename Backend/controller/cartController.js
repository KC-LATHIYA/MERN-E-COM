import Cart from "../model/cart.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Product from "../model/product.js";

const getUserCart = asyncHandler(async function (req, res) {

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(400, "User Id Not Found!");
    }

    let cart = await Cart.findOne({ user: userId }).populate("items.product", "name images price category");

    if (!cart) {
        cart = await Cart.create({
            user: userId,
            items: [],
            totalPrice: 0
        })
    }

    res.status(200)
        .json(
            new ApiResponse(
                200,
                cart,
                "User's Cart Fetched Successfully!"
            )
        )

});

const addItemInCart = asyncHandler(async function (req, res) {

    const { productId } = req.params;
    const { quantity, size } = req.body;

    if (!quantity || !size) {
        throw new ApiError(400, "All Details Required!");
    }

    if (!productId) {
        throw new ApiError(400, "Product Id Not Found!");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product Not Found!");
    }

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "User Id Not Found!");
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = await Cart.create({
            user: userId,
            items: [],
            totalPrice: 0
        })
    }

    const existingItem = cart.items.find((item) => item.product.toString() === productId.toString());

    const productPrice = product.price * quantity;

    if (existingItem) {
        existingItem.quantity += 1
        existingItem.price = product.price * existingItem.quantity
    } else {
        cart.items.push({
            product: product._id,
            quantity: quantity,
            size: size,
            price: productPrice
        });
    }

    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price, 0);
    await cart.save();

    res.status(200)
        .json(
            new ApiResponse(
                200,
                cart,
                "Product Added In Cart Successfully!"
            )
        )

});

const updateQuantity = asyncHandler(async function (req, res) {

    const { productId } = req.params;
    const userId = req.user?._id;
    const { plus, minus } = req.body;

    if (!productId) {
        throw new ApiError(400, "Product Id Not Found!");
    }

    if (!userId) {
        throw new ApiError(400, "User Id Not Found!");
    }

    if (!plus && !minus) {
        throw new ApiError(400, "All Credentials Required!");
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        throw new ApiError(404, "Cart Not Found!")
    }

    let item = cart.items.find((i) => i.product.toString() === productId.toString());

    if (!item) {
        throw new ApiError(404, "Item Not Found!");
    }

    if (plus) {
        item.quantity += 1
    }

    if (minus) {
        item.quantity -= 1
        if (item.quantity <= 0) {
            cart.items = cart.items.filter((i) => i.product.toString() !== productId);
        }
    }

    if (item.quantity > 0) {
        const product = await Product.findById(productId);
        item.price = product.price * item.quantity
    }

    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price, 0);

    await cart.save();

    res.status(200)
        .json(
            new ApiResponse(
                200,
                cart,
                "Product Quantity Updated!"
            )
        )

});

const removeItemInCart = asyncHandler(async function (req, res) {

    const { productId } = req.params;
    const userId = req.user?._id;

    if (!productId) {
        throw new ApiError(400, "Product Id Not Found!");
    }

    if (!userId) {
        throw new ApiError(400, "User Id Not Found!");
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        throw new ApiError(404, "Cart Not Found");
    }

    cart.items = cart.items.filter((i) => i.product.toString() !== productId.toString());

    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price, 0);

    await cart.save();

    res.status(200)
        .json(
            new ApiResponse(
                200,
                cart,
                "Product Removed From Cart Successfully"
            )
        )

});

export {
    getUserCart,
    addItemInCart,
    updateQuantity,
    removeItemInCart
}