import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DASH_PATH, HOME_PATH } from '../path'
import useAuth from '../../../Presentation/Hooks/useAuth'

export default function AuthenticatedRoute({ children }) {
    const { isAuth } = useAuth()
    const navigation = useNavigate()

    useEffect(() => {
        if (isAuth()) navigation(DASH_PATH + HOME_PATH)
    }, [])

    return <>{children}</>
}
