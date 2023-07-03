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
import Superuser from '../Components/Superuser'
import { backend_url, backend_url1 } from '../Config'
import Logout from './Logout'

const Allprojects = () => {
    const [viewDetailData, setViewDetailData] = useState({});
    const [name, setName] = useState("");
    const [des, setDes] = useState("");
    const [err, setErr] = useState("");
    const [open, setOpen] = useState(true);
    const [firstpro, setFirstpro] = useState([]);
    let [projects, setProjects] = useState([]);
    const [visibleRight, setVisibleRight] = useState(false);
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState({});
    const [visible, setVisible] = useState(false);
    const [logout, setLogout] = useState(false);
    const [leftDes, setLeftDes] = useState(0);
    const [seachingInp, setSearchingInp] = useState("");
    const [updateData, setUpdateData] = useState({});
    const [shouldupdate, setShouldupdate] = useState(false);
    const [editChange, setEditChange] = useState(false);
    const [proIdUpdate, setProIdUpdate] = useState("");

    let token = JSON.parse(localStorage.getItem("mlanglesToken"));
    let Header = { headers: { "Authorization": `Bearer ${token}` } };

    let path = window?.location?.href?.split("/")[3];

    function errorFun() {
        setTimeout(() => {
            setErr("");
        }, 4000);
    }

    async function allprojects() {
        try {
            setOpen(true);
            const allProjects = await axios.get(`${backend_url}/mlflow/projects`, Header);
            if (allProjects.data.success) {
                setOpen(false);
                setProjects(allProjects.data.data);
                setFirstpro(allProjects.data.data);
                setShow(true);
            }
        }
        catch (e) {
            // console.log("error", e);
            setOpen(false);
            setErr(e.message);
            errorFun();
        }
    }

    useEffect(() => {
        let token = JSON.parse(localStorage.getItem("mlanglesToken"));
        let userdetails = JSON.parse(localStorage.getItem("userDetails"));
        setUserDetails(userdetails);

        if (userdetails) {

            if (!token || userDetails?.permissions?.projects_admin === 0) {
                navigate("/");
            }
            fetchData()
        }
    }, []);

    async function fetchData() {
        try {
            setOpen(true)
            allprojects()
        }
        catch (e) {
            console.log("error --", e);
            setOpen(false);
            setErr(e.message);
            errorFun();
        }
    }

    async function editProjectName(data) {
        //console.log("edit data", data);
        try {
            setOpen(true);
            setUpdateData(data);
            setShouldupdate(false);
            const edit = await axios.put(`${backend_url}/mlflow/edit_project/${data.projectId}`, { "project_name": data.projectName }, Header);
            window.location.reload(false);

            allprojects();
            setProIdUpdate(data.projectId);
        }
        catch (e) {
            console.log("error", e);
            setOpen(false);
            setErr(e.message);
            errorFun();
        }
    }

    async function deletingProject(data) {
        try {
            setOpen(true);
            //console.log("data ----- delete ----", data);
            let ans = { data: { project_id: data } }
            // const res = await axios.delete(`${backend_url}/mlflow/projects`, Header, ans.data);
            const res = await axios.delete(`${backend_url}/mlflow/projects`, { headers: { "Authorization": `Bearer ${token}` }, data: { project_id: data } });
            //console.log("deleted project is ", res);
            if (res.data.success) {
                allprojects();
            } else {
                setErr("Error in Deleting the projects");
                errorFun();
            }
        }
        catch (e) {
            console.log("error", e);
            setErr(e.message);
            setOpen(false);
            errorFun();
        }
    }

    async function submitForm(e) {
        try {
            e.preventDefault();
            //console.log(name, des);
            setOpen(true);
            if (des.length > 2000) {
                setOpen(false);
                errorFun();
            } else {
                setSearchingInp("");
                const res = await axios.post(
                    `${backend_url}/mlflow/create_new_project`,
                    {
                        project_name: name,
                        project_description: des,
                    }, Header
                );
                if (res.data.success) {
                    setName("");
                    setDes("");
                    allprojects();
                    setVisible(false);
                } else {
                    setVisible(false);
                    setOpen(false);
                    setErr("*" + res.data.message);
                    setName("");
                    errorFun();
                    console.log("message ----", "*" + res.data.message);
                }
            }
        }
        catch (err) {
            setOpen(false);
            setErr(err.message);
            errorFun();
        }

    }

    function searchInput(e) {
        let search = e.target.value.toLowerCase();
        let newArray = [];
        setSearchingInp(e.target.value);
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
        try {
            setOpen(true);
            const res = await axios.post(`${backend_url}/mlflow/view_details`, { "project_id": data }, Header);
            if (res.data.success) {
                setViewDetailData(res.data);
            } else {
                setErr("Error in view Details");
            }
            setOpen(false);
        }
        catch (e) {
            setOpen(false);
            setErr(e.message);
        }
    }

    function setingDes(data) {
        if (data.length <= 2000) {
            setDes(data);
            setLeftDes(data.length);
        } else {
            let newData = data.slice(0, 2000);
            setDes(newData);
            setLeftDes(newData.length);
        }
    }

    function updating(data) {
        console.log("data------", data);
        setUpdateData(data);
        setShouldupdate(true);
    }

    async function updateEdit() {
        if (shouldupdate) {
            console.log("updating editng  cbj", updateData);
            editProjectName(updateData);
        }
    }

    function parentValue(data) {
        setUpdateData(data);
    }

    return (
        <div className='allProjectspage' onClick={() => updateEdit()}>
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
                visibleRight ? <ViewDetailSideBar viewOpen={visibleRight} viewClose={closedetails} allData={viewDetailData} /> : <></>
            }

            <Mlsidebar data={path} />

            <Dialog visible={visible} style={{ width: '30vw' }} onHide={() => { setVisible(false); setName(""); setDes(""); setLeftDes(0) }}>
                <form onSubmit={submitForm}>
                    <div>
                        <div className='text-center dialogAllprojects'>
                            <input autoComplete="off" type="text" required onChange={(e) => setName(e.target.value)} value={name} placeholder='Project Name' />
                        </div>
                        <div className='text-center dialogAllprojects'>
                            <textarea rows="10" cols="40" type="text" onChange={(e) => { setingDes(e.target.value); }} value={des} placeholder='Description'> </textarea>
                        </div>
                        <div className='leftnumber dialogAllprojects'>
                            <p className='white '>Character Left - {leftDes} / 2000 </p>
                        </div>
                        <div className='text-center dialogAllprojects'>
                            <button type='submit' >Create Project</button>
                        </div>
                    </div>
                </form>
            </Dialog>

            <section className='middlepart allprojects dashboard'>
                <div className="each-pipehead">
                    <div className='d-flex justify-content-between mar-right25 pad12'>
                        <div className="d-flex align-items-center">
                            <h6 className='head green mypro' >MY PROJECTS</h6>
                            <Link to="/assignedProjects" ><h6 className='head assignpro'>ASSIGNED PROJECTS</h6></Link>
                        </div>
                        <div className='d-flex'>
                            <div className="posrel">
                                <input autoComplete="off" type="text" value={seachingInp} placeholder='Search Your Project' className='searchinput' onChange={(e) => searchInput(e)} /> <img src={searchIcon} alt="" className='searchIcon' />
                            </div>
                            <button className='createbtn commonbtn marRight64' onClick={() => setVisible(true)}> <img src={plus} alt="plus" className='plus' /> New Project</button>
                        </div>
                    </div>
                </div>

                <div className="padTop40">
                    {err ?
                        <div className='d-flex align-items-center justify-content-center'>
                            <h4 className='error-message'>{err}</h4>
                            {/* <h4 className='error-message'>nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn</h4> */}
                        </div> : <></>
                    }

                    <>
                        {
                            show ?
                                <>
                                    {projects?.length !== 0 ?
                                        <div>
                                            <div className="d-flex flex-wrap w100 pad24">
                                                {
                                                    projects?.map((data, idx) => {
                                                        return (
                                                            <EachPojectBox key={idx} proId={proIdUpdate} updateParent={parentValue} initialEdit={editChange} editing={updating} value={data} index={idx} viewData={dataFromViewBtn} viewdetails={viewingtab} forDelete={deletingProject} forRename={editProjectName} />
                                                        )
                                                    })}
                                            </div>

                                            {/* <div className='d-flex justify-content-center mt-4'>
                                                    <button className='loadmore'>Load More</button>
                                                </div> */}

                                        </div>
                                        :
                                        <div className='noprojects'>
                                            <div className='text-center'>
                                                <h4>No projects created</h4>
                                                <button onClick={() => setVisible(true)} >Create Project</button>
                                            </div>
                                        </div>
                                    }
                                </> :
                                <>

                                </>
                        }
                    </>
                </div>
            </section>
        </div >
    )
}

export default Allprojects;