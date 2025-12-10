import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "import.meta.env.BACKEND_URL/api"

export const orderAPI = createApi({
    reducerPath: "orderAPi",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        credentials: "include"
    }),
    tagTypes: ["Order"],
    endpoints: (builder) => ({

        GetAllOrderDetaild: builder.query({
            query: () => "/orders/myorders",
            providesTags: ["Order"]
        }),

        GetOrderDetailsById: builder.query({
            query: (id) => `/orders/${id}`,
            providesTags: ["Order"]
        }),

        GetOrderDetailsByIdAdmin: builder.query({
            query: (id) => `/admin/orders/${id}`,
            providesTags: ["Order"]
        }),

        CreateOrder: builder.mutation({
            query: (data) => ({
                url: "/orders/create",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Order"]
        }),

        VerifyPayment: builder.mutation({
            query: (data) => ({
                url: "/payment/verify",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Order"]
        }),

        GetAllOrder: builder.query({
            query: () => "/orders",
            providesTags: ["Order"]
        }),

        MarkedAsPaid: builder.mutation({
            query: (id) => ({
                url: `/orders/${id}/pay`,
                method: "PATCH"
            }),
            invalidatesTags: ["Order"]
        }),

        MarkedAsDeliver: builder.mutation({
            query: (id) => ({
                url: `/orders/${id}/deliver`,
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