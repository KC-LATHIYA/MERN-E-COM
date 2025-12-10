import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LoginUser, LogoutUser } from "../store/authSlice.js"

const BASE_URL = "import.meta.env.BACKEND_URL/auth"

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include"
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 401) {
        const refreshResult = await baseQuery("/refresh-accesstoken", api, extraOptions);

        if (refreshResult?.data?.accessToken) {
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(LogoutUser());
        }

    }
    return result;
}

export const authAPI = createApi({
    reducerPath: "authAPI",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["User"],
    endpoints: (builder) => ({

        Registeruser: builder.mutation({
            query: (data) => ({
                url: "/register",
                method: "POST",
                body: data
            })
        }),

        Loginuser: builder.mutation({
            query: (data) => ({
                url: "/login",
                method: "POST",
                body: data
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(LoginUser(result.data.data.loginUser));
                } catch (error) {
                    console.error(error);
                }
            },
            invalidatesTags: ["User"]
        }),

        Logoutuser: builder.mutation({
            query: () => ({
                url: "/logout",
                method: "POST"
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    await queryFulfilled,
                        dispatch(LogoutUser());
                } catch (error) {
                    console.error(error);
                }
            },
            invalidatesTags: ["User"]
        }),

        Myprofile: builder.query({
            query: () => "/my-profile",
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(LoginUser(result.data.data));
                } catch (error) {
                    console.error(error);
                }
            },
            providesTags: ["User"]
        }),

        Updateprofile: builder.mutation({
            query: (data) => ({
                url: "/update-profile",
                method: "PATCH",
                body: data
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(LoginUser(result.data.data));
                } catch (error) {
                    console.error(error);
                }
            },
            invalidatesTags: ["User"]
        }),

        Updatepassword: builder.mutation({
            query: (data) => ({
                url: "/change-password",
                method: "PATCH",
                body: data
            }),
            invalidatesTags: ["User"]
        }),

    })
})

export const {
    useRegisteruserMutation,
    useLoginuserMutation,
    useLogoutuserMutation,
    useMyprofileQuery,
    useUpdateprofileMutation,
    useUpdatepasswordMutation
} = authAPI