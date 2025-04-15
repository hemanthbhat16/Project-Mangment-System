import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./components/Login";
import Registration from "./components/Registration";
import Welcome from "./components/Welcome";
import ProjectManagement from "./components/ProjectManagement";
import TaskManagement from "./components/TaskManagement";
import CollaborationManagement from "./components/CollaborationManagement";
import ReportingAnalytics from "./components/ReportingAnalytics";
import MainLayout from "./components/MainLayout";

function App()
{
  return(
    <Router>
      <Routes>
        <Route path = "/register" element = {<Registration/>}/>
        <Route path="/" element = {<Login/>}/>
        <Route path = "/welcome" element = {<Welcome/>}/>
        <Route path="/login" element={<Login />} />
        <Route path = "/project-management"  element = {<ProjectManagement/>}/>
        <Route path = "/task-management"  element = {<TaskManagement/>}/>
        <Route path = "/collaboration-management"  element = {<CollaborationManagement/>}/>
        <Route path = "/reporting-analytics"  element = {<ReportingAnalytics/>}/>
      </Routes>
    </Router>
  );
}

export default App;