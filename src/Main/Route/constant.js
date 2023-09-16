import AuthenticatedRoute from './Components/AuthenticatedRoute'
import ProtectedRoute from './Components/ProtectedRoute'
import * as path from './path'
import { ErrorPage, SignInPage } from '../../Presentation/Pages'
import { Outlet } from 'react-router-dom'
const Routes = [
    {
        path: path.DASH_PATH,
        element: (
            <AuthenticatedRoute>
                <Outlet />
            </AuthenticatedRoute>
        ),
        children: [
            {
                path: path.SIGNIN_PATH,
                element: <SignInPage />
            }
        ]
    },
    {
        path: path.DASH_PATH,
        element: (
            <ProtectedRoute>
                <Outlet />
            </ProtectedRoute>
        ),
        children: [
            {
                path: path.HOME_PATH,
                element: <ErrorPage />
            },
        ]
    },
    {
        path: '*',
        element: <ErrorPage />
    }
]

export default Routes
