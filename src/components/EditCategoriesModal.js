import React from "react";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { HexColorPicker } from "react-colorful";
import Paper from '@mui/material/Paper';

const EditCategoriesModal = (props) => {
    const { project, handleClose, refresh } = props;
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [categoryColor, setCategoryColor] = useState('#000000');
    const [modalLoading, setModalLoading] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(-1);

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

    const handleDeleteCategoryChange = (event) => {
        setCategoryToDelete(event.target.value);
        console.log(event.target.value);
    }

    const handleCreateCategory = () => {
        setModalLoading(true);
        console.log(categoryName, categoryColor);

        const headers = {
            'Content-Type': 'application/json',
        }
        var categoryData = new FormData();
        categoryData.append('name', categoryName);
        categoryData.append('color', categoryColor);

        axios
            .post(process.env.REACT_APP_API_URI + 'taskcategories/project/' + project.id, categoryData, { headers: headers })
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

    const deleteCategory = () => {
        setModalLoading(true);
        console.log(categoryToDelete);

        const headers = {
            'Content-Type': 'application/json',
        }

        axios
            .post(process.env.REACT_APP_API_URI + 'taskcategories/' + categoryToDelete + '/delete', { headers: headers })
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
    }

    useEffect(() => {
        getCategories();
    }, [getCategories]);

    return (
        <div>
            {
                modalLoading ?
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <CircularProgress size={'3rem'} />
                    </div>
                :
                    <div>
                        <Typography variant="h6" component="h2" sx={{ paddingBottom: '2%' }}>
                            Add Category
                        </Typography>
                        <TextField id="name" label="Name" variant="outlined" onChange={(event) => { setCategoryName(event.target.value) }} style={{ width: '100%', paddingBottom: '3%' }} />
                        <Stack direction="row" spacing={2} sx={{ paddingBottom: '4%' }}>
                            <HexColorPicker color={categoryColor} onChange={setCategoryColor} />
                            <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Typography color="rgb(176,176,176)">Color: {categoryColor}</Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        '& > :not(style)': {
                                            m: 1,
                                            width: 60,
                                            height: 20,
                                        },
                                    }}
                                >
                                    <Paper elevation={3} sx={{ backgroundColor: categoryColor }} />
                                </Box>
                            </Stack>
                        </Stack>
                        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Button variant="contained" style={{ borderRadius: '1rem' }} onClick={handleCreateCategory}>Add</Button>
                            <Button variant="outlined" style={{ borderRadius: '1rem' }} onClick={() => { handleClose(); }}>Cancel</Button>
                        </Stack>
                        <Divider style={{ paddingTop: '2%', paddingBottom: '2%' }} />
                        <Typography variant="h6" component="h2" sx={{ paddingBottom: '2%' }}>
                            Remove Category
                        </Typography>
                        <Box sx={{ minWidth: 100 }}>
                            <FormControl fullWidth>
                                <Stack direction="row">
                                    <div style={{ width: '100%' }}>
                                        <InputLabel id="select-label" >Category</InputLabel>
                                        <Select
                                            sx={{ width: '100%' }}
                                            labelId="select-label"
                                            id="simple-select"
                                            value={categoryToDelete}
                                            label="Category"
                                            onChange={handleDeleteCategoryChange}
                                        >
                                            <MenuItem value={-1}>Select Category</MenuItem>
                                            {
                                                categories.map(category => {
                                                    return (
                                                        <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </div>
                                    <IconButton color="error" onClick={deleteCategory}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Stack>
                            </FormControl>
                        </Box>
                    </div>
            }
        </div>
    )
}

export default EditCategoriesModal;