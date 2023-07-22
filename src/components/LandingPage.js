import '../Landing.css';
import React from "react";
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import screenshot from '../assets/images/app-ss.png'
import { Link } from "react-router-dom";
import logo from '../logo-nobg.png'
import { Stack } from "@mui/material";

const LandingPage = () => {
    return (
		<div>

			<AppBar sx={{ background: 'white' }}>
				<Toolbar sx={{ justifyContent: "space-between" }}>
					<img src={logo} width={150} alt='task it app logo' />
					<div>
						<Stack direction="row" spacing={2}>
							<Link to='/login'><Button variant="contained" sx={{backgroundColor:'rgb(176,176,176)'}}>Login</Button></Link>
							<Link to='/register'><Button variant="contained" sx={{backgroundColor:'rgb(176,176,176)'}}>Sign Up</Button></Link>
						</Stack>
					</div>
				</Toolbar>
			</AppBar>

			<Box 
				style={{
					width: '100%',
					display: 'flex',
					minHeight: '600px',
					alignItems: 'center',
					justifyContent: 'center',
					paddingTop: '6%',
				}}
			>
				<Grid 
					container spacing={6} 
					style={{
						display: 'flex',
						alignItems: 'center',
						maxWidth: '1300px',
						padding: '50px',
					}}
				>
					<Grid item xs={12} md={4}>
						<Typography variant="h3" fontWeight={700} style={{paddingBottom: '15px', color: '#3D3B30'}}>
							Let's optimize your projects
						</Typography>
						<Typography variant="h6" style={{opacity: '0.7', paddingBottom: '30px', color: "#fff"}}>
							Whether you need a simple to-do list for your home improvement project or a task planner for your global team to collaborate effectively, task.it has you covered. Try it below.
						</Typography>
						<Link to="/login">
							<Button
								variant="contained"
								sx={{ width: '200px', fontSize: '16px', backgroundColor: '#3D3B30', color: '#fff' }}
							>
								Get Started
							</Button>
						</Link>
					</Grid>
					<Grid item xs={12} md={8}>
						<img src={screenshot} alt="a screenshot of the task it app" style={{width: '100%', boxShadow:10}} />
					</Grid>
				</Grid>
			</Box>
			
			<Box
				sx={{ flexGrow: 1 }}
				styles={{
					flexGrow: 1,
					padding: '10px',
					maxWidth: '700px',
					margin: '30px auto',
					width: '100%',
				}}
			>
				<Typography styles={{paddingBottom: '10px'}} textAlign={'center'} color={'white'}>
					Made with &#9825; by Saarthak Gupta
				</Typography>
				<Typography textAlign={'center'}>
					<a href="https://saarthakgupta.com/" target="_blank" underline="none" rel="noreferrer">
						Website
					</a>
					{' '}<span style={{color:'#3D3B30'}}>|</span>{' '}
					<a href="https://github.com/saarthak2002" target="_blank" underline="none" rel="noreferrer">
						GitHub
					</a>
					{' '}<span style={{color:'#3D3B30'}}>|</span>{' '}
					<a href="https://www.linkedin.com/in/saarthak-gupta/" target="_blank" underline="none" rel="noreferrer">
						LinkedIn
					</a>
				</Typography>
			</Box>
		</div>
	);
};

export default LandingPage;