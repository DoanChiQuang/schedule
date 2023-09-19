import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CALENDER_PATH, DASH_PATH, MANAGE_PATH } from '../path'
import useAuth from '../../../Presentation/Hooks/useAuth'

export default function AuthenticatedRoute({ children }) {
    const { isAuth } = useAuth()
    const navigation = useNavigate()

    useEffect(() => {
        if (isAuth()) navigation(DASH_PATH + MANAGE_PATH + DASH_PATH + CALENDER_PATH)
    }, [])

    return <>{children}</>
}
