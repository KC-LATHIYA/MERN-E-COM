import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "import.meta.env.BACKEND_URL/api"

export const productAPI = createApi({
    reducerPath: "productAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        credentials: "include"
    }),
    tagTypes: ["Product"],
    endpoints: (builder) => ({

        GetAllProduct: builder.query({
            query: ({ keyword, category, sort } = {}) =>
                `/get-allproducts?keyword=${encodeURIComponent(keyword || "")}&category=${encodeURIComponent(category || "")}&sort=${encodeURIComponent(sort || "")}`,
            providesTags: ["Product"]
        }),

        GetProductById: builder.query({
            query: (id) => `/product/${id}`,
            providesTags: ["Product"]
        }),

        CreateProduct: builder.mutation({
            query: (data) => ({
                url: "/product/create",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Product"]
        }),

        UpdateProduct: builder.mutation({
            query: ({ id, data }) => ({
                url: `/product/${id}`,
                method: "PATCH",
                body: data
            }),
            invalidatesTags: ["Product"]
        }),

        DeleteProduct: builder.mutation({
            query: (id) => ({
                url: `/product/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Product"]
        }),

        reviewProduct: builder.mutation({
            query: ({ id, data }) => ({
                url: `/product/review/${id}`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Product"]
        })

    })
})

export const {
    useGetAllProductQuery,
    useGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useReviewProductMutation
} = productAPI