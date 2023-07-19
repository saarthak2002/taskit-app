import React from "react";

import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ProjectCard = (props) => {
    const {percentage} = props;
    return (
        <div>
            <Card sx={{ maxWidth: 250 }}>
                <CardActionArea>
                    <CardContent>
                        <CircularProgressbar value={percentage} text={`${percentage}%`} />
                        <Typography gutterBottom variant="h5" component="div">
                            Project 1
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Lizards are a widespread group of squamate reptiles, with over 6,000
                            species, ranging across all continents except Antarctica
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
    );
}
export default ProjectCard;