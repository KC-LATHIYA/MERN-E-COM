import User from "../model/user.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../../../job-portel/Backend/utils/apierror.js";

const roleMiddleware = (...roles) => {

    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, "You do not have permission")
        }

        next();
    }

}

export default roleMiddleware