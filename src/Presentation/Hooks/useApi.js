import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { DASH_PATH, SIGNIN_PATH } from '../../Main/Route/path';

const useApi = (apiFunc) => {
    const [data, setData]       = useState(null)
    const [error, setError]     = useState(false)
    const [success, setSuccess] = useState(false)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const navigation = useNavigate();

    const request = async (...args) => {
        try {
            setLoading(true)
            setError(false)
            const response = await apiFunc(...args)
            setLoading(false);
            setSuccess(true);

            setData(response?.data)
        } catch (error) {
            if(error?.status === 401) {
                navigation(DASH_PATH + SIGNIN_PATH)
            }
            setLoading(false);
            setSuccess(false);
            setError(true)
            setMessage(error?.message)
        }
    }

    return { data, error, message, loading, success, setData, request }
}

export default useApi;
