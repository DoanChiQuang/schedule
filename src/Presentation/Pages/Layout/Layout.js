import { React, useState } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import YardIcon from '@mui/icons-material/Yard';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PeopleIcon from '@mui/icons-material/People';
import LockResetIcon from '@mui/icons-material/LockReset';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from "react-router-dom";
import * as path from '../../../Main/Route/path';

const drawerWidth = 240;

const Layout = (props) => {
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
        {
            name: "Thời gian",
            route: path.TIME_PATH,
            iconElement: <AccessTimeIcon />
        }
    ];

    const MenuUser = [        
        {
            name: "Nhân viên",
            route: path.USER_PATH,
            iconElement: <ManageAccountsIcon />
        },
        {
            name: "Khách hàng",
            route: path.CUSTOMER_PATH,
            iconElement: <PeopleIcon />
        }        
    ];

    const MenuSetting = [
        {
            name: "Đổi mật khẩu",
            route: path.FORGOTPASSWORD_PATH,
            iconElement: <LockResetIcon />
        },
        {
            name: "Đăng xuất",
            route: path.LOGOUT_PATH,
            iconElement: <ExitToAppIcon />
        }
    ];
    const { window, children, route } = props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const navigation = useNavigate();

    const handleDrawerToggle = () => {        
        setMobileOpen(!mobileOpen);
    };
    
    const handleNavigateRoute = (route) => {
        navigation(path.DASH_PATH + path.MANAGE_PATH + path.DASH_PATH + route)
    }

    const drawer = (
        <Box>
            <Toolbar sx={{backgroundColor: theme.palette.primary.main}} />
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

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: "flex" }}>
            <AppBar
                position="fixed"
                sx={{width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` }}}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%'
                        }}>
                        <Typography variant="h6" noWrap component="div">HỆ THỐNG QUẢN LÝ ĐẶT SÂN</Typography>
                        <Box sx={{
                            marginRight: '30px'
                            }}>
                            <Typography variant="h6">{JSON.parse(localStorage.getItem("user"))?.name}</Typography>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >            
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{keepMounted: true}}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        }
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", sm: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
}

Layout.propTypes = {
    window: PropTypes.func,
};

export default Layout;
