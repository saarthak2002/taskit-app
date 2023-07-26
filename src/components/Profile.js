import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from '../firebase-config';
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SaveIcon from '@mui/icons-material/Save';
import ProjectList from "./ProjectList";
import CollabList from "./CollabList";

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

const Profile = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [user, setUser] = useState({});
    const [userInfo, setUserInfo] = useState({firstname:'', lastname:'', username:''});

    const [openEditModal, setOpenEditModal] = useState(false);
    const handleOpenEditModal = () => setOpenEditModal(true);
    const handleCloseEditModal = () => setOpenEditModal(false);

    const [checkUserNameLoading, setCheckUserNameLoading] = useState(false);
    const [newUserName, setNewUserName] = useState('');
    const [userNameError, setUserNameError] = useState(false); 
    const [userNameTextFieldErrorMessage, setUserNameTextFieldErrorMessage] = useState('');

    const userNameTyped = (event) => {
        setUserNameTextFieldErrorMessage('');
        setUserNameError(false);
        if(event.target.value !== '' && !event.target.value.includes('/') && !event.target.value.includes('\\')) {
            setNewUserName(event.target.value);
            setCheckUserNameLoading(true);
            axios
                .get(process.env.REACT_APP_API_URI + 'users/exist/' + event.target.value)
                .then((response) => {
                    console.log(response.data);
                    if(response.data.exists) {
                        setUserNameError(true);
                        setUserNameTextFieldErrorMessage('Username already exists');
                        setCheckUserNameLoading(false);
                    }
                    else {
                        setUserNameError(false);
                        setUserNameTextFieldErrorMessage('');
                        setCheckUserNameLoading(false);
                    }
                })
                .catch((error) => {
                    console.log('error:' + error);
                    alert('error:' + error);
                    setUserNameError(true);
                    setUserNameTextFieldErrorMessage('Error checking username');
                    setCheckUserNameLoading(false);
                });
        }
        else if(event.target.value.includes('/') || event.target.value.includes('\\')) {
            setUserNameError(true);
            setUserNameTextFieldErrorMessage('Username cannot contain / or \\');
        }
        else if(event.target.value === '') {
            setUserNameError(true);
            setUserNameTextFieldErrorMessage('Username cannot be empty');
        }
    }

    const updateUserName = () => {
        setModalLoading(true);
        if(newUserName !== '' && !newUserName.includes('/') && !newUserName.includes('\\')) {
            axios
                .post(process.env.REACT_APP_API_URI + 'users/change/' + user.uid, {username: newUserName})
                .then((response) => {
                    console.log(response.data);
                    setModalLoading(false);
                    handleCloseEditModal();
                    setUserInfo({...userInfo, username: newUserName});
                })
                .catch((error) => {
                    console.log('error:' + error);
                    alert('error:' + error);
                    setModalLoading(false);
                });
        }
        else {
            setModalLoading(false);
            alert('Username cannot be empty or contain / or \\');
        }
    }

    useEffect(() => {
        setLoading(true);
        auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                axios
                    .get(process.env.REACT_APP_API_URI + 'users/' + user.uid)
                    .then((response) => {
                        setUserInfo(response.data);
                        setNewUserName(response.data.username);
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.log('error:' + error);
                        alert('error:' + error);
                        setLoading(false);
                    });
            }
            else {
                setUser({});
                navigate('/login');
            }
        });
    }, [navigate]);

    return (
        <div>
            {
                loading ?
                    <div  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                        <CircularProgress size={'3rem'} />
                    </div>
                :
                    <div style={{paddingTop:'5%'}}>
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <h1 style={{marginBottom: 0}}>{userInfo.username}'s Profile</h1>
                                <Typography color="rgb(176,176,176)">
                                    {user.email}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Link to="/">
                                    <Button variant="contained" size="large">
                                        Dashboard
                                    </Button>
                                </Link>
                            </Grid>
                        </Grid>
                        <Stack alignItems={'center'} justifyContent={'center'}>
                            <div>
                                <Avatar sx={{ width:'10rem', height:'10rem', fontSize:60 }}>{userInfo.firstname.charAt(0)+userInfo.lastname.charAt(0)}</Avatar>
                            </div>
                            <div>
                                <Typography variant="h2" gutterBottom sx={{marginBottom: 0}}>
                                    {userInfo.firstname} {userInfo.lastname}
                                </Typography>
                            </div>
                            <Stack direction={'row'} alignItems={'center'} justifyContent={'center'}>
                                <Typography variant="h6" sx={{color:'rgb(176,176,176)', marginRight:'1%'}}>
                                        {userInfo.username}
                                </Typography>
                                <Tooltip title='Edit username'>
                                    <IconButton onClick={handleOpenEditModal}>
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Stack>
                        <Grid container justifyContent="space-around" alignItems="stretch" sx={{marginTop:'2%'}}>
                            <Grid item>
                                <div>
                                    <Typography variant="h3">
                                        Projects
                                    </Typography>
                                    <ProjectList userUid={user.uid}/>
                                </div>
                            </Grid>
                            <Grid item>
                                <div>
                                    <Typography variant="h3">
                                        Collaborators
                                    </Typography>
                                    <CollabList userUid={user.uid}/> 
                                </div>
                            </Grid>
                        </Grid>   
                    </div>
            }

            {/* Edit username modal */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openEditModal}
                onClose={handleCloseEditModal}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
                sx={{overflow:'scroll'}}
            >
                <Fade in={openEditModal}>
                    <Box sx={style}>
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <Typography variant="h6" component="h2" style={{paddingBottom:'4%'}}>
                                    Edit username
                                </Typography>
                            </Grid>
                            <Grid item>
                                <IconButton onClick={handleCloseEditModal}>
                                    <CloseIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                        { modalLoading ?
                            <div  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                <CircularProgress size={'3rem'} />
                            </div>
                        :
                            <Grid container justifyContent="space-between" alignItems="center">
                                <Grid item xs={10}>
                                    <TextField
                                        label="Username"
                                        sx={{width:'100%'}}
                                        defaultValue={userInfo.username}
                                        onChange={(event) => {userNameTyped(event);}}
                                        InputProps={{
                                            endAdornment:
                                                checkUserNameLoading && <InputAdornment position="end"><CircularProgress size={'1rem'} /></InputAdornment>
                                        }}
                                        error={userNameError}
                                        helperText={userNameError ? userNameTextFieldErrorMessage : ''}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <Tooltip title="Save username">
                                        <IconButton onClick={() => {updateUserName();}} sx={{marginLeft: 2}} disabled={userNameError}>
                                            <SaveIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        }           
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
};

export default Profile;