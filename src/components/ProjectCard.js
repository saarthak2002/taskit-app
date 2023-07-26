import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import axios from "axios";
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ProjectCard = (props) => {
    const navigate = useNavigate();
    const {project} = props;
    const [percentage, setPercentage] = useState(0);
    const [projectOwner, setProjectOwner] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        var totalTasks = project.tasks.length;
        var completedTasks = 0;
        project.tasks.forEach(task => {
            if(task.status === 'completed') {
                completedTasks++;
            }
        })
        setPercentage((completedTasks/totalTasks)*100);
        axios
            .get(process.env.REACT_APP_API_URI + 'users/' + project.userUID)
            .then((response) => {
                console.log(response.data);
                setProjectOwner(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log('error:' + error);
                alert('error:' + error);
                setLoading(false);
            })
    }, [project.tasks, project.userUID]);

    return (
        <Card sx={{ maxWidth: 250 }} style={{height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
            <CardActionArea onClick={() => {console.log(project.id); navigate('/project-details/' + project.id);} }>
                <CardContent>
                    <CircularProgressbarWithChildren value={percentage ? percentage : 0} text={`${percentage ? percentage.toFixed(2) : '0'}%`}>
                        <h5 style={{paddingTop:'25%', color:'#BC7F54'}}>{project.tasks.length} {project.tasks.length === 1 ? 'task' :'tasks'}</h5>
                    </CircularProgressbarWithChildren>
                    <Typography gutterBottom variant="h5" component="div" style={{paddingTop: '1%'}}>
                        {project.title}
                    </Typography>
                    <Typography color="rgb(176,176,176)">
                        by {loading ? 'Loading...' : projectOwner.firstname + ' ' + projectOwner.lastname}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {project.description}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom color="rgba(0, 0, 0, 0.54)">
                        {project.date_added.slice(5,16)}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
export default ProjectCard;