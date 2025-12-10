import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.BACKEND_URL

export const cartAPI = createApi({
    reducerPath: "cartAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        credentials: "include"
    }),
    tagTypes: ["Cart"],
    endpoints: (builder) => ({

        GetUserCart: builder.query({
            query: () => "/api/cart",
            providesTags: ["Cart"]
        }),

        AddItemIncart: builder.mutation({
            query: ({ id, data }) => ({
                url: `/api/cart/${id}`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Cart"]
        }),

        UpdateQuantityOfItem: builder.mutation({
            query: ({ id, data }) => ({
                url: `/api/cart/${id}`,
                method: "PATCH",
                body: data
            }),
            invalidatesTags: ["Cart"]
        }),

        RemoveItemFromCart: builder.mutation({
            query: (id) => ({
                url: `/api/cart/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Cart"]
        }),

    })
});

export const {
    useGetUserCartQuery,
    useAddItemIncartMutation,
    useUpdateQuantityOfItemMutation,
    useRemoveItemFromCartMutation
} = cartAPI