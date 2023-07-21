import React from "react";
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import logo from '../logo-nobg.png';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { auth } from "../firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";

import axios from "axios";

const defaultTheme = createTheme();

const Register = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userName, setUserName] = useState('');

    const handleRegister = async () => {
        console.log(email, password, userName, firstName, lastName);

        try {
            const user = await createUserWithEmailAndPassword(auth, email, password);
            console.log(user);
            var bodyFormData = new FormData();
            bodyFormData.append('userUID', auth.currentUser.uid);
            bodyFormData.append('username', userName);
            bodyFormData.append('firstName', firstName);
            bodyFormData.append('lastName', lastName);
            
            const headers = {
                'Content-Type': 'application/json',
            }

            axios
                .post(process.env.REACT_APP_API_URI + 'users', bodyFormData, { headers: headers })
                .then((response) => {
                    console.log(response.data.message);
                    navigate('/');
                })
                .catch((error) => {
                    console.log('error:' + error);
                    alert('error:' + error);
                });
        }

        catch (error) {
            console.log(error.message);
            alert(error.message);
        }
        
    };

    return (
        <div style={{height:'100vh', background:'linear-gradient(0deg, rgba(212,137,133,1) 0%, rgba(56,116,203,1) 100%)'}}>
            <ThemeProvider theme={defaultTheme}>
                <Container 
                    maxWidth="sm"
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',  }}
                >
                    <Stack 
                        spacing={2}
                        backgroundColor="white"
                        border={10}
                        padding={5}
                        borderColor={'#3D3B30'}
                        borderRadius={16}
                        boxShadow={10}
                    >
                        <img src={logo} alt="logo" height='95' sx={{ mr: 1 }} style={{margin:'auto'}}/>

                        <Stack direction={'row'} spacing={2}>
                            <TextField id="first-name" label="First name" variant="outlined" onChange={ (event) => setFirstName(event.target.value) }/>
                            <TextField id="last-name" label="Last name" variant="outlined" onChange={ (event) => setLastName(event.target.value) }/>
                        </Stack>
                        <TextField id="username" label="Username" variant="outlined" onChange={ (event) => setUserName(event.target.value) }/>
                        <TextField id="email" label="Email" variant="outlined" onChange={ (event) => setEmail(event.target.value) }/>
                        <TextField id="password" label="Password" variant="outlined" onChange={ (event) => setPassword(event.target.value) }/>
                        <TextField id="confirm-password" label="Confirm password" variant="outlined" onChange={ (event) => setConfirmPassword(event.target.value) }/>

                        <Button variant="contained" onClick={handleRegister} style={{backgroundColor:'#3D3B30'}}>Register</Button>
                        <h5 style={{color:'rgb(192,192,192)'}}>Already a user? <Link to="/login" style={{textDecoration: 'none', color:'#3D3B30'}}>Sign in</Link></h5>
                    </Stack>
                </Container>
            </ThemeProvider>
        </div>
    );
};

export default Register;