import { createTheme } from "@mui/material"

export const useTheme = () => {
    const theme = createTheme({
        palette: {
            primary: {
              light: '#6edec5',
              main: '#404156',
              dark: 'gray',
              contrastText: '#fff',
            },
            secondary: {
              light: '#ff7961',
              main: '#f44336',
              dark: '#ba000d',
              contrastText: '#000',
            },
            custom: {
              white: 'white',
              light: '#6edec5',
              main: '#0e0f2a',
            }
          },
    });

    return theme
}