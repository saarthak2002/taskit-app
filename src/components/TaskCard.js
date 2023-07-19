import React from "react";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from "axios";

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
    }),
}));

const TaskCard = (props) => {
    const { task, refresh, setLoading } = props;
    const [expanded, setExpanded] = React.useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const markAsComplete = () => {
        setLoading(true);
        axios
            .post(process.env.REACT_APP_API_URI + 'task/' + task.id + '/complete')
            .then((response) => {
                console.log(response.data.message);
                refresh();
                setLoading(false);
            })
            .catch((error) => {
                console.log('error:' + error);
                alert('error:' + error);
                setLoading(false);
            })
    }

    const markAsIncomplete = () => {
        setLoading(true);
        axios
            .post(process.env.REACT_APP_API_URI + 'task/' + task.id + '/pending')
            .then((response) => {
                console.log(response.data.message);
                refresh();
                setLoading(false);
            })
            .catch((error) => {
                console.log('error:' + error);
                alert('error:' + error);
                setLoading(false);
            })
    }

    return (
        <Card sx={{ maxWidth: 350, minWidth: 300 }} >
            <CardHeader
                title={task.title}
                subheader={task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                subheaderTypographyProps={task.status === 'pending' ? {color:'error'} : {color:'rgb(69,123,59)'}}
                action={
                    task.status === 'pending' ?
                    <IconButton aria-label="mark as complete" size="large" color="success" onClick={ () => {markAsComplete();}}>
                        <CheckCircleIcon style={{width:40,height:40}} />
                    </IconButton>
                    :
                    <IconButton aria-label="mark as not complete" size="large" color="error" onClick={ () => {markAsIncomplete();} }>
                        <CancelIcon style={{width:40,height:40}} />
                    </IconButton>
                }
            />
            <CardActions disableSpacing>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph>{ task.description }</Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
};

export default TaskCard;