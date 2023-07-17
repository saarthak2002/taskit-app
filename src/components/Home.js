import React from "react";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';

import { auth } from '../firebase-config';
import { signOut, onAuthStateChanged } from "firebase/auth";

import axios from "axios";

const Home = () => {

    const [user, setUser] = useState({});
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(user.uid);
                setUser(user);
                axios
                    .get(process.env.REACT_APP_API_URI + 'users/' + user.uid)
                    .then((response) => {
                        console.log(response.data);
                        setUserInfo(response.data);
                    })
                    .catch((error) => {
                        console.log('error:' + error);
                    });
            } else {
                setUser(null);
                setUserInfo(null);
            }
          });
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        }

        catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div>
            <h1>Home</h1>
            {userInfo && <h2>Hello, {userInfo?.firstname + ' ' + userInfo?.lastname}</h2>}
            {user ? user.email && <h5>{user.email} {user.uid}</h5> : <h5>No user logged in</h5>}
            {
                user?
                    <Button variant="contained" onClick={handleLogout}>Logout</Button>
                :
                <Link to="/login">
                    <Button variant="contained">Get Started</Button>
                </Link>
            }
        </div>
    )
}

export default Home;