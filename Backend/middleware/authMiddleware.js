import User from "../model/user.js"
import jwt from "jsonwebtoken"
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"

const verifyUser = asyncHandler(async function (req, res, next) {

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Access Token Not Found");
        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (error) {
            throw new ApiError(401, "Invalid AccessToken")
        }

        const user = await User.findById(decodedToken._id);

        if (!user) {
            throw new ApiError(401, "Access Token Expire Or Invalid");
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name == "TokenExpiredError") {
            throw new ApiError(401, "Unauthorized Token");
        }
        throw new ApiError(401, "Unauthorized Request")
    }

});

export default verifyUser