import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import signinAction from "./actions/signinAction";

type TAuth = {
    loading: boolean;
    userInfo: {};
    userToken: string;
    error: string | null;
    success: boolean;
};

const initialState: TAuth = {
    loading: false,
    userInfo: {},
    userToken: "",
    error: "",
    success: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.userInfo = {};
            state.userToken = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signinAction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signinAction.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload.data;
                state.userToken = action.payload.token;
            })
            .addCase(
                signinAction.rejected,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            );
    },
});

export default authSlice.reducer;
