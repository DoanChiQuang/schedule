import { Outlet } from 'react-router-dom';
import MainLayout from '@/modules/layouts/main';
import DashboardPage from '@/modules/pages/dashboard';
import SchedulePage from '@/modules/pages/schedule';

export const mainRouter = [
    {
        path: '/',
        element: (
            <MainLayout>
                <Outlet />
            </MainLayout>
        ),
        children: [
            {
                path: 'dashboard',
                element: <DashboardPage />,
            },
            {
                path: 'calendar',
                element: <SchedulePage />,
            },
        ],
    },
];
