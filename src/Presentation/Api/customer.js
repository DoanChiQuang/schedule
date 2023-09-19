import axiosInstance from "../Utils/axiosIntance";

export const getAll = (params) => {
    return axiosInstance.post('/api/customer/get-all', params);
}

export const create = (params) => {
    return axiosInstance.post('/api/customer/create', params);
}

export const update = (params) => {
    return axiosInstance.post('/api/customer/update', params);
}

export const remove = (params) => {
    return axiosInstance.post('/api/customer/remove', params);
}