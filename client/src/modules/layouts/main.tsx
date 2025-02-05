import { AppSidebar } from '@/modules/components/app-sidebar';
import {
    SidebarProvider,
    SidebarTrigger,
} from '@/modules/components/ui/sidebar';
import { useIsMobile } from '@/modules/hooks/use-mobile';
import { RootState } from '@/stores';
import authenticatedAction from '@/stores/auth/actions/authenticated';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '../components/ui/typography';

type Props = {
    children?: ReactNode;
};

const MainLayout = ({ children }: Props) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { isLogged } = useAppSelector((state: RootState) => state.auth);
    const isMobile = useIsMobile();

    useEffect(() => {
        dispatch(authenticatedAction());
    }, []);

    useEffect(() => {
        if (!isLogged) {
            navigate('/signin');
        }
    }, [isLogged]);

    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="container">
                {isMobile && <SidebarTrigger />}
                <div className="m-4 space-y-2">
                    {/* Breadcrumb */}

                    {/* Title */}
                    <Typography variant="h2" content="Bảng điều khiển" />
                    {children}
                </div>
            </main>
        </SidebarProvider>
    );
};

export default MainLayout;
