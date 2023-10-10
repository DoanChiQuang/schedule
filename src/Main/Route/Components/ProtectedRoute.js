import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DASH_PATH, ERROR_PATH, SIGNIN_PATH } from '../path'
import useAuth from '../../../Presentation/Hooks/useAuth'

export default function ProtectedRoute({ children, role, path }) {
    const { isAuth } = useAuth()
    const navigation = useNavigate()
    
    const checkRole = () => {
        const user = localStorage.getItem('user')
        const roleStorage = JSON.parse(user).role;
        if(roleStorage != role) {
            navigation(path + ERROR_PATH)
        }
    }

    useEffect(() => {
        if (!isAuth()) navigation(DASH_PATH + SIGNIN_PATH)
        else checkRole()
    }, [])

    return <>{children}</>
}
