import React from "react";
import { useState, useEffect, useCallback } from "react";
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from '@mui/material/TextField';
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';


const AddTaskModal = (props) => {

    const { project, handleClose, refresh, userUid } = props;
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDesc, setTaskDesc] = useState('');
    const [taskCategoryId, setTaskCategoryId] = useState(-1);
    const [taskCategoryName, setTaskCategoryName] = useState("None");
    const [taskCategoryColor, setTaskCategoryColor] = useState("#bab5b5");
    const [modalLoading, setModalLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    const getCategories = useCallback(() => {
        setModalLoading(true);
        axios
            .get(process.env.REACT_APP_API_URI + 'taskcategories/project/' + project.id)
            .then((response) => {
                console.log(response.data);
                setCategories(response.data);
                setModalLoading(false);
            })
            .catch((error) => {
                console.log('error:' + error);
                alert('error:' + error);
                setModalLoading(false);
            })
    }, [project.id]);

    const handleCategoryChange = (event) => {
        setTaskCategoryId(event.target.value);
        categories.forEach(category => {
            if (category.id === event.target.value) {
                setTaskCategoryName(category.name);
                setTaskCategoryColor(category.color);
                console.log(category.name);
                console.log(category.color);
            }
        });
        console.log(event.target.value);
    };

    const handleCreateTask = () => {
        setModalLoading(true);  
        console.log(taskTitle, taskDesc, taskCategoryId, taskCategoryColor);

        const headers = {
            'Content-Type': 'application/json',
        }
        var taskData = new FormData();
        taskData.append('title', taskTitle);
        taskData.append('description', taskDesc);
        taskData.append('task_category_name', taskCategoryName);
        taskData.append('task_category_color', taskCategoryColor);
        taskData.append('created_by_user_uid', userUid);
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

    useEffect(() => {
        getCategories();
    }, [getCategories]);

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

                        <Box sx={{ minWidth: 100, paddingBottom:'3%' }}>
                            <FormControl fullWidth>
                                    <div style={{ width: '100%' }}>
                                        <InputLabel id="select-label" >Category</InputLabel>
                                        <Select
                                            sx={{ width: '100%' }}
                                            labelId="select-label"
                                            id="simple-select"
                                            value={taskCategoryId}
                                            label="Category"
                                            onChange={ (e) => {handleCategoryChange(e)} }
                                        >
                                            <MenuItem value="-1">None</MenuItem>
                                            {
                                                categories.map(category => {
                                                    return (
                                                        <MenuItem key={category.id} value={category.id} >{category.name}</MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </div>
                            </FormControl>
                        </Box>

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