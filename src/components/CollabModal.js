import React from "react";
import { useState, useEffect } from "react";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import AddIcon from '@mui/icons-material/Add';

const CollabModal = (props) => {

    const { handleClose, projectId, userUid } = props;
    const [modalLoading, setModalLoading] = useState(false);
    const [collaborators, setCollaborators] = useState([]);

    const [searchString, setSearchString] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [hasSearchedOnce, setHasSearchedOnce] = useState(false);
    const [currentCollabsArray, setCurrentCollabsArray] = useState([]);

    const handleSearch = () => {
        setSearchLoading(true);
        setHasSearchedOnce(true);
        axios
            .get(process.env.REACT_APP_API_URI + '/users/search/' + searchString)
            .then((response) => {
                setSearchResults(response.data);
                setSearchLoading(false);
            })
            .catch((error) => {
                console.log('error:' + error);
                alert('error:' + error);
                setSearchLoading(false);
            })
    }

    const handleAddCollab = (event) => {
        console.log(userUid);
        const userUidToAdd = event.currentTarget.getAttribute('userUid');
        console.log("add " + projectId + " " + userUidToAdd);
        setModalLoading(true);
        const headers = {
            'Content-Type': 'application/json',
        }
        axios
            .post(process.env.REACT_APP_API_URI + '/collab/project/' + projectId, {userUID: userUidToAdd}, headers)
            .then((response) => {
                console.log(response.data.message);
                setModalLoading(false);
                handleClose();
            })
            .catch((error) => {
                console.log('error:' + error);
                alert('error:' + error);
                setModalLoading(false);
            });   
    }

    useEffect(() => {
       setModalLoading(true);
       axios
            .get(process.env.REACT_APP_API_URI + '/collab/project/' + projectId)
            .then((response) => {
                const userInfoPromise = response.data.map((collab) => {
                    return axios.get(process.env.REACT_APP_API_URI + '/users/' +  collab.userUID);
                });

                Promise.all(userInfoPromise)
                    .then((responses) => {
                        const collabUserInfo = responses.map((response, index) => {
                            const userInfo = response.data;
                            return userInfo
                        });
                        var userNamesArray = [];
                        collabUserInfo.forEach((userInfo) => {
                            userNamesArray.push(userInfo.username);
                        });
                        setCollaborators(collabUserInfo);
                        setCurrentCollabsArray(userNamesArray);
                        setModalLoading(false);
                    })
                    .catch((error) => {
                        console.log('error:' + error);
                        alert('error:' + error);
                        setModalLoading(false);
                    })
            })
            .catch((error) => {
                console.log('error:' + error);
                alert('error:' + error);
                setModalLoading(false);
            });
    }, [projectId]);

    return (
        <div>
            {
                modalLoading ?
                    <div  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                        <CircularProgress size={'3rem'} />
                    </div>
                :
                    <div>
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <Typography variant="h6" component="h2" style={{paddingBottom:'4%'}}>
                                    Collaborators
                                </Typography>
                            </Grid>
                            <Grid item>
                                <IconButton onClick={handleClose}>
                                    <CloseIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                        {
                            collaborators.length === 0 ?
                                <h5>No Collaborators yet</h5>
                            :
                                <List
                                    sx={{
                                        width: '100%',
                                        maxWidth: 360,
                                        bgcolor: 'background.paper',
                                        position: 'relative',
                                        overflow: 'auto',
                                        maxHeight: 150,
                                        '& ul': { padding: 0 },
                                    }}
                                    subheader={<li />}
                                >
                                    {
                                        collaborators.map((item) => (
                                            <ListItem key={item.id}>
                                                <Avatar>{item.firstname.charAt(0)+item.lastname.charAt(0)}</Avatar>
                                                <ListItemText primary={item.firstname + " " + item.lastname} secondary={item.username} sx={{marginLeft:2}}/>
                                            </ListItem>
                                        ))
                                    }
                                </List>
                        }
                        
                        <h4>Add collaborators</h4>
                        <Grid container justifyContent="space-between" alignItems="center">
                            <Grid item xs={10}>
                                <TextField
                                    label="Search username"
                                    sx={{width:'100%'}}
                                    onChange={(event) => setSearchString(event.target.value)}
                                    InputProps={{
                                        endAdornment:
                                            searchLoading && <InputAdornment position="end"><CircularProgress size={'1rem'} /></InputAdornment>
                                    }}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <IconButton onClick={handleSearch} sx={{marginLeft: 2}}>
                                    <SearchIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                        {                                            
                            searchResults.length === 0 ?
                                hasSearchedOnce ?
                                    searchLoading ?
                                        <div></div>
                                    :
                                        <h5>No Results</h5>
                                :
                                    <div></div>
                            :
                                <List
                                    sx={{
                                        width: '100%',
                                        maxWidth: 360,
                                        bgcolor: 'background.paper',
                                        position: 'relative',
                                        overflow: 'auto',
                                        maxHeight: 150,
                                        '& ul': { padding: 0 },
                                    }}
                                    subheader={<li />}
                                >
                                    {
                                        searchResults.map((item) => (
                                            <ListItem key={item.id}>
                                                <Avatar>{item.firstname.charAt(0)+item.lastname.charAt(0)}</Avatar>
                                                <ListItemText primary={item.firstname + " " + item.lastname} secondary={item.username} sx={{marginLeft:2}}/>
                                                {
                                                    currentCollabsArray.includes(item.username) ?
                                                        <Chip label="added" sx={{color:'white', backgroundColor:'rgb(189,189,189)'}} />
                                                    :
                                                    item.userUID === userUid ?
                                                        <Chip label="owner" sx={{color:'white', backgroundColor:'rgb(189,189,189)'}} />
                                                    :
                                                        <IconButton userUid={item.userUID} onClick={ (event) => {handleAddCollab(event);} }>
                                                            <AddIcon />
                                                        </IconButton>
                                                }
                                            </ListItem>
                                        ))
                                    }
                                </List>                           
                        }
                    </div>
            }
        </div>
    )
};

export default CollabModal;