import React from "react";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';

import { auth } from '../firebase-config';
import { onAuthStateChanged } from "firebase/auth";

import SideNav from './SideNav';
import Dashboard from "./Dashboard";

const Home = () => {

    const [user, setUser] = useState({});

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(user.uid);
                setUser(user);
                
            } else {
                setUser(null);
            }
        });
    }, []);

    return (
        <div>
            <h1>Home</h1>
            {
                user?
                    <div>
                        <SideNav componentToDisplay={<Dashboard />} />
                    </div>
                :
                <Link to="/login">
                    <Button variant="contained">Get Started</Button>
                </Link>
            }
        </div>
    )
}

export default Home;