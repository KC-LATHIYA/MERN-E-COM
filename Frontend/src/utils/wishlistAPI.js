import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_BACKEND_URL

export const wishlistAPI = createApi({
    reducerPath: "wishlistAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        credentials: "include"
    }),
    tagTypes: ["Wishlist"],
    endpoints: (builder) => ({

        getUserWishlist: builder.query({
            query: () => "/api/wishlist",
            providesTags: ["Wishlist"]
        }),

        addItemToWishlist: builder.mutation({
            query: ({ id, data }) => ({
                url: `/api/wishlist/${id}`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Wishlist"]
        }),

        removeItemFromWishlist: builder.mutation({
            query: (productId) => ({
                url: `/api/wishlist/${productId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Wishlist"]
        })

    })

});

export const {
    useGetUserWishlistQuery,
    useAddItemToWishlistMutation,
    useRemoveItemFromWishlistMutation
} = wishlistAPI