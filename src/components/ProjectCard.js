import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ProjectCard = (props) => {
    const navigate = useNavigate();
    const {project} = props;
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        var totalTasks = project.tasks.length;
        var completedTasks = 0;
        project.tasks.forEach(task => {
            if(task.status === 'completed') {
                completedTasks++;
            }
        })
        setPercentage((completedTasks/totalTasks)*100);
    }, [project.tasks]);

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