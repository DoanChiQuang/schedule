import axios from 'axios'
const API_URL = 'http://localhost:5000'

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
        const originalRequest = error.config
        if (error.response.status === 401 && !originalRequest._retry) {
            if (error.response.data.message === 'Unauthorized') {
                // REQUEST A NEW ACCESS TOKEN
                const response = await axios.get(`${API_URL}/auth/refresh`)
                // STORE ACCESS TOKEN
                if (response.status === 200) {
                    localStorage.setItem('access_token', response.data.accessToken)
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`
                    return axiosInstance(originalRequest)
                }
            }
        }
        // NOT FOUND RESPONSE        
        if(error?.response) {
            return Promise.reject({message: error.response?.data?.message})
        }

        return Promise.reject(error)
    }
)

export default axiosInstance
