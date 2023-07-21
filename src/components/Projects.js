import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProjectsTable from "./ProjectsTable";
import { auth } from '../firebase-config';
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';


const Projects = () => {

    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});
    const [userInfo, setUserInfo] = useState({firstname:'', lastname:'', username:''});
    const [loginError, setLoginError] = useState(false);

    useEffect(() => {
        setLoading(true);
        auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                const apiRequests = [
                    axios.get(process.env.REACT_APP_API_URI + 'projects/' + user.uid),
                    axios.get(process.env.REACT_APP_API_URI + 'users/' + user.uid),
                ];

                Promise
                    .all(apiRequests)
                    .then((responses) => {
                        const projects = responses[0].data;
                        const userInfo = responses[1].data;
                        setProjects(projects);
                        setUserInfo(userInfo);
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.log('error:' + error);
                        alert('error:' + error);
                        setLoading(false);
                    })

            } else {
                setUser({});
                setLoginError(true);
                navigate('/login')
            }
        });

    }, [navigate]);

    console.log(projects);
    return (
        <div>
            {
                loading ?
                    <div  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                        <CircularProgress size={'3rem'} />
                    </div>
                :
                    <div style={{paddingTop:'5%'}}>
                        <h1>{userInfo.username}'s Projects</h1>
                        <ProjectsTable projects={projects} />
                    </div>
            }
        </div>
    );
};

export default Projects;