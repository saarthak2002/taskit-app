import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from '../firebase-config';
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import ProjectCard from "./ProjectCard";

const Collaborate = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        setLoading(true);
        auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                axios
                    .get(process.env.REACT_APP_API_URI + 'collabs/projects/' + user.uid)
                    .then((response) => {
                        console.log(response.data);
                        setProjects(response.data);
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
                    <div>
                        {
                            projects.length === 0 ?
                                <div style={{paddingTop:'5%'}}>
                                    <Grid container justifyContent="space-between" alignItems="center">
                                        <Grid item>
                                            <h1>Your collaborations</h1>
                                        </Grid>
                                        <Grid item>
                                            <Link to="/projects">
                                                <Button variant="contained" size="large">
                                                    View projects
                                                </Button>
                                            </Link>
                                        </Grid>
                                    </Grid>
                                    <h3 style={{textAlign: 'center'}}>You have not been invited to collaborate on any projects yet</h3>
                                    <h5 style={{textAlign: 'center'}}>Add collaborators from the details page of a project</h5>
                                </div>
                            :
                                <div style={{paddingTop:'5%'}}>
                                    <Grid container justifyContent="space-between" alignItems="center">
                                        <Grid item>
                                            <h1>Your collaborations</h1>
                                        </Grid>
                                        <Grid item>
                                            <Link to="/projects">
                                                <Button variant="contained" size="large">
                                                    Your projects
                                                </Button>
                                            </Link>
                                        </Grid>
                                    </Grid>
                                    
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
                                </div>
                        }
                    </div>
                    
            }
        </div>
    );
};

export default Collaborate;