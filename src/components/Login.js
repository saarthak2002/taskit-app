import React from "react";
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import logo from '../logo-nobg.png';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { auth } from "../firebase-config";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import LinearProgress from '@mui/material/LinearProgress';
import GoogleButton from 'react-google-button';
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';


const defaultTheme = createTheme();

const Login = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const user = await signInWithEmailAndPassword(auth, email, password);
            console.log(user);
            navigate('/');
        }
        catch (error) {
            console.log(error.message);
            alert(error.message);
            setLoading(false);
        }
    };

    const provider = new GoogleAuthProvider();
    const singInWithGoogle = () => {
        setLoading(true);
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                var firstName = '';
                var lastName = '';
                var userName = user.displayName.replace(' ', '').toLowerCase() + user.uid.slice(0, 5);
                if(user.displayName.includes(' ')) {
                    firstName = user.displayName.split(' ')[0];
                    lastName = user.displayName.split(' ')[1];
                }
                else {
                    firstName = user.displayName;
                }

                axios
                    .get(process.env.REACT_APP_API_URI + 'users/' + user.uid)
                    .then((response) => {
                        if (response.data.error) {
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
                                    setLoading(false);
                                    alert('error:' + error);
                                });
                        }
                        else {
                            navigate('/');
                        }
                    })
            })
            .catch((error) => {
                setLoading(false);
                alert('error:' + error);
            });
    }

    return (
        <div style={{height:'100vh', background:'linear-gradient(0deg, rgba(212,137,133,1) 0%, rgba(56,116,203,1) 100%)'}}>
            <ThemeProvider theme={defaultTheme}>
                { loading &&
                    <Box sx={{ width: '100%' }} >
                        <LinearProgress sx={{backgroundColor:'#3D3B30'}} />
                    </Box>
                }
                <Container 
                    maxWidth="sm"
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
                >
                    { loading ?
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
                            <TextField id="email" label="Email" variant="outlined" onChange={ (event) => setEmail(event.target.value) }/>
                            <TextField id="password" label="Password" variant="outlined" onChange={ (event) => setPassword(event.target.value) }/>
                            <Button variant="contained" onClick={handleLogin} style={{backgroundColor:'#3D3B30'}}>Login</Button>
                            <h5 style={{color:'rgb(192,192,192)'}}>New here? <Link to="/register" style={{textDecoration: 'none', color:'#3D3B30'}}>Sign up</Link></h5>
                            <h6 style={{textAlign:'center', color:"#3D3B30"}}>or</h6>
                            <GoogleButton
                                label="Continue with Google"
                                type="dark"
                                onClick={singInWithGoogle}
                            />
                        </Stack>
                    }   
                </Container>
            </ThemeProvider>
        </div>
    );
};

export default Login;