import { Outlet } from 'react-router-dom';
import AuthLayout from '@/layouts/auth';
import SigninPage from '@/modules/auth/pages/signin';
import ForgotPasswordPage from '@/modules/auth/pages/forgot-password';
import ResetPasswordPage from '@/modules/auth/pages/reset-password';

export const authRouter = [
    {
        path: '/',
        element: (
            <AuthLayout>
                <Outlet />
            </AuthLayout>
        ),
        children: [
            {
                path: 'signin',
                element: <SigninPage />,
            },
            {
                path: 'forgot-password',
                element: <ForgotPasswordPage />,
            },
            {
                path: 'reset-password/:token',
                element: <ResetPasswordPage />,
            },
        ],
    },
];
