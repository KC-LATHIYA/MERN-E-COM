import e from "express";
import verifyUser from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
    getUserCart,
    addItemInCart,
    updateQuantity,
    removeItemInCart
} from "../controller/cartController.js";

const routes = e.Router();

routes.get("/cart", verifyUser, roleMiddleware("customer"), getUserCart);
routes.post("/cart/:productId", verifyUser, roleMiddleware("customer"), addItemInCart);
routes.patch("/cart/:productId", verifyUser, roleMiddleware("customer"), updateQuantity);
routes.delete("/cart/:productId", verifyUser, roleMiddleware("customer"), removeItemInCart);

export const cartRoutes = routes;