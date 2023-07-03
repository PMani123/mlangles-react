import React, { useEffect, useState } from 'react'
import Mlsidebar from '../Components/Mlsidebar'
import mllogo from "../logo/ml-logo.png"
import profilePic from "../logo/profile-pic.png"
import { Link, useNavigate, useParams } from 'react-router-dom'
import EachPojectBox from '../Components/EachPojectBox'
import mlimage from "../logo/mlangles360logo.png"
import { Dialog } from 'primereact/dialog';
import axios from 'axios'
import Loading from '../Components/Loading';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Sidebar } from 'primereact/sidebar';
import ViewDetailSideBar from './ViewDetailSideBar';
import searchIcon from "../logo/searchIcon.png";
import plus from "../logo/plus.png";
import filter from "../logo/filter.png";
import Superuser from '../Components/Superuser';
import { backend_url } from '../Config'
import Logout from './Logout'

const AssignedProjects = () => {
    const [viewDetailData, setViewDetailData] = useState({});
    const [name, setName] = useState("");
    const [des, setDes] = useState("");
    const [err, setErr] = useState("");
    const [open, setOpen] = useState(true);
    const [firstpro, setFirstpro] = useState([]);
    let [projects, setProjects] = useState([]);
    const [visibleRight, setVisibleRight] = useState(false);
    const [show, setShow] = useState(false);
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState({});
    const [logout, setLogout] = useState(false);
    const [proIdUpdate, setProIdUpdate] = useState("");
    const [assign, setAssign] = useState(false);

    let path = "projects";

    let token = JSON.parse(localStorage.getItem("mlanglesToken"));
    let Header = { headers: { "Authorization": `Bearer ${token}` } };

    async function assignedProjects() {
        try {
            setOpen(true);
            const assignedProjects = await axios.get(`${backend_url}/mlflow/showAssignedProjects`, Header);
            //console.log("assignedProjects", assignedProjects);
            if (assignedProjects.data.success) {
                setOpen(false);
                // console.log(assignedProjects.data)
                setProjects(assignedProjects.data.user_created_projects);
                setFirstpro(assignedProjects.data.user_created_projects);
                setShow(true);
            }
        }
        catch (e) {
            console.log("error", e);
        }
    }

    useEffect(() => {
        let token = JSON.parse(localStorage.getItem("mlanglesToken"));
        let userdetails = JSON.parse(localStorage.getItem("userDetails"));
        setUserDetails(userdetails);
        setAssign(true);

        if (userdetails) {
            if (!token || userDetails?.permissions?.projects_admin === 0) {
                navigate("/");
            }
            async function fetchData() {
                try {
                    setOpen(true)
                    assignedProjects()
                }
                catch (e) {
                    console.log("error --", e);
                }
            }
            fetchData()
        }
    }, []);

    async function editProjectName(data) {
        console.log("edit data---", data);
        try {
            setOpen(true)
            const edit = await axios.put(`${backend_url}/mlflow/edit_project/${data.projectId}`, { "project_name": data.projectName }, Header);
            window.location.reload(false);
            assignedProjects();
            setProIdUpdate(data.projectId);
        }
        catch (e) {
            console.log("error", e);
        }
    }

    async function deletingProject(data) {
        try {
            setOpen(true);
            //console.log("data ----- delete ----", data);
            let ans = { data: { project_id: data } }
            const res = await axios.delete(`${backend_url}/mlflow/projects`, Header, ans);
            //console.log("deleted project is ", res);
            if (res.data.success) {
                assignedProjects();
            }
        }
        catch (e) {
            console.log("error", e);
        }
    }

    async function submitForm(e) {
        e.preventDefault();
        //console.log(name, des);
        setOpen(true)
        const res = await axios.post(
            `${backend_url}/mlflow/create_new_project`,
            {
                project_name: name,
                project_description: des,
            }, Header
        );
        //console.log("res----", res);
        if (res.data.success) {
            setName("");
            setDes("");
            assignedProjects();
            setVisible(false);
        } else {
            setErr("*" + res.data.message);
            setName("");
            setTimeout(() => {
                setErr("");
            }, 4000);
        }
    }

    function searchInput(e) {
        let search = e.target.value.toLowerCase();
        let newArray = [];
        for (let i = 0; i < firstpro.length; i++) {
            if (firstpro[i].project_name.toLowerCase().includes(search)) {
                newArray.push(firstpro[i]);
            }
        }
        if (search.length === 0) {
            setProjects(firstpro);
        } else {
            setProjects(newArray);
        }
    }

    function viewingtab(data) {
        setVisibleRight(data)
    }

    function closedetails(data) {
        setVisibleRight(false)
    }

    async function dataFromViewBtn(data) {
        //console.log(data);
        setOpen(true);
        const res = await axios.post(`${backend_url}/mlflow/view_details`, { "project_id": data }, Header);
        if (res.data.success) {
            setViewDetailData(res.data)
        }
        setOpen(false);
    }

    return (
        <div>
            <Loading loading={open} />
            <header>
                <div className='d-flex align-items-center justify-content-between' >
                    <div className="d-flex align-items-center">
                        <div className='logohover'>
                            <div className='mllogo'>
                                <img src={mllogo} alt="mlangles logo" />
                            </div>
                            <div className="newlogo">
                                <img src={mlimage} className='newlogos' alt="" />
                            </div>
                        </div>
                        <Link to="/Home"><h4 className='capitailze'>{userDetails?.user_full_name} workspace / </h4> </Link><span> Projects</span>
                    </div>
                    <Superuser logoutClicked={() => { setLogout(true) }} />

                </div>
            </header>

            <Dialog className="logout-dialogbox" visible={logout} style={{ width: '30vw' }} onHide={() => setLogout(false)}>
                <Logout no={() => setLogout(false)} />
            </Dialog>

            {
                visibleRight ? <ViewDetailSideBar viewOpen={visibleRight} viewClose={closedetails} allData={viewDetailData} assign={assign} /> : <></>
            }

            <Mlsidebar data={path} />
            {/* <Dialog visible={visible} style={{ width: '30vw' }} onHide={() => setVisible(false)}>
                <form onSubmit={submitForm}>
                    <div>
                        <div className='text-center dialogAllprojects'>
                            <input type="text" required onChange={(e) => setName(e.target.value)} value={name} placeholder='Project Name' />
                        </div>
                        <div className='text-center dialogAllprojects'>
                            <textarea rows="10" cols="40" type="text" onChange={(e) => setDes(e.target.value)} value={des} placeholder='Description'> </textarea>
                        </div>
                        <div className='text-center dialogAllprojects'>
                            <button type='submit' >Create Project</button>
                        </div>
                    </div>
                </form>
            </Dialog> */}
            <section className='middlepart allprojects dashboard'>

                <div className="each-pipehead">
                    <div className='d-flex justify-content-between mar-right25 pad12'>
                        <div className="d-flex align-items-center">
                            <Link to="/Projects" > <h6 className='head  mypro' >MY PROJECTS</h6></Link>
                            <h6 className='head assignpro green' >ASSIGNED PROJECTS</h6>
                        </div>
                        <div className='posrel'>
                            <input autoComplete="off" type="text" placeholder='Search Your Project' className='searchinput marright100' onChange={(e) => searchInput(e)} /> <img src={searchIcon} alt="" className='searchIconAss' />
                            {/* <button className='createbtn' onClick={() => setVisible(true)}> <img src={plus} alt="plus" className='plus' /> New Project</button> */}
                        </div>
                    </div>
                </div>

                <div className='d-flex align-items-center justify-content-center'>
                    <h4 className='error-message'>{err}</h4>
                </div>
                <>
                    {
                        show ?
                            <>
                                {
                                    projects?.length !== 0 ?
                                        <div>
                                            <div className="d-flex flex-wrap w100 mt-3 pad24">
                                                {projects?.map((data, idx) => {
                                                    return (
                                                        <EachPojectBox key={idx} proId={proIdUpdate} value={data} viewData={dataFromViewBtn} viewdetails={viewingtab} index={idx} forDelete={deletingProject} forRename={editProjectName} />
                                                    )
                                                })}
                                            </div>

                                        </div>
                                        :
                                        <div className='noprojects'>
                                            <div className='text-center'>
                                                <h4>No projects Assigned to you</h4>
                                                {/* <button onClick={() => setVisible(true)} >Create Project</button> */}
                                            </div>
                                        </div>
                                }
                            </> :
                            <>
                            </>
                    }
                </>

            </section>
        </div>
    )
}

export default AssignedProjects;