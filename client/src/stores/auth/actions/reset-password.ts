import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axios';
import {
    TResetPasswordData,
    TResetPasswordDTO,
} from '@/stores/auth/types/auth';

const resetPasswordAction = createAsyncThunk(
    'auth/resetPassword',
    async (payload: TResetPasswordDTO, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.post<TResetPasswordData>(
                'api/auth/reset-password',
                payload,
            );
            return result;
        } catch (error: any) {
            return rejectWithValue(error.msg);
        }
    },
);

export default resetPasswordAction;
