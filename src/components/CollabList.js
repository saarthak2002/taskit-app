import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

const CollabList = (props) => {

    const { userUid } = props;
    const [loading, setLoading] = useState(false);
    const [collabs, setCollabs] = useState([]);

    useEffect(()=> {
        setLoading(true);
        axios
            .get(process.env.REACT_APP_API_URI + 'collabs/getcollabsbyuid/' + userUid)
            .then((response) => {
                setCollabs(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log('error:' + error);
                alert('error:' + error);
                setLoading(false);
            })

    }, [userUid]);

    return (
        <div style={{maxHeight: 300, overflow: 'auto'}}>
            {
                loading ?
                    <List
                        overflow="auto"
                    >
                        <ListItem>
                            <div  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                <CircularProgress size={'3rem'} />
                            </div>
                        </ListItem>
                    </List>
                :
                    <List>
                        {collabs.length === 0 ?
                            <Typography>
                                No collaborations yet
                            </Typography>
                        :
                            collabs.map((collab) => {
                                return (
                                    <ListItem key={collab.id}>
                                        <ListItemAvatar>
                                            <Avatar>
                                                {collab.firstname.charAt(0)+collab.lastname.charAt(0)}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary=  {collab.firstname + ' ' + collab.lastname}
                                            secondary={collab.username}
                                        />
                                    </ListItem>
                                )
                            })
                        }
                    </List>
            }
        </div>
    );
    
}

export default CollabList;