import React from "react";
import { useState, useEffect } from "react";
import { auth } from '../firebase-config';
import { onAuthStateChanged } from "firebase/auth";
import { Link } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import ProjectCard from "./ProjectCard";
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import AreaChart from "./AreaChart";
import axios from "axios";
import { Typography } from "@mui/material";

const Dashboard = () => {

    const [user, setUser] = useState({});
    const [userInfo, setUserInfo] = useState({firstname:'', lastname:'', username:''});
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState(false);
    const [basicStats, setBasicStats] = useState({}); 
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        setLoading(true);
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(user.uid);
                setUser(user);

                const apiRequests = [
                    axios.get(process.env.REACT_APP_API_URI + 'projects/' + user.uid),
                    axios.get(process.env.REACT_APP_API_URI + 'users/' + user.uid),
                    axios.get(process.env.REACT_APP_API_URI + 'stats/basic/' + user.uid)
                ];

                Promise
                    .all(apiRequests)
                    .then((responses) => {
                        const projects = responses[0].data;
                        const userInfo = responses[1].data;
                        const basicStats = responses[2].data;
                        console.log(projects);
                        console.log(userInfo);
                        console.log(basicStats);
                        setProjects(projects);
                        setUserInfo(userInfo);
                        setBasicStats(basicStats);
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

                    <div style={{paddingTop:'5%'}}>
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

                        {userInfo && <h2 style={{color:"rgb(176,176,176)"}}>Hello, {userInfo?.firstname + ' ' + userInfo?.lastname}</h2>}
                        <Typography variant="h6" component="h2">Your Stats</Typography>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" justifyContent="center" style={{padding:'1%'}}>
                            <div style={{width:192}}>
                                <CircularProgressbarWithChildren 
                                    value={ basicStats.total_tasks > 0 ? (basicStats?.completed_tasks/basicStats?.total_tasks)*100 : 0}
                                    text={basicStats.total_tasks > 0 ? ((basicStats.completed_tasks/basicStats.total_tasks)*100).toFixed(2) + '%': '0%'}
                                    background
                                    backgroundPadding={4}
                                    styles={buildStyles({
                                        backgroundColor: "rgb(240,141,139)",
                                        trailColor: "transparent",
                                        textColor: "#fff",
                                        pathColor: "#fff",
                                    })}
                                >
                                    <div style={{paddingTop:'35%', color:'#f3ecec'}}>
                                        <h6 style={{margin:0}}>{basicStats.completed_tasks} of {basicStats.total_tasks} {basicStats.total_tasks === 1 ? 'task' : 'tasks'}</h6>
                                        <h6 style={{margin:0, padding:0, textAlign:'center'}}>{basicStats.total_projects} {basicStats.total_projects === 1 ? 'project' : 'projects'}</h6>
                                    </div>
                                    
                                </CircularProgressbarWithChildren>
                            </div>
                            <div style={{width:450}}>
                                <AreaChart user={user} />
                            </div>
                        </Stack>

                        <Typography variant="h6" component="h2">Recent Projects</Typography>
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