import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error?.response) {
            return Promise.reject({ msg: error.response.data.msg });
        }
        return Promise.reject({
            msg: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
        });
    },
);

export default axiosInstance;
