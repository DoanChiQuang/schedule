import { createContext } from 'react'

export const GlobalContext = createContext({})

const GlobalProvider = ({ children }) => {
    return <GlobalContext.Provider value={{}}>{children}</GlobalContext.Provider>
}

export default GlobalProvider
