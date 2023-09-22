import axiosInstance from "../Utils/axiosIntance";

export const getAll = (params) => {
    return axiosInstance.post('/api/user/get-all', params);
}

export const create = (params) => {
    return axiosInstance.post('/api/user/create', params);
}

export const update = (params) => {
    return axiosInstance.post('/api/user/update', params);
}

export const remove = (params) => {
    return axiosInstance.post('/api/user/delete', params);
}

export const enable = (params) => {
    return axiosInstance.post('/api/user/enable', params);
}

export const setPermission = (params) => {
    return axiosInstance.post('/api/user/set-permission', params);
}