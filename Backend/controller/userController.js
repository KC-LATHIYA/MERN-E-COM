import User from "../model/user.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../../../job-portel/Backend/utils/apierror.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateRefreshAndAccessToken = async (userId) => {

    const user = await User.findById(userId);

    if (!userId) {
        throw new ApiError("User Not Found");
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken
    user.save({ validateBeforeSave: false });

    return {
        accessToken,
        refreshToken
    }

}

const registerUser = asyncHandler(async function (req, res) {

    const { firstname, lastname, email, mobileno, password } = req.body

    if (!firstname || !lastname || !email || !mobileno || !password) {
        throw new ApiError(400, "All Credentials Required!");
    }

    const existedEmail = await User.findOne({ email: email });
    const existedmobile = await User.findOne({ mobileno: mobileno });

    if (existedEmail) {
        throw new ApiError(409, "Email Already Registered!");
    }

    if (existedmobile) {
        throw new ApiError(409, "Mobile Number Already Registered!");
    }

    const user = await User.create({
        firstname,
        lastname,
        email,
        mobileno,
        password,
        role: "customer"
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something Went Wrong To Create User!")
    }

    res.status(200)
        .json(
            new ApiResponse(
                200,
                createdUser,
                "User Register Successfully!"
            )
        )

});

const loginUser = asyncHandler(async function (req, res) {

    const { email, mobileno, password } = req.body;

    if (!email && !mobileno) {
        throw new ApiError(404, "Email Or Mobile Number Required!");
    }

    if (!password) {
        throw new ApiError(404, "Password Required!");
    }

    const user = await User.findOne({
        $or: [
            { email },
            { mobileno }
        ]
    });

    if (!user) {
        throw new ApiError(404, "User Not Found With This Email Or Mobile Number!")
    }

    const isPasswordTrue = await user.comparePassword(password);

    if (!isPasswordTrue) {
        throw new ApiError(400, "Invalid Password!");
    }

    const { accessToken, refreshToken } = await generateRefreshAndAccessToken(user._id);

    const option = {
        httpOnly: true,
        secure: true
    }

    const loginUser = await User.findById(user._id).select("-password -refreshToken");

    res.status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ApiResponse(
                200,
                { accessToken, refreshToken, loginUser },
                "Login Successfully!"
            )
        )

});

const refreshAccessToken = asyncHandler(async function (req, res) {

    const inComingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!inComingRefreshToken) {
        throw new ApiError(401, "Unauthorized Token!");
    }

    const decodedToken = jwt.verify(inComingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id);

    if (!user) {
        throw new ApiError(401, "Unauthorized Token!");
    }

    if (inComingRefreshToken !== user.refreshToken) {
        throw new ApiError(401, "Refresh Token Expired Or Used!")
    }

    const { accessToken, refreshToken } = await generateRefreshAndAccessToken(user._id);

    const option = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ApiResponse(
                200,
                { accessToken, refreshToken },
                "AccessToken And RefreshToken Changed Successfully"
            )
        )

});

const logoutUser = asyncHandler(async function (req, res) {

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "User Not Authorized For Logout");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User Not Found");
    }

    user.refreshToken = undefined;
    user.save({ validateBeforeSave: false });

    const option = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .json(
            new ApiResponse(
                200,
                {},
                "User Logout Successfully!"
            )
        )

});

const getMyProfile = asyncHandler(async function (req, res) {

    const userId = req.user?._id

    if (!userId) {
        throw new ApiError(401, "Unauthorized Request!");
    }

    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User Not Found!");
    }

    res.status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "User And User Data Fetched Successfully"
            )
        )

});

const updateUserProfile = asyncHandler(async function (req, res) {

    const { firstname, lastname, mobileno, address } = req.body;

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized Request!");
    }

    const userdata = {}

    if (firstname) userdata.firstname = firstname;
    if (lastname) userdata.lastname = lastname;
    if (mobileno) userdata.mobileno = mobileno;
    if (address) userdata.address = address;

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            $set: userdata
        },
        {
            new: true
        }
    ).select("-password -refreshToken");

    if (!updatedUser) {
        throw new ApiError(500, "Something Went Wrong To Update User Profile")
    }

    res.status(200)
        .json(
            new ApiResponse(
                200,
                updatedUser,
                "User Profile Updated Successfully!"
            )
        )

});

const changePassword = asyncHandler(async function (req, res) {

    const { oldpassword, newpassword } = req.body;
    const userId = req.user?._id;

    if (!oldpassword || !newpassword) {
        throw new ApiError(400, "All Credentials Required!");
    }

    if (!userId) {
        throw new ApiError(401, "Unauthorized Request!");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User Not Found!")
    }

    const oldPasswordTrue = await user.comparePassword(oldpassword);

    if (!oldPasswordTrue) {
        throw new ApiError(401, "Invalid Old Password!")
    }

    user.password = newpassword;
    user.save({ validateBeforeSave: false });

    res.status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "User Current Password Have Been Changed!"
            )
        )

});

export {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    getMyProfile,
    updateUserProfile,
    changePassword
}