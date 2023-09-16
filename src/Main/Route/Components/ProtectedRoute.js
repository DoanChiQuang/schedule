import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DASH_PATH, SIGNIN_PATH } from '../path'
import useAuth from '../../../Presentation/Hooks/useAuth'

export default function ProtectedRoute({ children }) {
    const { isAuth } = useAuth()
    const navigation = useNavigate()

    useEffect(() => {
        if (!isAuth()) navigation(DASH_PATH + SIGNIN_PATH)
    }, [])

    return <>{children}</>
}
