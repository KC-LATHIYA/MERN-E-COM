import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://localhost:3000/api"

export const wishlistAPI = createApi({
    reducerPath: "wishlistAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        credentials: "include"
    }),
    tagTypes: ["Wishlist"],
    endpoints: (builder) => ({

        getUserWishlist: builder.query({
            query: () => "/wishlist",
            providesTags: ["Wishlist"]
        }),

        addItemToWishlist: builder.mutation({
            query: ({ id, data }) => ({
                url: `/wishlist/${id}`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Wishlist"]
        }),

        removeItemFromWishlist: builder.mutation({
            query: (productId) => ({
                url: `/wishlist/${productId}`,
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