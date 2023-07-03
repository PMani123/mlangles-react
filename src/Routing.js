import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Activation from "./Authentication/Activation";
import CheckinEmail from "./Authentication/CheckinEmail";
import Register from "./Authentication/Register";
import Resetpassword from "./Authentication/Resetpassword";
import Resetpasswordconfirm from "./Authentication/Resetpasswordconfirm";
import Sucessfully_Registered from "./Authentication/Sucessfully_Registered";
import MLselection from "./Pages/MLselection";
import Login from "./Authentication/Login";
import Activated from "./Authentication/Activated";

import Home from "./Pages/Home";
import Allprojects from "./Pages/Allprojects";
import Projectpipeline from "./Pages/Projects/Projectpipeline";
// import Pipes from "./Pages/Projects/Pipes";
import Pipes from "./Pages/Projects/Pipes"
import Allpipeline from "./Pages/Pipelines/Allpipeline";
import Allexperiments from "./Pages/Experiments/Allexperiments";
import Serving from "./Pages/Serving/Serving";
import CreateRun from "./Pages/Projects/CreateRun";
import Profile from "./User_management/Profile";
import UserManage from "./User_management/UserManage";
import RoleManage from "./Role_Management/RoleManage";
import AssignedProjects from "./Pages/AssignedProjects";
import Jupyter from "./Pages/Jupyter";
import Monitoring from "./Pages/Monitoring";
import Acceptproject from "./Authentication/Acceptproject";
import Settings from "./Pages/Settings";
import ExperimentTracking from "./Pages/Projects/ExperimentTracking";

const Routing = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/activated" element={<Activated />} />
        <Route path="/acceptProject/:project_id/:owner_id/:user_id" element={<Acceptproject />} />
        <Route path="/reset_password" element={<Resetpassword />} />
        <Route path="/checkinemail" element={<CheckinEmail />} />
        <Route path="/register_success" element={<Sucessfully_Registered />} />
        <Route path="/:User_id" element={<Resetpasswordconfirm />} />
        <Route path="activate/:uid/:token" element={<Activation />} />
        <Route path="/mlselect" element={<MLselection />} />
        <Route path="/home" element={<Home />} />
        <Route path="/projects" element={<Allprojects />} />
        <Route path="/assignedProjects" element={<AssignedProjects />} />
        <Route path="/Jupyter Notebook" element={<Jupyter />} />
        <Route path="/pipeline" element={<Allpipeline />} />
        <Route path="/experiments" element={<Allexperiments />} />
        <Route path="/serving" element={<Serving />} />
        <Route path="/projectpipeline/:path/:project_name/:project_id" element={<Projectpipeline />} />
        <Route path="/eachPipes/:path/:project_name/:project_id/:each_build/:experiment" element={<Pipes />} />
        <Route path="/createRun/:path/:project_name/:project_id" element={<CreateRun />} />
        <Route path="/experimentTracking/:path/:project_name/:project_id" element={<ExperimentTracking />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/usermanage" element={<UserManage />} />
        <Route path="/rolemanage/:createUser" element={<RoleManage />} />
        <Route path="/Monitoring" element={<Monitoring />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
};

export default Routing;
