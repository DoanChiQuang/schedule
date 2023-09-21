import axiosInstance from "../Utils/axiosIntance";

export const getAll = (params) => {
    return axiosInstance.post('/api/time/get-all', params);
}

export const create = (params) => {
    return axiosInstance.post('/api/time/create', params);
}