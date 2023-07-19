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
        <div>
            {/* Task Info Card */}
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
                        <IconButton onClick={() => {handleOpenEditModal();} }>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => {handleOpenDeleteModal();} }>
                            <DeleteIcon />
                        </IconButton>
                    </CardContent>
                </Collapse>
            </Card>

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