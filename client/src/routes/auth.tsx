import { Outlet } from 'react-router-dom';
import AuthLayout from '@/modules/layouts/auth';
import SigninPage from '@/modules/pages/sign-in';
import ForgotPasswordPage from '@/modules/pages/forgot-password';
import ResetPasswordPage from '@/modules/pages/reset-password';

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
