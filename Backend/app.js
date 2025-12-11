import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import { userRoutes } from "./routes/userRoutes.js";
import { productRoutes } from "./routes/productRoutes.js";
import { cartRoutes } from "./routes/cartRoutes.js";
import { orderRoutes } from "./routes/orderRoutes.js";
import { wishlistRoutes } from "./routes/wishlistRoutes.js";
import { errorHandler } from "./middleware/apiError.js";
const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
// app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
// app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(express.static("public"));

app.use("/api/auth/", userRoutes);
app.use("/api/", productRoutes);
app.use("/api/", cartRoutes);
app.use("/api/", orderRoutes);
app.use("/api/", wishlistRoutes);

app.use(errorHandler);

export default app