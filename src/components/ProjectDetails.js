import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router";
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
import Box from '@mui/material/Box';

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
    const [loading, setLoading] = useState(false);
    const [project, setProject] = useState({tasks:[]});
    const [selectedChip, setSelectedChip] = useState("All");
    const [percentage, setPercentage] = useState(0);
    const [completedTasks, setCompletedTasks] = useState(0);

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


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
                setLoading(false);
            })
            .catch((error) => {
                console.log('error:' + error);
                setLoading(false);
            })
    }, [id]);

    

    const handleChipClick = (chip) => {
        setSelectedChip(chip);
    }

    useEffect(() => {
        getTaskList();
    }, [getTaskList]);

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
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <h1>{project.title}</h1>
                            </Grid>
                            <Grid item>
                                
                                    <Button variant="contained" size="large" onClick={handleOpen}>
                                        + Add Task
                                    </Button>
                                
                            </Grid>
                        </Grid>

                        <div style={{margin:'auto', width:'50%'}}>
                            <div style={{margin:'auto', width:'30%'}}>
                                <CircularProgressbarWithChildren value={percentage ? percentage : 0} text={`${percentage ? percentage.toFixed(2) : '0'}%`} />
                                <h5 style={{color:'#BC7F54', textAlign:'center'}}>{completedTasks} of {project.tasks.length} {project.tasks.length === 1 ? 'task' :'tasks'} completed</h5>
                            </div>
                        </div>
                        
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" style={{padding:'1%'}}>
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
                        {project.tasks.length === 0 && <h3 style={{textAlign:'center'}}>No tasks added yet.</h3>}
                        <Grid container spacing={2}>
                            {
                                project.tasks.map( task => {
                                    if (selectedChip === 'Pending') {
                                        if (task.status === 'pending') {
                                            return (
                                                <Grid item key={task.id}>
                                                    <TaskCard task={task} refresh={getTaskList} setLoading={setLoading} />
                                                </Grid>
                                            )
                                        }
                                    }
                                    else if (selectedChip === 'Completed') {
                                        if (task.status === 'completed') {
                                            return (
                                                <Grid item key={task.id}>
                                                    <TaskCard task={task} refresh={getTaskList} setLoading={setLoading} />
                                                </Grid>
                                            )
                                        }
                                    }
                                    else {
                                        return (
                                            <Grid item key={task.id}>
                                                <TaskCard task={task} refresh={getTaskList} setLoading={setLoading} />
                                            </Grid>
                                        )
                                    }
                                })
                            }
                        </Grid>
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
                        >
                            <Fade in={open}>
                                <Box sx={style}>
                                    <AddTaskModal project={project} handleClose={handleClose} refresh={getTaskList} setLoading={setLoading} />
                                </Box>
                            </Fade>
                        </Modal>
                    </div>
            }
        </div>
    )
};

export default ProjectDetails;