import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_BACKEND_URL

export const orderAPI = createApi({
    reducerPath: "orderAPi",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        credentials: "include"
    }),
    tagTypes: ["Order"],
    endpoints: (builder) => ({

        GetAllOrderDetaild: builder.query({
            query: () => "/api/orders/myorders",
            providesTags: ["Order"]
        }),

        GetOrderDetailsById: builder.query({
            query: (id) => `/api/orders/${id}`,
            providesTags: ["Order"]
        }),

        GetOrderDetailsByIdAdmin: builder.query({
            query: (id) => `/api/admin/orders/${id}`,
            providesTags: ["Order"]
        }),

        CreateOrder: builder.mutation({
            query: (data) => ({
                url: "/api/orders/create",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Order"]
        }),

        VerifyPayment: builder.mutation({
            query: (data) => ({
                url: "/api/payment/verify",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Order"]
        }),

        GetAllOrder: builder.query({
            query: () => "/api/orders",
            providesTags: ["Order"]
        }),

        MarkedAsPaid: builder.mutation({
            query: (id) => ({
                url: `/api/orders/${id}/pay`,
                method: "PATCH"
            }),
            invalidatesTags: ["Order"]
        }),

        MarkedAsDeliver: builder.mutation({
            query: (id) => ({
                url: `/api/orders/${id}/deliver`,
                method: "PATCH"
            }),
            invalidatesTags: ["Order"]
        })

    })
});

export const {
    useGetAllOrderDetaildQuery,
    useGetOrderDetailsByIdQuery,
    useCreateOrderMutation,
    useVerifyPaymentMutation,
    useGetAllOrderQuery,
    useMarkedAsPaidMutation,
    useMarkedAsDeliverMutation,
    useGetOrderDetailsByIdAdminQuery
} = orderAPI