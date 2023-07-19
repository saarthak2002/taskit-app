import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SpeedIcon from '@mui/icons-material/Speed';
import MenuIcon from '@mui/icons-material/Menu';
import TableRowsIcon from '@mui/icons-material/TableRows';
import PeopleIcon from '@mui/icons-material/People';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { auth } from '../firebase-config';
import { signOut } from "firebase/auth";

import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

function SideNav(props) {
    const navigate = useNavigate();
    const { componentToDisplay } = props;
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        }
        catch (error) {
            console.log(error.message);
        }
    };

    const goToDashboard = () => {
        navigate('/');
    }

    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            <List>
                <ListItem key={'dashboard'} disablePadding>
                    <ListItemButton onClick={goToDashboard}>
                        <ListItemIcon>
                            <SpeedIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Dashboard'} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={'projects'} disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <TableRowsIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Projects'} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={'collaborate'} disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Collaborate'} />
                    </ListItemButton>
                </ListItem>
                <ListItem key={'logout'} disablePadding>
                    <ListItemButton onClick={handleLogout}>
                        <ListItemIcon>
                            <PowerSettingsNewIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Logout'} />
                    </ListItemButton>
                </ListItem>
            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Task It App
                    </Typography>
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
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                {componentToDisplay}
            </Box>
        </Box>
    );
}

export default SideNav;