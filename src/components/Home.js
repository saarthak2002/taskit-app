import React from "react";
import { useState, useEffect } from "react";
import {Link} from 'react-router-dom';

import Button from '@mui/material/Button';

import { auth } from '../firebase-config';
import { signOut, onAuthStateChanged } from "firebase/auth";

const Home = () => {

    const [user, setUser] = useState({});

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
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
            <p>This is the home page</p>
            {user ? user.email && <h5>{user.email}</h5> : <h5>No user logged in</h5>}
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