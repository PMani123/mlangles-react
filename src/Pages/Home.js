import React, { useEffect, useState } from 'react'
import mllogo from "../logo/ml-logo.png"
import profilePic from "../logo/profile-pic.png"
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import "./home.css"
import EachPojectBox from '../Components/EachPojectBox'
import successIcon from "../logo/successIcon.png"
import failedIcon from "../logo/failedIcon.png"
import Mlsidebar from '../Components/Mlsidebar'
import notificationIcon from "../logo/notification-icon.png"
import mlimage from "../logo/mlangles360logo.png";
import Loading from '../Components/Loading';
import { Button, Collapse } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Sidebar } from 'primereact/sidebar';
import ViewDetailSideBar from './ViewDetailSideBar'
import Superuser from '../Components/Superuser';
import { backend_url, backend_url1 } from '../Config'
import Logout from './Logout';
import { Dialog } from 'primereact/dialog';

const Home = () => {
    const [open, setOpen] = useState(true);
    const [recentProject, setRecentProject] = useState([]);
    const [recentPipeline, setRecentPipeline] = useState([]);
    const [visibleRight, setVisibleRight] = useState(false);
    const [viewDetailData, setViewDetailData] = useState({});
    const [userDetails, setUserDetails] = useState({});
    const navigate = useNavigate();
    const [logout, setLogout] = useState(false);
    const [err, setErr] = useState("");

    const [updateData, setUpdateData] = useState({});
    const [shouldupdate, setShouldupdate] = useState(false);

    let path = window.location.href.split("/")[3];

    let token = JSON.parse(localStorage.getItem("mlanglesToken"));
    let Header = { headers: { "Authorization": `Bearer ${token}` } };


    function errorFun() {
        setTimeout(() => {
            setErr("");
        }, 4000)
    }

    async function allprojects() {
        try {
            async function fetchData() {
                const res = await axios.get(`${backend_url}/mlflow/recent_projects_all`, Header);
                if (res.data.success) {
                    setRecentProject(res.data.rec_projects);
                    try {
                        const pipe = await axios.get(`${backend_url}/mlflow/recent_experiments_pipelines`, Header);
                        setOpen(false);
                        if (pipe.data.success) {
                            setRecentPipeline(pipe.data.data);
                        } else {
                            setErr("Error in recent_experiments_pipelines");
                            errorFun();
                        }
                    } catch (e) {
                        setErr(e.message);
                        setOpen(false);
                        errorFun()
                    }
                } else {
                    setOpen(false);
                    setErr("Error in recent_projects_all");
                    errorFun();
                }
            }
            fetchData();
        }
        catch (e) {
            setErr(e.message);
            setOpen(false);
            errorFun();
        }
    }

    useEffect(() => {
        let token = JSON.parse(localStorage.getItem("mlanglesToken"));
        let userdetails = JSON.parse(localStorage.getItem("userDetails"));
        setUserDetails(userdetails);
        if (!token) {
            navigate("/");
        }
        allprojects();
    }, []);



    async function editProjectName(data) {
        try {
            setOpen(true)
            const edit = await axios.put(`${backend_url}/mlflow/edit_project/${data.projectId}`, { "project_name": data.projectName }, Header);
            window.location.reload(false);
            if (edit.data.success) {
                // //console.log("edit response------", edit);
                const edit_git = await axios.put(`${backend_url}/mlflow/edit_git/${data.projectId}`, edit.data.project_id_for_edit[0], Header);
                if (edit_git.data.success) {
                    allprojects();
                }
            } else {
                allprojects();
            }
        }
        catch (e) {
            console.log("error", e);
            setErr(e.message);
            setOpen(false);
        }
    }

    async function deletingProject(data) {
        try {
            setOpen(true);
            let ans = { data: { "project_id": data } };
            let deleteData = { "project_id": data };
            // const res = await axios.delete(`${backend_url}/mlflow/projects`,  Header, ans );
            const res = await axios.delete(`${backend_url}/mlflow/projects`, { data: { "project_id": data }, headers: { "Authorization": `Bearer ${token}` } });
            //console.log("deleted project is ", res);
            if (res.data.success) {
                allprojects();
            }
        }
        catch (e) {
            console.log("error", e);
            setErr(e.message);
            setOpen(false);
            errorFun();
        }
    }

    function rowclicked(data) {
        navigate(`${data}`)
    }

    function viewingtab(data) {
        setVisibleRight(true);
    }

    function closedetails(data) {
        setVisibleRight(false)
    }

    async function dataFromViewBtn(data) {
        //console.log(data);
        try {
            setOpen(true);
            const res = await axios.post(`${backend_url}/mlflow/view_details`, { "project_id": data }, Header);
            setOpen(false);
            if (res.data.success) {
                setViewDetailData(res.data)
            } else {
                setErr("Error in posting data in view_details");
                errorFun();
            }
        } catch (e) {
            setErr(e.message);
            setOpen(false);
            errorFun()
        }
    }

    function updating(data) {
        console.log("data------", data);
        setUpdateData(data);
        setShouldupdate(true);
    }

    return (
        <div className="home dashboard">
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
                        <h4 className='capitailze'>{userDetails?.user_full_name} workspace / </h4><span> Home</span>
                    </div>
                    <Superuser logoutClicked={() => { setLogout(true) }} />

                </div>
            </header>

            <Dialog className="logout-dialogbox" visible={logout} style={{ width: '30vw' }} onHide={() => setLogout(false)}>
                <Logout no={() => setLogout(false)} />
            </Dialog>

            {
                visibleRight ? <ViewDetailSideBar viewOpen={visibleRight} viewClose={closedetails} allData={viewDetailData} /> : <></>
            }

            <Mlsidebar data={path} />

            <section className='middlepart'>

                {/* <button onClick={(e) => setOpen1(!open1)}>Submit</button>
                <Collapse in={open1} >
                    <h2>hello world</h2>
                </Collapse> */}
                <div className="padding-inside">

                    {err ? <div className='d-flex align-items-center justify-content-center'>
                        <h4 className='error-message'>{err}</h4>
                    </div> : <></>
                    }

                    <div>
                        <div className='d-flex recenthome align-items-center'>
                            <h4 className='green'>RECENT PROJECTS</h4>
                            <Link to="/projects" ><p>VIEW ALL</p></Link>
                        </div>
                        <div className='d-flex flex-wrap gap50'>
                            {
                                recentProject?.map((data, idx) => {
                                    return (
                                        <EachPojectBox value={data} index={idx} key={idx} editing={updating} viewData={dataFromViewBtn} viewdetails={viewingtab} forDelete={deletingProject} forRename={editProjectName} />
                                    )
                                })}
                        </div>
                    </div>

                    <div className='secondtable'>
                        <div className='d-flex recenthome align-items-center'>
                            <h4 className='green'>RECENT PIPELINES / EXPERIMENTS TRACKING</h4>
                            {/* <Link to="/pipeline"><p>VIEW ALL</p></Link> */}
                        </div>
                        <table width="100%" className='hometable nonitolight'>
                            <thead className='nonitolight' style={{ fontWeight: "100" }}>
                                <tr className='nonitolight'>
                                    <td className='pad-left40'>TYPE</td>
                                    <td>PROJECT NAME </td>
                                    <td>PIPELINE / EXPERIMENT TRACKING</td>
                                    <td>CREATED BY </td>
                                    <td>CREATED AT </td>
                                    <td>STATUS</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    recentPipeline?.map((data, idx) => {
                                        let newDate = new Date(Number(data.created_at)).toLocaleString(undefined, { timeZone: "Asia/Kolkata" });
                                        return (
                                            <tr key={idx}
                                            // onClick={() => rowclicked(`/eachPipes/Projects/${project_name}/${project_id}/${each_build}/false`)} 
                                            >
                                                <td className='pad-left40'>{data.type}</td>
                                                <td>{data.project}</td>
                                                <td>{data.exp_pip}</td>
                                                <td>{data.created_by}</td>
                                                <td>{newDate}</td>
                                                {
                                                    ["FINISHED", "SUCCESS"].includes(data?.status?.toUpperCase()) ?
                                                        <td className='green'>Success</td> :
                                                        <></>
                                                }
                                                {
                                                    ["FAILED", "FAILURE"].includes(data?.status?.toUpperCase()) ?
                                                        <td className='red'>Failed</td> : <></>
                                                }
                                                {(["RUNNING", "", "UNFINISHED"].includes(data?.status?.toUpperCase()) || !data?.status) ?
                                                    <td className='blue'>Running...</td> : <></>
                                                }
                                            </tr>
                                        )
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home;