import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { RootState } from '@/store';
import authenticatedAction from '@/store/auth/actions/authenticated';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
                <div className="m-4">{children}</div>
            </main>
        </SidebarProvider>
    );
};

export default MainLayout;
