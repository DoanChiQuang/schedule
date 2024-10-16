import { Outlet } from 'react-router-dom';
import AuthLayout from '@/layouts/auth';
import SigninPage from '@/modules/auth/pages/signin';

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
                element: <div>Forgot password</div>,
            },
        ],
    },
];
