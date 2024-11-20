import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axios';
import { TSigninData, TSigninDTO } from '@/stores/auth/types/auth';

const signinAction = createAsyncThunk(
    'auth/signin',
    async (payload: TSigninDTO, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.post<TSigninData>(
                'api/auth/signin',
                payload,
            );
            return result;
        } catch (error: any) {
            return rejectWithValue(error.msg);
        }
    },
);

export default signinAction;
