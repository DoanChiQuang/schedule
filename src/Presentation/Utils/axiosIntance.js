import axios from 'axios'
import { Navigate } from 'react-router-dom'
import { DASH_PATH, SIGNIN_PATH } from '../../Main/Route/path'
const API_URL = 'http://14.225.201.18:5000'

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' }
})

axiosInstance.interceptors.request.use(
    async (config) => {
        const access_token = localStorage.getItem('access_token')        
        if (access_token) {
            config.headers.Authorization = `Bearer ${access_token}`            
        }
        return config
    },

    (error) => {
        return Promise.reject(error)
    }
)

axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    
    async (error) => {
        console.log(error)
        if (error?.response?.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            return Promise.reject({status: 401, message: error.response?.data?.message})
        }
        // NOT FOUND RESPONSE
        if(error?.response) {
            return Promise.reject({status: 400, message: error.response?.data?.message})
        }

        return Promise.reject(error)
    }
)

export default axiosInstance
