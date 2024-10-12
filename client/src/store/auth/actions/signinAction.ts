import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axios";

type TSigninDTO = {
    email: string;
    password: string;
};

type TSigninData = {
    data: {};
    token: string;
};

const signinAction = createAsyncThunk(
    "auth/signin",
    async (payload: TSigninDTO) => {
        try {
            const { data } = await axiosInstance.post<TSigninData>(
                "api/auth/singin",
                payload
            );
            return data;
        } catch (error: any) {
            return error;
        }
    }
);

export default signinAction;
