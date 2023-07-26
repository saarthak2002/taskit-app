import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import ListItemText from '@mui/material/ListItemText';

const ProjectList = (props) => {

    const { userUid } = props;
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);

    useEffect(()=> {
        setLoading(true);
        axios
            .get(process.env.REACT_APP_API_URI + 'projects/' + userUid)
            .then((response) => {
                setProjects(response.data);
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
                    <List
                        overflow="auto"
                    >
                        {projects.length === 0 ?
                            <Typography>
                                No projects yet
                            </Typography>
                        :
                            projects.map((project) => {
                                return (
                                    <ListItem key={project.id}>
                                        <ListItemText
                                            primary={project.title}
                                            secondary={project.description}
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

export default ProjectList;