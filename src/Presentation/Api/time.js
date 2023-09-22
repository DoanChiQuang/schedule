import axiosInstance from "../Utils/axiosIntance";

export const getAll = (params) => {
    return axiosInstance.post('/api/time/get-all', params);
}

export const getAllTimeDetail = (params) => {
    return axiosInstance.post('/api/time/get-all-time-detail', params);
}

export const create = (params) => {
    return axiosInstance.post('/api/time/create', params);
}

export const update = (params) => {
    return axiosInstance.post('/api/time/update', params);
}

export const remove = (params) => {
    return axiosInstance.post('/api/time/delete', params);
}