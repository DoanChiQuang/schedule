import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axios';
import {
    TForgotPasswordDTO,
    TForgotPasswordData,
} from '@/stores/auth/types/auth';

const forgotPasswordAction = createAsyncThunk(
    'auth/forgotPassword',
    async (payload: TForgotPasswordDTO, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.post<TForgotPasswordData>(
                'api/auth/forgot-password',
                payload,
            );
            return result;
        } catch (error: any) {
            return rejectWithValue(error.msg);
        }
    },
);

export default forgotPasswordAction;
