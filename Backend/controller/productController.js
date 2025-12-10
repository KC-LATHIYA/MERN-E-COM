import Product from "../model/product.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../../../job-portel/Backend/utils/apierror.js";
import { ApiResponse } from "../utils/apiResponse.js";
import uploadOnCloudinary from "../utils/Cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

const getAllProducts = asyncHandler(async function (req, res) {

    const { keyword, category, sort } = req.query;

    const regexPattern = keyword
        .split("")
        .join("[-_\\s]*");

    const regex = new RegExp(regexPattern, "i");

    const query = {};
    if (regex) {
        query.name = { $regex: regex };
        query.description = { $regex: regex }
    }

    if (category) {
        query.category = category
    }

    const sortdata = {};

    if (sort === "nameAsc") sortdata.name = 1
    else if (sort === "nameDesc") sortdata.name = -1
    else if (sort === "priceLtoH") sortdata.price = 1
    else if (sort === "priceHtoL") sortdata.price = -1

    const allProducts = await Product.find(query).sort(sortdata);

    if (!allProducts) {
        throw new ApiError(404, "No Products Found!")
    }

    res.status(200)
        .json(
            new ApiResponse(
                200,
                allProducts,
                "All Products Fetched Successfully!"
            )
        )

});

const getProductById = asyncHandler(async function (req, res) {

    const { productId } = req.params;

    if (!productId) {
        throw new ApiError(400, "Product Id Not Found!");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product Not Found!");
    }

    res.status(200)
        .json(
            new ApiResponse(
                200,
                product,
                "Product Details Fetched Successfully"
            )
        )

});

const createProduct = asyncHandler(async function (req, res) {

    const { name, description, category, price, countInStock, sizes } = req.body;

    if (!name || !description || !category || !price || !countInStock) {
        throw new ApiError(400, "All Credentials Required!");
    }

    const localProductimages = req?.files

    if (!localProductimages) {
        throw new ApiError(404, "Product Images Not Found!");
    }

    const uploadedImages = [];

    for (const file of localProductimages) {
        const result = await uploadOnCloudinary(file.path);

        if (!result || !result.secure_url) {
            throw new ApiError(500, `Failed to upload image: ${file.originalname}`);
        }

        uploadedImages.push({
            url: result.secure_url,
            public_id: result.public_id
        });
    }

    if (uploadedImages.length === 0) {
        throw new ApiError(500, "Failed to upload any product images!");
    }

    const product = await Product.create({
        name,
        description,
        category,
        price,
        countInStock,
        images: uploadedImages,
        sizes
    });

    if (!product) {
        throw new ApiError(500, "Something Went Wront To Create Product!");
    }

    res.status(200)
        .json(
            new ApiResponse(
                200,
                product,
                "Product Created Successfully!"
            )
        )

});

const updateProduct = asyncHandler(async function (req, res) {
    const { productId } = req.params;

    if (!productId) {
        throw new ApiError(400, "Product Id Not Found!");
    }

    const { name, description, brand, category, price, countInStock, deleteImage, sizes } = req.body;

    const productData = {};
    if (name) productData.name = name;
    if (description) productData.description = description;
    if (brand) productData.brand = brand;
    if (category) productData.category = category;
    if (price) productData.price = price;
    if (countInStock) productData.countInStock = countInStock;
    if (sizes) productData.sizes = sizes;

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product Not Found!");
    }

    if (deleteImage) {
        const imagesPublicIds = Array.isArray(deleteImage) ? deleteImage : [deleteImage];

        for (const publicId of imagesPublicIds) {
            await cloudinary.uploader.destroy(publicId, { resource_type: "image" });

            product.images = product.images.filter((image) => image.public_id !== publicId);
        }
    }

    const localProductImages = req?.files || [];

    if (localProductImages.length > 0) {

        const availableSlots = 5 - product.images.length;

        if (availableSlots <= 0) {
            throw new ApiError(400, "This product already has 5 images. Delete some before uploading new ones.");
        }

        const imagesToUpload = localProductImages.slice(0, availableSlots);

        const newImages = [];
        for (const image of imagesToUpload) {
            const result = await uploadOnCloudinary(image.path);

            newImages.push({
                url: result.secure_url,
                public_id: result.public_id,
            });
        }

        product.images = [...product.images, ...newImages];
    }

    Object.assign(product, productData);

    const updatedProduct = await product.save();

    res.status(200).json(
        new ApiResponse(200, updatedProduct, "Product Data Updated Successfully!")
    );
});

const deleteProduct = asyncHandler(async function (req, res) {
    const { productId } = req.params;

    if (!productId) {
        throw new ApiError(400, "Product Id Not Found!");
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (deletedProduct) {
        const images = deletedProduct.images;

        for (const image of images) {
            const result = await cloudinary.uploader.destroy(image.public_id, { resource_type: "image" });
        }

    }

    res.status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Product And Product Data Deleted Successfully"
            )
        )

});

const addReview = asyncHandler(async function (req, res) {

    const { rating, comment } = req.body;
    const userId = req.user?._id;
    const username = req.user?.firstname;
    const { productId } = req.params;

    if (!rating || !comment) {
        throw new ApiError(400, "All Credentials Required!");
    }

    if (!userId) {
        throw new ApiError(401, "Unauthorized Request!");
    }

    if (!username) {
        throw new ApiError(401, "Unauthorized Request!");
    }

    if (!productId) {
        throw new ApiError(400, "Product Id Is Not Found!");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product Not Found!")
    }

    const userAlreadyReviewed = product.reviews.find((r) => r.user.toString() === userId.toString());

    if (userAlreadyReviewed) {
        throw new ApiError(400, "You have already reviewed this product");
    }

    const review = {
        user: userId,
        username,
        rating: Number(rating),
        comment
    }

    product.reviews.push(review);
    await product.save({ validateBeforeSave: true });

    const totalRating = product.reviews.reduce((acc, r) => acc += r.rating, 0);
    product.totalRating = totalRating / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200)
        .json(
            new ApiResponse(
                200,
                product,
                "Review added successfully"
            )
        );

});

export {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    addReview
}