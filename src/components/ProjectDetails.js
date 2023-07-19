import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";

const ProjectDetails = () => {

    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [project, setProject] = useState({});

    useEffect(() => {
        setLoading(true);
        axios
            .get(process.env.REACT_APP_API_URI + 'projects/id/' + id)
            .then((response) => {
                setProject(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log('error:' + error);
                setLoading(false);
            })
    }, [id]);

    return (
        <div>
            {
                loading ?
                    <div  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                        <CircularProgress size={'3rem'} />
                    </div>
                :
                    <div>
                        <h1>Project Details</h1>
                        <h1>{project.title}</h1>
                        <h2>{id}</h2>
                    </div>
            }
        </div>
    )
};

export default ProjectDetails;