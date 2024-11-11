import { Outlet } from 'react-router-dom';
import MainLayout from '@/layouts/main';
import DashboardPage from '@/modules/main/pages/dashboard';
import CalendarPage from '@/modules/main/pages/calendar';

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
                element: <CalendarPage />,
            },
        ],
    },
];
