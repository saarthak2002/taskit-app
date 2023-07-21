import React from "react";
import { useState, useEffect } from "react";
import { auth } from '../firebase-config';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { CircularProgress } from "@mui/material";
import Button from '@mui/material/Button';
import axios from 'axios';
import { useNavigate } from "react-router";


const CreateProject = () => {

    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [userInfo, setUserInfo] = useState({firstname:'', lastname:'', username:''});

    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');

    const handleProjectCreate= () => {
        setLoading(true);
        console.log(title, desc);
        var project_form_data = new FormData();
        project_form_data.append('userUID', user.uid);
        project_form_data.append('title', title);
        project_form_data.append('description', desc);
        
        const headers = {
            'Content-Type': 'application/json',
        }

        axios
            .post(process.env.REACT_APP_API_URI + 'projects', project_form_data, { headers: headers })
            .then((response) => {
                console.log(response.data.message);
                setLoading(false);
                navigate('/');
            })
            .catch((error) => {
                console.log('error:' + error);
                setLoading(false);
                
            })
    }

    useEffect(() => {
        setLoading(true);
        auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                axios
                    .get(process.env.REACT_APP_API_URI + 'users/' + user.uid)
                    .then((response) => {
                        console.log(response.data);
                        setUserInfo(response.data);
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.log('error:' + error);
                        alert('error:' + error);
                        setLoading(false);
                    })

            } else {
                setUser({});
                navigate('/login')
            }
        });
    }, [navigate]);

    return (
        <div>
            {
                loading ?
                    <div  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                            <CircularProgress size={'3rem'} />
                    </div>
                :
                    <div>
                        
                        <Stack 
                            spacing={2}
                            maxWidth={750}
                            
                        >
                            <h1 style={{paddingTop:'5%'}}>Create Project</h1>
                            <h3>Owner: {userInfo.firstname + ' ' + userInfo.lastname}</h3>
                            <TextField id="title" label="Title" variant="outlined" onChange={ (event) => { setTitle(event.target.value) } }/>
                            <TextField id="desc" label="Description" variant="outlined" multiline rows={5} onChange={ (event) => { setDesc(event.target.value) } }/>
                            <Button variant="contained" size="large" onClick={handleProjectCreate}>Create</Button>
                        </Stack>
                    </div>
            }
        </div>
    );
}

export default CreateProject;