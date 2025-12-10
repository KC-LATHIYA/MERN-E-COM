import e from "express";
import verifyUser from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
    getWishlist,
    addToWishlist,
    removeFromWishlist
} from "../controller/wishlistController.js";

const routes = e.Router();

routes.get("/wishlist", verifyUser, roleMiddleware("customer"), getWishlist);
routes.post("/wishlist/:productId", verifyUser, roleMiddleware("customer"), addToWishlist);
routes.delete("/wishlist/:productId", verifyUser, roleMiddleware("customer"), removeFromWishlist);

export const wishlistRoutes = routes;