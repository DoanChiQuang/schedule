import { Outlet } from "react-router-dom";

export const authRouter = [
    {
        path: '/',
        element: <Outlet />,
        children: [
            {
                path: 'signin',
                element: <div>Sign in</div>
            },
            {
                path: 'signup',
                element: <div>Sign up</div>
            },
            {
                path: 'forgot-password',
                element: <div>Forgot password</div>
            }
        ],
    },
];
