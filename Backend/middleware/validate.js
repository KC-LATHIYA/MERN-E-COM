import { ApiError } from "../utils/apiError.js"

export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        throw new ApiError(422, "Validation failed");
    }
}