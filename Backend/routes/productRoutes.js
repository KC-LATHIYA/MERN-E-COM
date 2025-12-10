import e from "express";
import verifyUser from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/multerMiddleware.js";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    addReview
} from "../controller/productController.js";

const routes = e.Router();

routes.get("/get-allproducts", getAllProducts);
routes.get("/product/:productId", getProductById);
routes.post("/product/create", verifyUser, roleMiddleware("admin"), upload.array("images", 5), createProduct);
routes.patch("/product/:productId", verifyUser, roleMiddleware("admin"), upload.array("images", 5), updateProduct);
routes.delete("/product/:productId", verifyUser, roleMiddleware("admin"), deleteProduct);
routes.post("/product/review/:productId", verifyUser, roleMiddleware("customer"), addReview);

export const productRoutes = routes;