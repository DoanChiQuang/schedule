import { RouterProvider } from 'react-router-dom'
import router from './Route'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalProvider from './Context/GlobalProvider'
import { ThemeProvider } from '@mui/material'
import { useTheme } from '../Presentation/Components/Feature/Theme/useTheme'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

function App() {
    const theme = useTheme();
    return (
        <GlobalProvider>
            <ThemeProvider theme={theme}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <RouterProvider router={router} />
                    <CssBaseline /> 
                </LocalizationProvider>
            </ThemeProvider>           
        </GlobalProvider>
    )
}

export default App
