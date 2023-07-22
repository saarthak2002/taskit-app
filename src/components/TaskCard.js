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
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import DeleteTaskModal from "./DeleteTaskModal";
import EditTaskModal from "./EditTaskModal";
import Chip from '@mui/material/Chip';
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';

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

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '2rem'
};

const TaskCard = (props) => {
    const { task, refresh, setLoading } = props;
    const [expanded, setExpanded] = React.useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
    const handleOpenDeleteModal = () => setOpenDeleteModal(true);
    const handleCloseDeleteModal = () => setOpenDeleteModal(false);

    const [openEditModal, setOpenEditModal] = React.useState(false);
    const handleOpenEditModal = () => setOpenEditModal(true);
    const handleCloseEditModal = () => setOpenEditModal(false);

    const [cardLoading, setCardLoading] = React.useState(false);

    const markAsComplete = () => {
        setCardLoading(true);
        axios
            .post(process.env.REACT_APP_API_URI + 'task/' + task.id + '/complete')
            .then((response) => {
                console.log(response.data.message);
                refresh();
                setCardLoading(false);
            })
            .catch((error) => {
                console.log('error:' + error);
                alert('error:' + error);
                setCardLoading(false);
            })
    }

    const markAsIncomplete = () => {
        setCardLoading(true);
        axios
            .post(process.env.REACT_APP_API_URI + 'task/' + task.id + '/pending')
            .then((response) => {
                console.log(response.data.message);
                refresh();
                setCardLoading(false);
            })
            .catch((error) => {
                console.log('error:' + error);
                alert('error:' + error);
                setCardLoading(false);
            })
    }

    function formatDate(isoDate) {
        const dateObject = new Date(isoDate);
        const year = dateObject.getFullYear();
        const month = String(dateObject.getMonth() + 1).padStart(2, '0');
        const day = String(dateObject.getDate()).padStart(2, '0');
        const hours = String(dateObject.getHours()).padStart(2, '0');
        const minutes = String(dateObject.getMinutes()).padStart(2, '0');
        const seconds = String(dateObject.getSeconds()).padStart(2, '0');
      
        return `${hours}:${minutes}:${seconds} on ${year}-${month}-${day} `;
    }

    return (
        <div>
            {/* Task Info Card */}
            { cardLoading ?
                
                    <Card sx={{ maxWidth: 350, minWidth: 300 }} >
                        <CardHeader
                            title={task.title}
                            subheader={task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                            subheaderTypographyProps={task.status === 'pending' ? {color:'error'} : {color:'rgb(69,123,59)'}}
                        />
                        <CardContent>
                            <div  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <CircularProgress size={'3rem'} />
                            </div>
                        </CardContent>
                    </Card>
               
            :
            
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
                    <CardContent>
                        <Chip
                            label={task.task_category_name}
                            variant="filled"
                            style={{color: 'white', backgroundColor: task.task_category_color}}
                        />
                    </CardContent>
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
                            { 
                                task.status === 'completed' &&
                                <Typography color="rgb(176,176,176)">
                                    Completed at { task.completed_at_time ? formatDate(task.completed_at_time) : '' }
                                </Typography>
                            }
                            <IconButton onClick={() => {handleOpenEditModal();} }>
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => {handleOpenDeleteModal();} }>
                                <DeleteIcon />
                            </IconButton>
                        </CardContent>
                    </Collapse>
                </Card>
                // <div></div>
            }       

            {/* Confirm Delete Task Modal */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openDeleteModal}
                onClose={handleCloseDeleteModal}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={openDeleteModal}>
                    <Box sx={style}>
                        <DeleteTaskModal task={task} handleClose={handleCloseDeleteModal} refresh={refresh} />
                    </Box>
                </Fade>
            </Modal>

            {/* Edit Task Modal */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openEditModal}
                onClose={handleCloseEditModal}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={openEditModal}>
                    <Box sx={style}>
                        <EditTaskModal task={task} handleClose={handleCloseEditModal} refresh={refresh} />
                    </Box>
                </Fade>
            </Modal>

        </div>
    );
};

export default TaskCard;