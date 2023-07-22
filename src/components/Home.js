import React from "react";
import { useState, useEffect } from "react";
import { auth } from '../firebase-config';
import { onAuthStateChanged } from "firebase/auth";
import SideNav from './SideNav';
import Dashboard from "./Dashboard";
import LandingPage from "./LandingPage";

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
            {
                user?
                    <div>
                        <SideNav componentToDisplay={<Dashboard />} />
                    </div>
                :
                    <div style={{height:'115vh', background:'linear-gradient(0deg, rgba(212,137,133,1) 0%, rgba(56,116,203,1) 100%)'}}>
                        <LandingPage />
                    </div>
            }
        </div>
    )
}

export default Home;