import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import YardIcon from '@mui/icons-material/Yard';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PeopleIcon from '@mui/icons-material/People';
import LockResetIcon from '@mui/icons-material/LockReset';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import * as path from '../../../Main/Route/path';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
    width: '100vh'
}));


const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open', })(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const MenuCalendar = [
    {
        name: "Lịch",
        route: path.CALENDER_PATH,
        iconElement: <CalendarMonthIcon />
    },
    {
        name: "Sân",
        route: path.YARD_PATH,
        iconElement: <YardIcon />
    },
    // {
    //     name: "Thời gian",
    //     route: path.TIME_PATH,
    //     iconElement: <AccessTimeIcon />
    // }
];

const MenuUser = [        
    // {
    //     name: "Nhân viên",
    //     route: path.USER_PATH,
    //     iconElement: <ManageAccountsIcon />
    // },
    {
        name: "Khách hàng",
        route: path.CUSTOMER_PATH,
        iconElement: <PeopleIcon />
    }        
];

const MenuSetting = [
    // {
    //     name: "Đổi mật khẩu",
    //     route: path.FORGOTPASSWORD_PATH,
    //     iconElement: <LockResetIcon />
    // },
    {
        name: "Đăng xuất",
        route: path.LOGOUT_PATH,
        iconElement: <ExitToAppIcon />
    }
];

const Layout = (props) => {
    const { window, children, route } = props;
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const container = window !== undefined ? () => window().document.body : undefined;
    const navigation = useNavigate();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleNavigateRoute = (route) => {
        navigation(path.DASH_PATH + path.MANAGE_PATH + path.DASH_PATH + route)
    }

    const drawer = (
        <Box>
            <DrawerHeader sx={{backgroundColor: theme.palette.primary.main}}>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon sx={{color: 'white'}} /> : <ChevronRightIcon sx={{color: 'white'}} />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
                {MenuCalendar.map((item, index) => (
                    <ListItem key={item.route} disablePadding>
                        <ListItemButton selected={item.route === route ? true : false} onClick={() => handleNavigateRoute(item.route)}>
                            <ListItemIcon>
                                {item.iconElement}
                            </ListItemIcon>
                            <ListItemText primary={item.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {MenuUser.map((item, index) => (
                    <ListItem key={item.route} disablePadding>
                        <ListItemButton selected={item.route === route ? true : false} onClick={() => handleNavigateRoute(item.route)}>
                            <ListItemIcon>
                                {item.iconElement}
                            </ListItemIcon>
                            <ListItemText primary={item.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {MenuSetting.map((item, index) => (
                    <ListItem key={item.route} disablePadding>
                        <ListItemButton selected={item.route === route ? true : false} onClick={() => handleNavigateRoute(item.route)}>
                            <ListItemIcon>
                                {item.iconElement}
                            </ListItemIcon>
                            <ListItemText primary={item.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box 
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%'
                        }}>
                        <Typography variant="h6" noWrap component="div">HỆ THỐNG QUẢN LÝ ĐẶT SÂN</Typography>
                        <Typography variant="h6">{JSON.parse(localStorage.getItem("user"))?.name}</Typography>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >                
                {drawer}
            </Drawer>
            <Main open={open}>
                <DrawerHeader />
                {children}
            </Main>            
        </Box>
    );
}

export default Layout;