import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";
import { authAPI } from "../utils/authAPI.js";
import { productAPI } from "../utils/productAPI.js";
import { cartAPI } from "../utils/cartAPI.js";
import { orderAPI } from "../utils/orderAPI.js";
import { wishlistAPI } from "../utils/wishlistAPI.js";

const store = configureStore({
    reducer: {
        authSlice: authSlice,
        [authAPI.reducerPath]: authAPI.reducer,
        [productAPI.reducerPath]: productAPI.reducer,
        [cartAPI.reducerPath]: cartAPI.reducer,
        [orderAPI.reducerPath]: orderAPI.reducer,
        [wishlistAPI.reducerPath]: wishlistAPI.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(authAPI.middleware, productAPI.middleware, cartAPI.middleware, orderAPI.middleware, wishlistAPI.middleware)
})

export default store