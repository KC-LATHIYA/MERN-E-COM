import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "authSlice",
    initialState: {
        user: null,
        isAuthenticated: false
    },
    reducers: {
        LoginUser: (state, action) => {
            state.user = action.payload
            state.isAuthenticated = true
            console.log(state.user);
            console.log(state.isAuthenticated);
        },

        LogoutUser: (state, action) => {
            state.user = null
            state.isAuthenticated = false
            console.log(state.user);
            console.log(state.isAuthenticated);
        }
    }
});

export const { LoginUser, LogoutUser } = authSlice.actions
export default authSlice.reducer