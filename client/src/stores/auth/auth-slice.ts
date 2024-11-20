import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TAuth } from '@/stores/auth/types/auth';
import signinAction from '@/stores/auth/actions/signin';
import forgotPasswordAction from '@/stores/auth/actions/forgot-password';
import resetPasswordAction from '@/stores/auth/actions/reset-password';
import authenticatedAction from '@/stores/auth/actions/authenticated';

const initialState: TAuth = {
    loading: false,
    userInfo: {},
    error: '',
    success: false,
    isLogged: false,
    isSent: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.userInfo = {};
            state.isLogged = false;
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
                state.userInfo = action.payload.data.user;
                state.success = true;
                state.isLogged = true;
            })
            .addCase(
                signinAction.rejected,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.error = action.payload;
                    state.success = false;
                },
            )
            .addCase(forgotPasswordAction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPasswordAction.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.isSent = true;
            })
            .addCase(
                forgotPasswordAction.rejected,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.error = action.payload;
                    state.success = false;
                    state.isSent = false;
                },
            )
            .addCase(resetPasswordAction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPasswordAction.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(
                resetPasswordAction.rejected,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.error = action.payload;
                    state.success = false;
                },
            )
            .addCase(authenticatedAction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(authenticatedAction.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.isLogged = true;
            })
            .addCase(
                authenticatedAction.rejected,
                (state, action: PayloadAction<any>) => {
                    state.loading = false;
                    state.error = action.payload;
                    state.success = false;
                    state.isLogged = false;
                    state.userInfo = {};
                },
            );
    },
});

export default authSlice.reducer;
