import {useState} from 'react';

const useApi = (apiFunc) => {
    const [data, setData]       = useState(null)
    const [error, setError]     = useState(false)
    const [success, setSuccess] = useState(false)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const request = async (...args) => {
        try {
            setLoading(true)
            setError(false)
            const response = await apiFunc(...args)
            setLoading(false);
            setSuccess(true);

            setData(response?.data?.data)
        } catch (error) {
            setLoading(false);
            setSuccess(false);
            setError(true)
            setMessage(error?.message)
        }
    }

    return { data, error, message, loading, success, request }
}

export default useApi;
