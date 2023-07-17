import React from "react";
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { auth } from "../firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";

const defaultTheme = createTheme();

const Register = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async () => {
        console.log(email, password);

        try {
            const user = await createUserWithEmailAndPassword(auth, email, password);
            console.log(user);
            navigate('/');
        }

        catch (error) {
            console.log(error.message);
        }
        
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container 
                maxWidth="sm"
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',  }}
            >
                <Stack 
                    spacing={2}
                >
                    <TextField id="email" label="Email" variant="outlined" onChange={ (event) => setEmail(event.target.value) }/>
                    <TextField id="password" label="Password" variant="outlined" onChange={ (event) => setPassword(event.target.value) }/>
                    <TextField id="confirm-password" label="Confirm password" variant="outlined" onChange={ (event) => setConfirmPassword(event.target.value) }/>

                    <Button variant="contained" onClick={handleRegister}>Register</Button>
                    <h5>Already a user? <Link to="/login">Sign in</Link></h5>
                </Stack>
            </Container>
        </ThemeProvider>
    );
};

export default Register;