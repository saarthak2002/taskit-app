import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import axios from "axios";
import TaskCard from "./TaskCard";
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import AddTaskModal from "./AddTaskModal";
import EditCategoriesModal from "./EditCategoriesModal";
import CollabModal from "./CollabModal";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleIcon from '@mui/icons-material/People';
import { Typography } from "@mui/material";
import DonutChart from './DonutChart';
import { auth } from '../firebase-config';

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

const ProjectDetails = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [project, setProject] = useState({tasks:[]});
    const [selectedChip, setSelectedChip] = useState("All");
    const [categoryChipFilter, setCategoryChipFilter] = useState("None");
    const [percentage, setPercentage] = useState(0);
    const [completedTasks, setCompletedTasks] = useState(0);
    const [categories, setCategories] = useState([{name:'', color:''}]);
    const [user, setUser] = useState({});
    const [projectOwner, setProjectOwner] = useState({});

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [openCatModal, setOpenCatModal] = useState(false);
    const handleOpenCatModal = () => setOpenCatModal(true);
    const handleCloseCatModal = () => setOpenCatModal(false);

    const [openCollabModal, setOpenCollabModal] = useState(false);
    const handleOpenCollabModal = () => setOpenCollabModal(true);
    const handleCloseCollabModal = () => setOpenCollabModal(false);

    const getTaskList = useCallback(() => {
        setLoading(true);
        axios
            .get(process.env.REACT_APP_API_URI + 'projects/id/' + id)
            .then((response) => {
                setProject(response.data);
                var totalTasks = response.data.tasks.length;
                var completedTasks = 0;
                response.data.tasks.forEach(task => {
                    if(task.status === 'completed') {
                        completedTasks++;
                    }
                })
                setPercentage((completedTasks/totalTasks)*100);
                setCompletedTasks(completedTasks);
                axios
                    .get(process.env.REACT_APP_API_URI + 'taskcategories/project/' + id)
                    .then((response) => {
                        console.log(response.data);
                        setCategories(response.data);
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.log('error:' + error);
                        alert('error:' + error);
                        setLoading(false);
                    })
            })
            .catch((error) => {
                console.log('error:' + error);
                alert('error:' + error);
                setLoading(false);
            })
    }, [id]);

    const handleChipClick = (chip) => {
        setSelectedChip(chip);
    }

    const handleCategoryChipClick = (category) => {
        console.log('filter by category: ' + category)
        setCategoryChipFilter(category);
    }

    useEffect(() => {
        setLoading(true);
        auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                axios
                    .get(process.env.REACT_APP_API_URI + 'projects/id/' + id)
                    .then((response_project) => {
                        if (response_project.data.userUID === user.uid) {
                            setProject(response_project.data);
                            getTaskList();
                            axios   
                                .get(process.env.REACT_APP_API_URI + '/users/' + response_project.data.userUID)
                                .then((response_userinfo) => {
                                    setProjectOwner(response_userinfo.data);
                                })
                                .catch((error) => {
                                    console.log('error:' + error);
                                    alert('error:' + error);
                                    setLoading(false);
                                })
                        }
                        else {
                            axios
                                .post(process.env.REACT_APP_API_URI + 'collabs/verify/' + id, {userUID: user.uid})
                                .then((response_collab) => {
                                    if(response_collab.data.is_collab) {
                                        setProject(response_project.data);
                                        getTaskList();
                                        axios   
                                            .get(process.env.REACT_APP_API_URI + '/users/' + response_project.data.userUID)
                                            .then((response_userinfo) => {
                                                console.log(response_userinfo.data);
                                                setProjectOwner(response_userinfo.data);
                                            })
                                            .catch((error) => {
                                                console.log('error:' + error);
                                                alert('error:' + error);
                                                setLoading(false);
                                            })
                                    }
                                    else {
                                        navigate('/unauthorized')
                                    }
                                })
                                .catch((error) => {
                                    console.log('error:' + error);
                                    alert('error:' + error);
                                    setLoading(false);
                                })
                        }
                    })
                    .catch((error) => {
                        console.log('error:' + error);
                        alert('error:' + error);
                        setLoading(false);
                    })
            } else {
                navigate('/login')
            }
        });
    }, [getTaskList, navigate, id]);

    return (
        <div>
            {
                loading ?
                    <div  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                        <CircularProgress size={'3rem'} />
                    </div>
                :
                    <div>
                        <h1 style={{paddingBottom:'1%'}}> </h1>
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <h1 style={{marginBottom: 0}}>{project.title}</h1>
                                <Typography color="rgb(176,176,176)">by {projectOwner.firstname} {projectOwner.lastname}</Typography>
                            </Grid>
                            <Grid item>
                                {
                                    project.userUID === user.uid &&
                                        <IconButton 
                                            aria-label="collab" 
                                            style={{borderRadius:5, marginRight:20}}
                                            sx={{
                                                border: "1px solid",
                                                borderColor: "rgb(117,117,117)"
                                            }}
                                            onClick={handleOpenCollabModal}
                                        >
                                            <PeopleIcon style={{marginRight:5}}/>
                                            <Typography>Collaborators</Typography>
                                        </IconButton>
                                }
                                <IconButton 
                                    aria-label="edit" 
                                    style={{borderRadius:5}}
                                    sx={{
                                        border: "1px solid",
                                        borderColor: "rgb(117,117,117)"
                                    }}
                                    onClick={handleOpenCatModal}
                                >
                                    <CategoryIcon style={{marginRight:5}}/>
                                    <Typography>Categories</Typography>
                                </IconButton>
                                <Button variant="contained" size="large" onClick={handleOpen} style={{marginLeft:20}}>
                                    + Add Task
                                </Button>
                            </Grid>
                        </Grid>
                        <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                            { project.userUID !== user.uid ? <Typography variant="caption" sx={{textAlign:'center'}} color={'green'}>You are a collaborator on this project</Typography> : null}
                        </div>
                        <Stack direction={{ xs: 'column', xl: 'row' }} spacing={1} alignItems="center" justifyContent="center" style={{padding:'1%'}}>
                            <div style={{width:'15%'}}>
                                <CircularProgressbarWithChildren value={percentage ? percentage : 0} text={`${percentage ? percentage.toFixed(2) : '0'}%`} />
                                <h5 style={{color:'#BC7F54', textAlign:'center'}}>{completedTasks} of {project.tasks.length} {project.tasks.length === 1 ? 'task' :'tasks'} completed</h5>
                            </div>
                            { project.tasks.length > 0 &&
                                <div style={{ marginBottom:'5%'}}>
                                    <DonutChart project={project} categories={categories}/>
                                </div>
                            }
                        </Stack>
                        
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" style={{padding:'1%', paddingBottom:0}}>
                            <Chip 
                                label="All" 
                                onClick={() => {handleChipClick("All")}} 
                                variant={selectedChip === "All" ? "filled" : "outlined"}
                                color="primary"
                            />
                            <Chip 
                                label="Pending"
                                onClick={() => {handleChipClick("Pending")}}
                                variant={selectedChip === "Pending" ? "filled" : "outlined"}
                                color="error"
                            />
                            <Chip
                                label="Completed"
                                onClick={() => {handleChipClick("Completed")}}
                                variant={selectedChip === "Completed" ? "filled" : "outlined"}
                                color="success"
                            />
                        </Stack>
                        
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" style={{padding:'1%'}}>
                            <Chip
                                label="None"
                                variant={categoryChipFilter === "None" ? "filled" : "outlined"}
                                style={categoryChipFilter === "None" ? {color: 'white', backgroundColor: '#bab5b5'} :{color: '#bab5b5', borderColor: '#bab5b5'}}
                                onClick={() => {handleCategoryChipClick("None")}}
                            />
                            {
                                categories.map(category => {
                                    return (
                                        <Chip
                                            key={category.id}
                                            label={category.name}
                                            variant={categoryChipFilter === category.name ? "filled" : "outlined"}
                                            style={categoryChipFilter === category.name ? {color: 'white', backgroundColor: category.color} :{color: category.color, borderColor: category.color}}
                                            onClick={() => {handleCategoryChipClick(category.name)}}
                                        />
                                    )
                                })
                            }
                        </Stack>
                        {project.tasks.length === 0 && <h3 style={{textAlign:'center'}}>No tasks added yet.</h3>}
                        <Grid container spacing={2} sx={{justifyContent:'center'}}>
                            {
                                project.tasks.map( task => {
                                    if (selectedChip === 'Pending') {
                                        if (task.status === 'pending') {
                                            if (categoryChipFilter === 'None') {
                                                return (
                                                    <Grid item key={task.id}>
                                                        <TaskCard task={task} refresh={getTaskList} user={user} />
                                                    </Grid>
                                                )
                                            }
                                            else if (task.task_category_name === categoryChipFilter) {
                                                return (
                                                    <Grid item key={task.id}>
                                                        <TaskCard task={task} refresh={getTaskList} user={user} />
                                                    </Grid>
                                                )
                                            }
                                            else {
                                                return null;
                                            }
                                        }
                                    }
                                    else if (selectedChip === 'Completed') {
                                        if (task.status === 'completed') {
                                            if (categoryChipFilter === 'None') {
                                                return (
                                                    <Grid item key={task.id}>
                                                        <TaskCard task={task} refresh={getTaskList} user={user} />
                                                    </Grid>
                                                )
                                            }
                                            else if (task.task_category_name === categoryChipFilter) {
                                                return (
                                                    <Grid item key={task.id}>
                                                        <TaskCard task={task} refresh={getTaskList} user={user} />
                                                    </Grid>
                                                )
                                            }
                                            else {
                                                return null;
                                            }
                                        }
                                    }
                                    else {
                                        if (categoryChipFilter === 'None') {
                                            return (
                                                <Grid item key={task.id}>
                                                    <TaskCard task={task} refresh={getTaskList} user={user} />
                                                </Grid>
                                            )
                                        }
                                        else if (task.task_category_name === categoryChipFilter) {
                                            return (
                                                <Grid item key={task.id}>
                                                    <TaskCard task={task} refresh={getTaskList} user={user} />
                                                </Grid>
                                            )
                                        }
                                        else {
                                            return null;
                                        }
                                    }
                                })
                            }
                        </Grid>

                        {/* Add task modal */}
                        <Modal
                            aria-labelledby="transition-modal-title"
                            aria-describedby="transition-modal-description"
                            open={open}
                            onClose={handleClose}
                            closeAfterTransition
                            slots={{ backdrop: Backdrop }}
                            slotProps={{
                                backdrop: {
                                    timeout: 500,
                                },
                            }}
                            sx={{overflow:'scroll'}}
                        >
                            <Fade in={open}>
                                <Box sx={style}>
                                    <AddTaskModal project={project} handleClose={handleClose} refresh={getTaskList} userUid={user.uid} />
                                </Box>
                            </Fade>
                        </Modal>

                        {/* Edit category modal */}
                        <Modal
                            aria-labelledby="transition-modal-title"
                            aria-describedby="transition-modal-description"
                            open={openCatModal}
                            onClose={handleCloseCatModal}
                            closeAfterTransition
                            slots={{ backdrop: Backdrop }}
                            slotProps={{
                                backdrop: {
                                    timeout: 500,
                                },
                            }}
                            sx={{overflow:'scroll'}}
                        >
                            <Fade in={openCatModal}>
                                <Box sx={style}>
                                    <EditCategoriesModal project={project} handleClose={handleCloseCatModal} refresh={getTaskList}/>
                                </Box>
                            </Fade>
                        </Modal>

                        {/* Collaborators modal */}
                        <Modal
                            aria-labelledby="transition-modal-title"
                            aria-describedby="transition-modal-description"
                            open={openCollabModal}
                            onClose={handleCloseCollabModal}
                            closeAfterTransition
                            slots={{ backdrop: Backdrop }}
                            slotProps={{
                                backdrop: {
                                    timeout: 500,
                                },
                            }}
                            sx={{overflow:'scroll'}}
                        >
                            <Fade in={openCollabModal}>
                                <Box sx={style}>
                                    <CollabModal handleClose={handleCloseCollabModal} projectId={id} userUid={user.uid} />
                                </Box>
                            </Fade>
                        </Modal>

                    </div>
            }
        </div>
    )
};

export default ProjectDetails;