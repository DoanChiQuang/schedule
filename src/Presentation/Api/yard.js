import axiosInstance from "../Utils/axiosIntance";

export const getAll = (params) => {
    return axiosInstance.get('/api/yard/get-all', params);
}

export const create = (params) => {
    return axiosInstance.post('/api/yard/create', params);
}

export const remove = (params) => {
    return axiosInstance.get('/api/yard/remove', params);
}