const useAuth = () => {
    const isAuth = () => {
        const token = localStorage.getItem('access_token')
        if (token) return true
        return false
    }

    return { isAuth }
}

export default useAuth
