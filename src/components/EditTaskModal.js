import React from "react";
import { useState } from "react";
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from '@mui/material/TextField';
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';


const EditTaskModal = (props) => {

    const { task, handleClose, refresh } = props;
    const [taskTitle, setTaskTitle] = useState(task.title);
    const [taskDesc, setTaskDesc] = useState(task.description);
    const [modalLoading, setModalLoading] = useState(false);

    const updateTask = () => {
        setModalLoading(true);

        const headers = {
            'Content-Type': 'application/json',
        }

        var updateData = new FormData();
        updateData.append('title', taskTitle);
        updateData.append('description', taskDesc);

        axios
            .post(process.env.REACT_APP_API_URI + 'task/' + task.id + '/edit', updateData, { headers: headers })
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
            });
    }

    return (
        <div>
            {
                modalLoading ?
                    <div  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                        <CircularProgress size={'3rem'} />
                    </div>
                :
                    <div>
                        <Typography variant="h6" component="h2" style={{paddingBottom:'4%'}}>
                            Edit Task
                        </Typography>
                        <TextField id="title" label="Title" variant="outlined" onChange={ (event) => { setTaskTitle(event.target.value) } } style={{width:'100%', paddingBottom:'4%'}} defaultValue={task.title}/>
                        <TextField id="desc" label="Description" variant="outlined" multiline rows={3} onChange={ (event) => { setTaskDesc(event.target.value) } } style={{width:'100%', paddingBottom:'4%'}} defaultValue={task.description} />
                        
                        <Stack direction="row" spacing={2}>
                            <Button variant="contained" style={{borderRadius:'1rem'}} onClick={ () => { updateTask() } }>Update</Button>
                            <Button variant="outlined" style={{borderRadius:'1rem'}} onClick={ () => {handleClose();} }>Cancel</Button>
                        </Stack>
                    </div>
            }
        </div>
    )
};

export default EditTaskModal;