import { RouterProvider } from 'react-router-dom'
import router from './Route'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalProvider from './Context/GlobalProvider'
import { ThemeProvider } from '@mui/material'
import { useTheme } from '../Presentation/Components/Feature/Theme/useTheme'

function App() {
    const theme = useTheme();
    return (
        <GlobalProvider>
            <ThemeProvider theme={theme}>
                <RouterProvider router={router} />
                <CssBaseline /> 
            </ThemeProvider>           
        </GlobalProvider>
    )
}

export default App
