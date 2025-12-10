import Order from "../model/order.js";
import razorpay from "../utils/razorpay.js"
import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Cart from "../model/cart.js";
import Product from "../model/product.js";

const getMyOrders = asyncHandler(async function (req, res) {

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized Request!");
    }

    const myOrders = await Order.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200)
        .json(
            new ApiResponse(
                200,
                myOrders,
                "User's All Order Fetched Successfully!"
            )
        )

});

const getOrderDetails = asyncHandler(async function (req, res) {

    const { orderId } = req.params;

    if (!orderId) {
        throw new ApiError(400, "Order Id Not Found!");
    }

    const order = await Order.findById(orderId);

    if (!order) {
        throw new ApiError(404, "Order Not Found!");
    }

    res.status(200)
        .json(
            new ApiResponse(
                200,
                order,
                "Ordder Details Fetched Successfully!"
            )
        )

});

const getOrderDetailsAdmin = asyncHandler(async function (req, res) {
    const { orderId } = req.params;

    if (!orderId) {
        throw new ApiError(400, "Order Id Not Found!");
    }

    const order = await Order.findById(orderId).populate("user", "firstname email mobileno");

    if (!order) {
        throw new ApiError(404, "Order Not Found!");
    }

    res.status(200)
        .json(
            new ApiResponse(
                200,
                order,
                "Ordder Details Fetched Successfully!"
            )
        )
});

const createOrder = asyncHandler(async function (req, res) {
    const userId = req.user?._id;
    const { shippingAddress, paymentMethod } = req.body;

    if (!userId) {
        throw new ApiError(401, "Unauthorized Request!");
    }

    if (!shippingAddress || !paymentMethod) {
        throw new ApiError(400, "All Credentials Required!");
    }

    const cart = await Cart.findOne({ user: userId })
        .populate({
            path: "items.product",
            select: "name price images"
        });
    if (!cart && cart.items.length === 0) {
        throw new ApiError(404, "Cart And Cart Item Not Found!");
    }

    const TrackingNumber = () => {
        const randomPart = crypto.randomBytes(4).toString("hex").toUpperCase();
        const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        return `ORD-${datePart}-${randomPart}`;
    }

    const orderItems = cart.items.map((item) => ({
        productId: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.images?.[0]?.url,
        size: item.size
    }));

    const order = await Order.create({
        user: userId,
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice: cart.totalPrice,
        TrackingNumber: TrackingNumber()
    });

    if (!order) {
        throw new ApiError(500, "Something Went Wrong To Create Order!");
    }

    if (paymentMethod === "Razorpay") {
        const option = {
            amount: order.totalPrice * 100,
            currency: "INR",
            receipt: `order_rcptid_${order._id}`,
        };

        const razorpayOrder = await razorpay.orders.create(option);

        if (!razorpayOrder) {
            throw new ApiError(404, "Razorpay Order Not Found!");
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    razorpayOrder,
                    orderId: order._id,
                    key: process.env.RAZORPAY_API_KEY,
                },
                "Payment Order Created!"
            )
        );
    }

    for (const item of orderItems) {
        let product = await Product.findOne(item.productId);

        if (!product) {
            throw new ApiError(404, "Product Not Found!");
        }

        if (product.countInStock < item.quantity) {
            throw new ApiError(400, "Not enough stock for product");
        }

        product.countInStock -= item.quantity
        product.save({ validateBeforeSave: false });

    }

    cart.items = [];
    cart.totalPrice = 0;
    cart.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(
            200,
            order,
            "Order Created Successfully!"
        )
    );
});

const verifyPayment = asyncHandler(async function (req, res) {

    const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRATE_KEY)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature !== razorpay_signature) {
        throw new ApiError(400, "Invalid Payment Signature");
    }

    const order = await Order.findById(orderId);

    if (!order) {
        throw new ApiError(404, "Order Not Found!");
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
        id: razorpay_payment_id,
        status: "Paid",
        update_time: new Date().toISOString(),
        email_address: req.user?.email || "",
    };

    await order.save();

    for (const item of order.orderItems) {
        let product = await Product.findOne(item.productId);

        if (!product) {
            throw new ApiError(404, "Product Not Found!");
        }

        if (product.countInStock < item.quantity) {
            throw new ApiError(400, "Not enough stock for product");
        }

        product.countInStock -= item.quantity
        product.save({ validateBeforeSave: false });
    }

    const userId = req.user?._id

    if (!userId) {
        throw new ApiError(400, "User Id Is Required!");
    }

    const cart = await Cart.findOne({ user: userId });

    cart.items = [];
    cart.totalPrice = 0;
    cart.save({ validateBeforeSave: false });

    res.status(200)
        .json(
            new ApiResponse(
                200,
                order,
                "Payment Verify Successfully!"
            )
        )

});

const getAllOrders = asyncHandler(async function (req, res) {

    const allOrders = await Order.find().populate("user", "firstname");

    res.status(200)
        .json(
            new ApiResponse(
                200,
                allOrders,
                "All Order Fetched Successfully!"
            )
        )
});

const markedAsPaid = asyncHandler(async function (req, res) {

    const { orderId } = req.params;

    if (!orderId) {
        throw new ApiError(400, "Order Id Not Found!");
    }

    const order = await Order.findById(orderId);

    if (!order) {
        throw new ApiError(404, "Order Not Found");
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    await order.save();

    res.status(200)
        .json(
            new ApiResponse(
                200,
                order,
                "Order Payment Status Updated Successfully!"
            )
        )

});

const markedAsDeliver = asyncHandler(async function (req, res) {

    const { orderId } = req.params;

    if (!orderId) {
        throw new ApiError(400, "Order Id Not Found!");
    }

    const order = await Order.findById(orderId);

    if (!order) {
        throw new ApiError(404, "Order Not Found");
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    await order.save();

    res.status(200)
        .json(
            new ApiResponse(
                200,
                order,
                "Order Delivered Status Updated Successfully!"
            )
        )

});

// const createPaymentOrder = asyncHandler(async function (req, res) {

//     const { orderId } = req.body;

//     if (!orderId) {
//         throw new ApiError(400, "Order Id Is Required!");
//     }

//     const order = await Order.findById(orderId);

//     if (!order) {
//         throw new ApiError(404, "Order Not Found!")
//     }

//     const option = {
//         amount: order.totalPrice * 100,
//         currency: "INR",
//         receipt: `order_rcptid_${order._id}`,
//     }

//     const razorpayOrder = await razorpay.orders.create(option);

//     res.status(200)
//         .json(
//             new ApiResponse(
//                 200,
//                 {
//                     razorpayOrder,
//                     orderId: order._id,
//                     key: process.env.RAZORPAY_API_KEY,
//                 },
//                 "Payment Order Created!"
//             )
//         )

// });

export {
    getMyOrders,
    getOrderDetails,
    createOrder,
    getAllOrders,
    markedAsDeliver,
    markedAsPaid,
    verifyPayment,
    getOrderDetailsAdmin
}