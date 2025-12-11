import e from "express";
import {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    getMyProfile,
    updateUserProfile,
    changePassword
} from "../controller/userController.js";
import verifyUser from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import signupSchema from "../middleware/signupSchema.js";
import signinSchema from "../middleware/signinSchema.js";

const routes = e.Router();

routes.post("/register", validate(signupSchema), registerUser);
routes.post("/login", validate(signinSchema), loginUser);
routes.post("/logout", verifyUser, logoutUser);
routes.post("/refresh-accesstoken", verifyUser, refreshAccessToken);
routes.get("/my-profile", verifyUser, getMyProfile)
routes.patch("/update-profile", verifyUser, updateUserProfile);
routes.patch("/change-password", verifyUser, changePassword);

export const userRoutes = routes