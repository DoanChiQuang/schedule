import axiosInstance from "../Utils/axiosIntance";

export const getAll = (params) => {
    return axiosInstance.post('/api/booking-calendar/get-all', params);
}

export const create = (params) => {
    return axiosInstance.post('/api/booking-calendar/create', params);
}

export const remove = (params) => {
    return axiosInstance.post('/api/booking-calendar/delete', params);
}

export const exportData = (params) => {
    return axiosInstance.post('/api/booking-calendar/export', params);
}