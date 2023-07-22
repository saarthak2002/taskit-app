import React from "react";
import { useState } from "react";
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import CircularProgress from '@mui/material/CircularProgress';


const LogoutModal = (props) => {

    const { signOut, handleClose } = props;
    const [modalLoading, setModalLoading] = useState(false);

    const logout = () => {
        setModalLoading(true);
        signOut();
    }

    return (
        <div>
            {
                modalLoading ?
                    <div  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                        <CircularProgress size={'3rem'} />
                    </div>
                :
                    <div>
                        <Typography variant="h6">
                            Are you sure you want to log out?
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" style={{paddingTop:'4%'}}>
                            <Button variant="contained" color="error" style={{borderRadius:'1rem'}} onClick={() => {logout();}}>Yes</Button>
                            <Button variant="contained"  color="primary" style={{borderRadius:'1rem'}} onClick={ () => {handleClose();} }>No</Button>
                        </Stack>
                    </div>
            }
        </div>
    )
};

export default LogoutModal;