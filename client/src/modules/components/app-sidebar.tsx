import {
    LayoutDashboard,
    Calendar,
    Users,
    LockKeyhole,
    LandPlot,
    CalendarClock,
    LogOut,
} from 'lucide-react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/modules/components/ui/sidebar';
import { Typography } from '@/modules/components/ui/typography';
import { Link, useMatch } from 'react-router-dom';

const mainMenu = [
    {
        title: 'Bảng điều khiển',
        url: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Lịch',
        url: '/calendar',
        icon: Calendar,
    },
];

const manageMenu = [
    {
        title: 'Tài khoản',
        url: '/account',
        icon: LockKeyhole,
    },
    {
        title: 'Khách hàng',
        url: '/customer',
        icon: Users,
    },
    {
        title: 'Thời gian',
        url: '/time',
        icon: CalendarClock,
    },
    {
        title: 'Sân',
        url: '/yard',
        icon: LandPlot,
    },
];

export function AppSidebar() {
    const isActive = (path: string) => {
        const match = useMatch(path);        
        return Boolean(match);
    }
    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center space-x-2 p-2">
                    <div className="rounded-sm bg-red-500 p-1 text-white">
                        <Calendar />
                    </div>
                    <Typography variant="h3" content="Schedule" />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainMenu.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                                        <Link to={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Quản lý</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {manageMenu.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                                        <Link to={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <a href={'/logout'}>
                                <LogOut />
                                <span>Đăng xuất</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
