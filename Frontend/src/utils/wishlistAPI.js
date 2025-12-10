import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "import.meta.env.BACKEND_URL/api"

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