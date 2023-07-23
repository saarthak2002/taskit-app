import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProjectsTable from "./ProjectsTable";
import { auth } from '../firebase-config';
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

const Profile = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});
    const [userInfo, setUserInfo] = useState({firstname:'', lastname:'', username:''});

    useEffect(() => {
        setLoading(true);
        auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                axios
                    .get(process.env.REACT_APP_API_URI + 'users/' + user.uid)
                    .then((response) => {
                        setUserInfo(response.data);
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
                                <h1>{userInfo.username}'s Profile</h1>
                            </Grid>
                            <Grid item>
                                <Link to="/">
                                    <Button variant="contained" size="large">
                                        Edit Profile
                                    </Button>
                                </Link>
                            </Grid>
                        </Grid>
                    </div>
            }
        </div>
    );
};

export default Profile;