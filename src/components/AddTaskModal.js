import React from "react";
import { useState } from "react";
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from '@mui/material/TextField';
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';


const AddTaskModal = (props) => {

    const { project, handleClose, refresh, setLoading } = props;
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDesc, setTaskDesc] = useState('');
    const [modalLoading, setModalLoading] = useState(false);

    const handleCreateTask = () => {
        setModalLoading(true);  
        console.log(taskTitle, taskDesc);

        const headers = {
            'Content-Type': 'application/json',
        }
        var taskData = new FormData();
        taskData.append('title', taskTitle);
        taskData.append('description', taskDesc);

        axios
            .post(process.env.REACT_APP_API_URI + 'projects/' + project.id + '/tasks', taskData, { headers: headers })
            .then((response) => {
                console.log(response.data.message);
                refresh();
                handleClose();
                setModalLoading(false);
            })
            .catch((error) => {
                console.log('error:' + error);
                alert('error:' + error);
                setModalLoading(false);
            })
    };

    return (
        <div>
            {
                modalLoading ?
                    <div  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                        <CircularProgress size={'3rem'} />
                    </div>
                :
                    <div>
                        <Typography variant="h6" component="h2">
                            Add Task
                        </Typography>
                        <Typography style={{paddingBottom:'3%'}}>
                            Create a new task for {project.title}.
                        </Typography>
                        <TextField id="title" label="Title" variant="outlined" onChange={ (event) => { setTaskTitle(event.target.value) } } style={{width:'100%', paddingBottom:'3%'}}/>
                        <TextField id="desc" label="Description" variant="outlined" multiline rows={3} onChange={ (event) => { setTaskDesc(event.target.value) } } style={{width:'100%', paddingBottom:'3%'}}/>
                        <Stack direction="row" spacing={2}>
                            <Button variant="contained" style={{borderRadius:'1rem'}} onClick={handleCreateTask}>Create</Button>
                            <Button variant="outlined" style={{borderRadius:'1rem'}} onClick={ () => {handleClose();} }>Cancel</Button>
                        </Stack>
                    </div>
            }
        </div>
    )
};

export default AddTaskModal;