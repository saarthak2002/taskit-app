import './App.css';

import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import CreateProject from './components/CreateProject';
import ProjectDetails from './components/ProjectDetails';
import SideNav from './components/SideNav';

import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
  return (
      <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Home />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register />}/>
            <Route path="/create-project" element={<SideNav componentToDisplay={<CreateProject />} />}/>
            <Route path="/project-details/:id" element={<SideNav componentToDisplay={<ProjectDetails />} />}/>
          </Routes>
      </BrowserRouter>
  );
}

export default App;
