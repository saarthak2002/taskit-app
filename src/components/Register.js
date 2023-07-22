import React from "react";
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import logo from '../logo-nobg.png';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import { auth } from "../firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const validateForm = () => {
        if (firstName === '') {
            setErrorMessage('First name is required');
            return false;
        }
        else if(lastName === '') {
            setErrorMessage('Last name is required');
            return false;
        }
        else if(userName === '') {
            setErrorMessage('Username is required');
            return false;
        }
        else if (email === '') {
            setErrorMessage('Email is required');
            return false;
        }
        else if (password === '') {
            setErrorMessage('Password is required');
            return false;
        }
        else if (confirmPassword === '') {
            setErrorMessage('Re-enter your password');
            return false;
        }
        else if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return false;
        }
        return true;
    }

    const handleRegister = async () => {
        setLoading(true);
        setError(false);
        if(validateForm()) {
            try {
                const user = await createUserWithEmailAndPassword(auth, email, password);
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
                        if(response.data.error) {
                            setErrorMessage(response.data.error);
                            setError(true);
                            auth.currentUser.delete()
                                .then(() => {
                                    console.log('User deleted');
                                    setLoading(false);
                                })
                                .catch((error) => {
                                    console.log(error.message);
                                    alert(error.message);
                                    setLoading(false);
                                });
                        }
                        else {
                            navigate('/');
                        }
                    })
                    .catch((error) => {
                        console.log('error:' + error);
                        setLoading(false);
                        setErrorMessage(error);
                        setError(true);
                    });
            }
            catch (error) {
                setLoading(false);
                console.log(error.message);
                setErrorMessage(error.message);
                setError(true);
            }
        }
        else {
            setLoading(false);
            setError(true);
        }
        
    };

    return (
        <div style={{height:'100vh', background:'linear-gradient(0deg, rgba(212,137,133,1) 0%, rgba(56,116,203,1) 100%)'}}>
            <ThemeProvider theme={defaultTheme}>
                { loading &&
                    <Box sx={{ width: '100%' }} >
                        <LinearProgress sx={{backgroundColor:'#3D3B30'}} />
                    </Box>
                }
                {error && <Alert severity="error" onClose={() => {setError(false)}}>{errorMessage}</Alert>}
                <Container 
                    maxWidth="sm"
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
                >
                    {
                        loading ?
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
                                <div  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <CircularProgress size={'3rem'} />
                                </div>
                            </Stack>
                        :
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
                    }
                </Container>
            </ThemeProvider>
        </div>
    );
};

export default Register;