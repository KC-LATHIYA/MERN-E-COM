import e from "express";
import verifyUser from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
    getMyOrders,
    getOrderDetails,
    createOrder,
    getAllOrders,
    markedAsDeliver,
    markedAsPaid,
    verifyPayment,
    getOrderDetailsAdmin
} from "../controller/orderController.js";

const routes = e.Router();

routes.get("/orders/myorders", verifyUser, roleMiddleware("customer"), getMyOrders);
routes.post("/orders/create", verifyUser, roleMiddleware("customer"), createOrder);
routes.get("/orders/:orderId", verifyUser, roleMiddleware("customer"), getOrderDetails);
routes.post("/payment/verify", verifyUser, roleMiddleware("customer"), verifyPayment);

routes.get("/orders", verifyUser, roleMiddleware("admin"), getAllOrders);
routes.get("/admin/orders/:orderId", verifyUser, roleMiddleware("admin"), getOrderDetailsAdmin);
routes.patch("/orders/:orderId/pay", verifyUser, roleMiddleware("admin"), markedAsPaid);
routes.patch("/orders/:orderId/deliver", verifyUser, roleMiddleware("admin"), markedAsDeliver);

// routes.post("/payment/create-order", verifyUser, roleMiddleware("customer"), createPaymentOrder);

export const orderRoutes = routes;