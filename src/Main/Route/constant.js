import AuthenticatedRoute from './Components/AuthenticatedRoute'
import ProtectedRoute from './Components/ProtectedRoute'
import * as path from './path'
import { ErrorPage, SignInPage } from '../../Presentation/Pages'
import { Navigate, Outlet } from 'react-router-dom'
import Calendar from '../../Presentation/Pages/Manage/Calendar'
import Customer from '../../Presentation/Pages/Manage/Customer'
import Yard from '../../Presentation/Pages/Manage/Yard'
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
            },
            {
                path: '',
                element: <Navigate to={path.SIGNIN_PATH} replace />
            },
            {
                path: '*',
                element: <ErrorPage />
            }
        ]
    },
    {
        path: path.DASH_PATH + path.MANAGE_PATH + path.DASH_PATH,
        element: (
            <ProtectedRoute>
                <Outlet />
            </ProtectedRoute>
        ),
        children: [
            {
                path: path.CALENDER_PATH,
                element: <Calendar />
            },
            {
                path: path.CUSTOMER_PATH,
                element: <Customer />
            },
            {
                path: path.YARD_PATH,
                element: <Yard />
            },
            {
                path: '',
                element: <Navigate to={path.CALENDER_PATH} replace />
            },
            {
                path: '*',
                element: <ErrorPage />
            }
        ]
    }
]

export default Routes
