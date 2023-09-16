import axiosInstance from "../Utils/axiosIntance";

export const signin = (params) => {
    return axiosInstance.post('/api/auth/signin', params);
}