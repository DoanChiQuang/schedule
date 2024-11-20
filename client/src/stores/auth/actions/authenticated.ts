import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/axios';
import { TAuthenticatedData } from '@/stores/auth/types/auth';

const authenticatedAction = createAsyncThunk(
    'auth/authenticated',
    async (payload, { rejectWithValue }) => {
        try {
            const result = await axiosInstance.post<TAuthenticatedData>(
                'api/auth/authenticated',
            );
            return result;
        } catch (error: any) {
            return rejectWithValue(error.msg);
        }
    },
);

export default authenticatedAction;
