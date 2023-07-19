import React from "react";
import { useState } from "react";
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';


const DeleteTaskModal = (props) => {

    const { task, handleClose, refresh } = props;
    const [modalLoading, setModalLoading] = useState(false);

    const deleteTask = () => {
        setModalLoading(true);
        axios
            .post(process.env.REACT_APP_API_URI + 'task/' + task.id + '/delete')
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
                        <Typography variant="h6">
                            Are you sure you want to delete the task {task.title}?
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" style={{paddingTop:'4%'}}>
                            <Button variant="contained" color="error" style={{borderRadius:'1rem'}} onClick={() => {deleteTask();}}>Yes</Button>
                            <Button variant="contained"  color="primary" style={{borderRadius:'1rem'}} onClick={ () => {handleClose();} }>No</Button>
                        </Stack>
                    </div>
            }
        </div>
    )
};

export default DeleteTaskModal;