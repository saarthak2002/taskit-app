import React from "react";
import { useState, useCallback, useEffect } from "react";
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


const EditTaskModal = (props) => {

    const { task, handleClose, refresh } = props;
    const [taskTitle, setTaskTitle] = useState(task.title);
    const [taskDesc, setTaskDesc] = useState(task.description);
    const [modalLoading, setModalLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    const [taskCategoryId, setTaskCategoryId] = useState(-1);
    const [taskCategoryName, setTaskCategoryName] = useState("None");
    const [taskCategoryColor, setTaskCategoryColor] = useState("#bab5b5");

    const getCategories = useCallback(() => {
        setModalLoading(true);
        axios
            .get(process.env.REACT_APP_API_URI + 'taskcategories/project/' + task.project_id)
            .then((response) => {
                console.log(response.data);
                setCategories(response.data);
                response.data.forEach(category => {
                    if(category.name === task.task_category_name) {
                        setTaskCategoryId(category.id);
                        setTaskCategoryName(category.name);
                        setTaskCategoryColor(category.color);
                    }
                });
                setModalLoading(false);
            })
            .catch((error) => {
                console.log('error:' + error);
                alert('error:' + error);
                setModalLoading(false);
            })
    }, [task.project_id, task.task_category_name]);

    const handleCategoryChange = (event) => {
        if (event.target.value === "-1") {
            console.log("None");
            setTaskCategoryName("None");
            setTaskCategoryColor("#bab5b5");
        }
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

    const updateTask = () => {
        setModalLoading(true);

        const headers = {
            'Content-Type': 'application/json',
        }

        var updateData = new FormData();
        updateData.append('title', taskTitle);
        updateData.append('description', taskDesc);
        updateData.append('task_category_name', taskCategoryName);
        updateData.append('task_category_color', taskCategoryColor);

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
                        <Typography variant="h6" component="h2" style={{paddingBottom:'4%'}}>
                            Edit Task
                        </Typography>
                        <TextField id="title" label="Title" variant="outlined" onChange={ (event) => { setTaskTitle(event.target.value) } } style={{width:'100%', paddingBottom:'4%'}} defaultValue={task.title}/>

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