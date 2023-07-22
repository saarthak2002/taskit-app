import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import CreateProject from './components/CreateProject';
import ProjectDetails from './components/ProjectDetails';
import Projects from './components/Projects';
import Profile from './components/Profile';
import SideNav from './components/SideNav';
import Unauthorized from './components/Unauthorized';

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
            <Route path="/projects" element={<SideNav componentToDisplay={<Projects />} />}/>
            <Route path="/profile" element={<SideNav componentToDisplay={<Profile />} />}/>
            <Route path="/unauthorized" element={<Unauthorized />}/>
          </Routes>
      </BrowserRouter>
  );
}

export default App;
