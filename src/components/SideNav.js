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
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import logo from '../logo.png'
import { auth } from '../firebase-config';
import { signOut } from "firebase/auth";
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LogoutModal from './LogoutModal';
import axios from 'axios';

const drawerWidth = 240;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '2rem'
};

function SideNav(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;
    const { componentToDisplay } = props;
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [userName, setUserName] = useState('');

    const [openLogoutModal, setOpenLogoutModal] = React.useState(false);
    const handleOpenLogoutModal = () => setOpenLogoutModal(true);
    const handleCloseLogoutModal = () => setOpenLogoutModal(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log('logged out');
            navigate('/');
        }
        catch (error) {
            console.log(error.message);
            alert(error.message);
        }
    };

    const goToDashboard = () => {
        navigate('/');
    }

    const goToProjectTable = () => {
        navigate('/projects');
    }

    const goToProfile = () => {
        navigate('/profile');
    }

    const drawer = (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Toolbar>
                <img src={logo} alt="logo" height='45' sx={{ mr: 1 }} style={{margin:'auto'}}/>
            </Toolbar>
            <Divider />
            <div style={{ flexGrow: 1 }}>
                <List>
                    <ListItem key={'dashboard'} disablePadding>
                        <ListItemButton onClick={goToDashboard} selected={currentPath === '/'}>
                            <ListItemIcon>
                                <SpeedIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Dashboard'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key={'projects'} disablePadding>
                        <ListItemButton onClick={goToProjectTable} selected={currentPath === '/projects'}>
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
                    <ListItem key={'profile'} disablePadding>
                        <ListItemButton onClick={goToProfile} selected={currentPath === '/profile'}>
                            <ListItemIcon>
                                <AccountCircleIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Profile"} secondary={ userName.length > 0 ? userName : 'Loading...' }/>
                        </ListItemButton>
                    </ListItem>
                </List>
            </div>
            <div>
                <ListItem key={'logout'} disablePadding sx={{marginBottom: '5%'}} divider >
                    <ListItemButton onClick={handleOpenLogoutModal}>
                        <ListItemIcon>
                            <PowerSettingsNewIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Logout'} />
                    </ListItemButton>
                </ListItem>
            </div>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                axios
                    .get(process.env.REACT_APP_API_URI + 'users/' + user.uid)
                    .then((response) => {
                        setUserName(response.data.username);
                    })
                    .catch((error) => {
                        console.log('error:' + error);
                    })
            } 
            else {
                navigate('/');
            }
        });
    }, [navigate]);

    return (
        <React.Fragment>
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

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openLogoutModal}
                onClose={handleCloseLogoutModal}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={openLogoutModal}>
                    <Box sx={style}>
                        <LogoutModal handleClose={handleCloseLogoutModal} signOut={handleLogout} />
                    </Box>
                </Fade>
            </Modal>

        </React.Fragment>
    );
}

export default SideNav;