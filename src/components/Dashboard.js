import React from "react";
import { useState, useEffect } from "react";
import { auth } from '../firebase-config';
import { onAuthStateChanged } from "firebase/auth";
import { Link } from 'react-router-dom';

import ProjectCard from "./ProjectCard";

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import axios from "axios";

const Dashboard = () => {

    const [user, setUser] = useState({});
    const [userInfo, setUserInfo] = useState({firstname:'', lastname:'', username:''});
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState(false);

    useEffect(() => {
        setLoading(true);
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(user.uid);
                setUser(user);
                
                axios
                    .get(process.env.REACT_APP_API_URI + 'users/' + user.uid)
                    .then((response) => {
                        console.log(response.data);
                        setUserInfo(response.data);
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.log('error:' + error);
                        setLoading(false);
                        setLoginError(true);
                    });
            } else {
                setUser(null);
                setUserInfo({firstname:'', lastname:'', username:''});
                setLoading(false);
            }
          });
    }, []);

    return (
        <div>
            {
                loading ?
                    <div  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                        <CircularProgress size={'3rem'} />
                    </div>
                :
                    loginError ?
                        <h1>Failed</h1>
                    :

                    <div>
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <h1>Dashboard</h1>
                            </Grid>
                            <Grid item>
                                <Link to="/create-project">
                                    <Button variant="contained" size="large">
                                        + Create Project
                                    </Button>
                                </Link>
                            </Grid>
                        </Grid>
                        {userInfo && <h2>Hello, {userInfo?.firstname + ' ' + userInfo?.lastname}</h2>}
                        {user ? user.email && <h5>{user.email} {user.uid}</h5> : <h5>No user logged in</h5>}
                        <ProjectCard percentage={45}/>
                    </div>
            }
        </div>
    );
}

export default Dashboard;