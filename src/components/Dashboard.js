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

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        setLoading(true);
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(user.uid);
                setUser(user);

                const apiRequests = [
                    axios.get(process.env.REACT_APP_API_URI + 'projects/' + user.uid),
                    axios.get(process.env.REACT_APP_API_URI + 'users/' + user.uid)
                ];

                Promise
                    .all(apiRequests)
                    .then((responses) => {
                        const projects = responses[0].data;
                        const userInfo = responses[1].data;
                        console.log(projects);
                        console.log(userInfo);
                        setProjects(projects);
                        setUserInfo(userInfo);
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.log('error:' + error);
                        setLoading(false);
                        setLoginError(true);
                    })
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
                        {projects.length > 0 ?

                            <Grid container spacing={2}>
                                {
                                    projects.map(
                                        (project) => (
                                            <Grid item key={project.id}>
                                                <ProjectCard project={project} />
                                            </Grid>
                                        )
                                    )
                                }
                            </Grid>
                        :
                            <h3>No projects yet</h3>
                    }
                        
                    </div>
            }
        </div>
    );
}

export default Dashboard;