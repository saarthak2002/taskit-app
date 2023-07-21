import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Stack from '@mui/material/Stack';

function Row(props) {
    const { row } = props;
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">{row.title}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell align="right">{row.tasks.length}</TableCell>
                <TableCell align="right">{row.tasks.reduce((count, task) => task.status === 'completed' ? count + 1 : count, 0)}</TableCell>
                <TableCell align="right">{row.date_added.slice(0, 16)}</TableCell>
                <TableCell>
                    <IconButton
                        aria-label="view project"
                        size="small"
                        onClick={() => {navigate('/project-details/' + row.id)}}
                    >
                        <VisibilityIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">Tasks</Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell align="right">Category</TableCell>
                                        <TableCell align="right">Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.tasks.map((task) => (
                                        <TableRow key={task.id}>
                                            <TableCell component="th" scope="row">{task.title}</TableCell>
                                            <TableCell>{task.description}</TableCell>
                                            <TableCell align="right">{task.task_category_name}</TableCell>
                                            <TableCell align="right">
                                                <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
                                                    {task.status === 'completed' ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
                                                    <div>{task.status}</div>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

const ProjectsTable = (props) => {
    const { projects } = props;

    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="right">Tasks</TableCell>
                        <TableCell align="right">Completed</TableCell>
                        <TableCell align="right">Created</TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {projects.map((row) => (
                        <Row key={row.id} row={row} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default ProjectsTable;
