import React, { useEffect, useState } from 'react'
import Mlsidebar from '../../Components/Mlsidebar'
import { Link, useNavigate, useParams } from 'react-router-dom'
import mllogo from "../../logo/ml-logo.png"
import mlimage from "../../logo/mlangles360logo.png";
import profilePic from "../../logo/profile-pic.png"
import { TabView, TabPanel } from 'primereact/tabview';
import github from '../../logo/github.png'
import ProjectTable from './ProjectTable'
import ExperimentTracking from './ExperimentTracking'
import axios from 'axios'
import Loading from '../../Components/Loading'
import filter from "../../logo/filter.png";
import clearFilter from "../../logo/clear_filter.png";
import plus from "../../logo/plus.png";
import deleteIcon from "../../logo/deleteIcon.png";
import Superuser from '../../Components/Superuser'
import { backend_url, backend_url1 } from '../../Config'
import { Dialog } from 'primereact/dialog';
import Logout from '../Logout'

const Projectpipeline = () => {
    const { path, project_name, project_id } = useParams();
    const [inputData, setInputData] = useState("");
    const [totalBuilds, setTotalBuilds] = useState([]);
    const [edit, setEdit] = useState(false)
    const [open, setOpen] = useState(true);
    const navigate = useNavigate();
    const [createdBy, setCreatedBy] = useState(false);
    const [status, setStatus] = useState(false);
    const [user, setUser] = useState([]);
    const [initialData, setInitialData] = useState([]);
    const [initialUser, setInitialUser] = useState([]);
    const [searchCreated, setSearchCreated] = useState("");
    const [err, setErr] = useState("");
    const [userDetails, setUserDetails] = useState({});
    const [logout, setLogout] = useState(false);

    let token = JSON.parse(localStorage.getItem("mlanglesToken"));
    let Header = { headers: { "Authorization": `Bearer ${token}` } };

    function rowclicked(data) {
        navigate(`${data}`)
    }

    function errorFun() {
        setTimeout(() => {
            setErr("");
        }, 4000)
    }

    async function fetchData() {
        try {
            setOpen(true)
            const res = await axios.post(`${backend_url}/pipeline/get_git_url`, { "project_id": project_id }, Header);
            setOpen(false)
            if (res.data.success) {
                setInputData(res.data.git_hub_url);
                setEdit(true);
                setOpen(true)
                let totalBuildList = await axios.get(`${backend_url}/pipeline/total_build_list/${project_id}`, Header);

                // totalBuildList =
                // {
                //     "data":
                //     {
                //         "success": true,
                //         "message": "success",
                //         "data": [
                //             {
                //                 "build": "gold #1",
                //                 "result": "SUCCESS",
                //                 "created_at": 1682062364681,
                //                 "pipeline_duration": 8685,
                //                 "created_by": "Hari"
                //             },
                //             {
                //                 "build": "gold #2",
                //                 "result": "SUCCESS",
                //                 "created_at": 1682414639677,
                //                 "pipeline_duration": 102555555555555599932,
                //                 "created_by": "mani"
                //             },
                //             {
                //                 "build": "gold #2",
                //                 "result": "FAILED",
                //                 "created_at": 1682414639677,
                //                 "pipeline_duration": 102555555555555599932,
                //                 "created_by": "manu"
                //             },
                //             {
                //                 "build": "gold #2",
                //                 "result": "RUNNING",
                //                 "created_at": 1682414639677,
                //                 "pipeline_duration": 102555555555555599932,
                //                 "created_by": "mass"
                //             }
                //         ]
                //     }
                // }

                setOpen(false);
                if (totalBuildList.data.success) {
                    let uniqueUser = new Set();
                    let data1 = totalBuildList.data.data;
                    for (let i = 0; i < data1.length; i++) {
                        uniqueUser.add(data1[i].created_by);
                    }
                    let new1 = Array.from(uniqueUser);
                    setUser(new1);
                    setInitialUser(new1);
                    setTotalBuilds(totalBuildList.data.data);
                    setInitialData(totalBuildList.data.data);
                } else {
                    setErr("Error Occured");
                    errorFun();
                }
            }
        }
        catch (e) {
            console.log("error--", e);
            setErr(e.message);
            setOpen(false);
            errorFun();
        }
    }

    useEffect(() => {
        let token = JSON.parse(localStorage.getItem("mlanglesToken"));
        let userdetails = JSON.parse(localStorage.getItem("userDetails"));
        setUserDetails(userdetails);
        if (userdetails) {
            if (!token || userDetails?.permissions?.is_pipeline === 0) {
                navigate("/");
            }
            fetchData();
        }
    }, [])

    async function buildOrRun() {
        try {
            setOpen(true);
            const totalBuildList = await axios.get(`${backend_url}/pipeline/total_build_list/${project_id}`, Header);
            setOpen(false);
            //console.log("totalBuildList---", totalBuildList)
            if (totalBuildList.data.success) {
                setTotalBuilds(totalBuildList.data.data);
                let newData = totalBuildList.data.data;
                let lastData = newData[0];
                let each = lastData?.build?.split("#");
                let each_build = each[1];

                if (!newData[0].result) {
                    // setOpen(false);
                    navigate(`/eachPipes/Projects/${project_name}/${project_id}/${each_build}/false`)
                } else {
                    // setOpen(false);
                    navigate(`/eachPipes/Projects/${project_name}/${project_id}/${each_build}/false`)
                }
            } else {
                setErr("Error occured in getting total_build_list");
                errorFun();
            }
        }
        catch (e) {
            console.log("There is an Error--", e);
            setOpen(false);
            setErr(e.message);
            errorFun();
        }
    }

    async function gitSubmit(e) {
        try {
            e.preventDefault();
            setOpen(true);

            if (!edit) {
                const giturlSubmit = await axios.post(`${backend_url}/pipeline/create_jenkins_pipeline/${project_id}`, {
                    "git_link": inputData,
                    "project_id": project_id
                }, Header);
                //console.log("giturlSubmit---", giturlSubmit);
                // setOpen(false);
                if (giturlSubmit.data.success) {
                    //console.log("success")
                    setTimeout(() => {
                        buildOrRun();
                    }, 10000)
                } else {
                    setErr(giturlSubmit.data.message);
                    setOpen(false);
                    errorFun();
                }
            } else {
                setOpen(true)
                const runBuild = await axios.post(`${backend_url}/pipeline/run_build`, { "project_name": project_name }, Header);
                //console.log("runBuild--", runBuild);
                if (runBuild.data.success) {
                    //console.log("settimeout");
                    setOpen(true);
                    setTimeout(() => {
                        buildOrRun();
                    }, 8000)
                }
            }
        }
        catch (e) {
            console.log("There is an error--", e);
            setOpen(false);
            setErr(e.message);
            errorFun();
        }
    }

    function filterCreatedBy() {
        toggle();
        if (createdBy) {
            setCreatedBy(!createdBy)
        }
        let selected = [];
        var eachcheckcreatedby = document.getElementsByClassName("eachcheckcreatedby");
        for (let i = 0; i < eachcheckcreatedby.length; i++) {
            if (eachcheckcreatedby[i].checked) {
                selected.push(eachcheckcreatedby[i].name)
            }
        }
        let newData = [];
        for (let i = 0; i < initialData.length; i++) {
            if (selected.includes(initialData[i].created_by?.toLowerCase())) {
                newData.push(initialData[i])
            }
        }
        if (selected.length === 0) {
            setTotalBuilds(initialData);
        } else {
            setTotalBuilds(newData);
        }
        setSearchCreated("");
        setUser(initialUser);
    }

    function filterStatus() {
        toggle();

        if (status) {
            setStatus(!status);
        }
        let selected = [];
        var eachcheckstatus = document.getElementsByClassName("eachcheckstatus");
        for (let i = 0; i < eachcheckstatus.length; i++) {
            if (eachcheckstatus[i].checked) {
                if (eachcheckstatus[i].name === "failed") {
                    selected.push("failed", "failure");
                } else if (eachcheckstatus[i].name === "running") {
                    selected.push("running", "unfinished")
                } else {
                    selected.push(eachcheckstatus[i].name)
                }
            }
        }

        let newData = [];
        for (let i = 0; i < initialData.length; i++) {
            if (["RUNNING", "UNFINISHED", " ", "null"].includes(initialData[i]?.status)) {
                newData.push(initialData[i]);
            } else {
                if (selected.includes(initialData[i]?.status?.toLowerCase())) {
                    newData.push(initialData[i]);
                }
            }
        }
        if (selected.length === 0) {
            setTotalBuilds(initialData);
        } else {
            setTotalBuilds(newData);
        }
    }

    function searchCreating(e) {
        let data = e.target.value?.toLowerCase();
        setSearchCreated(data);
        let newData = [];
        for (let i = 0; i < initialUser.length; i++) {
            if (initialUser[i]?.toLowerCase().includes(data)) {
                newData.push(initialUser[i]);
            }
        }
        setUser(newData);
    }

    async function deleteFunction() {
        try {
            let eachCheck = document.getElementsByClassName("eachcheckbox");
            let deleteData = [];
            for (let i of eachCheck) {
                if (i.checked) {
                    // checkboxparent.checked = false;
                    console.log(i);
                    console.log(i.target);
                    console.log(i.value);
                    console.log(i.className);
                    let spliting = i?.value?.split("-");
                    deleteData.push({
                        "project_id": Number(spliting[0]),
                        "build_id": Number(spliting[1])
                    })
                }
            }
            console.log("deletData ----------", { "project": deleteData });
            if (deleteData.length > 0) {
                setOpen(true);
                const deletingPipeline = await axios.delete(`${backend_url}/pipeline/delete_pipeline_builds`, { data: { "project": deleteData }, headers: { "Authorization": `Bearer ${token}` } });
                if (deletingPipeline.data.success) {
                    setOpen(false);
                } else {
                    setOpen(false);
                }
                for (let i of eachCheck) {
                    if (i.checked) {
                        i.checked = false;
                    }
                }
                let checkboxparent = document.getElementsByClassName("checkboxparent")[0];
                checkboxparent.checked = false;
                fetchData();
            }
        }
        catch (e) {
            console.log("There is an Error--", e);
            setOpen(false);
            setErr(e.message);
            errorFun();
        }
    }

    function changecheckBoxParent(e) {
        let checkboxparent = document.getElementsByClassName("checkboxparent")[0];
        let eachCheck = document.getElementsByClassName("eachcheckbox");

        if (checkboxparent.checked) {
            for (let i = 0; i < eachCheck.length; i++) {
                eachCheck[i].checked = true;
            }
        } else {
            for (let i = 0; i < eachCheck.length; i++) {
                eachCheck[i].checked = false;
            }
        }
    }

    function checkBoxEach(e) {
        //console.log(e)
        let checkboxparent = document.getElementsByClassName("checkboxparent")[0];
        let eachCheck = document.getElementsByClassName("eachcheckbox");
        for (let i of eachCheck) {
            if (!i.checked) {
                checkboxparent.checked = false;
            }
        }
    }

    function uncheckAll() {
        const checkboxAll = document.querySelectorAll("[type=checkbox]");
        // console.log("checkboxAll-------", checkboxAll);
        for (let i of checkboxAll) {
            console.log(i);
            if (i.checked) {
                // console.log("checked already");
                i.checked = false;
            }
        }
    }

    function toggle() {
        const toggleDropdown = document.getElementsByClassName("dropdown-menu");
        console.log("toggleDropdown----", toggleDropdown);
        for (let i of toggleDropdown) {
            console.log(i);
            i.classList.remove("show");
        }
        // toggleDropdown.classList.remove("show");
    }

    function clearing() {
        setSearchCreated("");
        uncheckAll();
        filterCreatedBy();
    }

    return (
        <div>
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
                        <Link to="/Home"><h4 className='capitailze'>{userDetails?.user_full_name} workspace / </h4> </Link> <Link to="/Projects" ><span> Projects /</span></Link> <span className='capitailze'>{project_name} Pipeline</span>
                    </div>
                    <Superuser logoutClicked={() => { setLogout(true) }} />

                </div>
            </header>

            <Dialog className="logout-dialogbox" visible={logout} style={{ width: '30vw' }} onHide={() => setLogout(false)}>
                <Logout no={() => setLogout(false)} />
            </Dialog>

            <Loading loading={open} />

            <Mlsidebar data={path} />

            <div className="middlepart">
                <div className="card">

                    <div className="each-pipehead">
                        <div className='d-flex align-items-center justify-content-between mar-right25 pad12 he56'>
                            <div className="d-flex align-items-center">
                                <h6 className='head green mypro cursor' >PIPELINES</h6>
                                <Link to={`/experimentTracking/${path}/${project_name}/${project_id}`}><h6 className="head assignpro cursor" >EXPERIMENT TRACKING</h6></Link>
                            </div>
                            {/* <div>
                                <Link to="/serving"><button className='goto-serv'>Go to Serving</button></Link>
                            </div> */}
                        </div>
                    </div>

                    <div className='d-flex align-items-center justify-content-center'>
                        <h4 className='error-message'>{err}</h4>
                    </div>

                    {/* pipeline */}
                    <div className="d-flex justify-content-center align-items-center">
                        <div className="width90">
                            <div className='d-flex align-items-center justify-content-center'>
                                <h4 className='error-message'>{err}</h4>
                            </div>
                            <form onSubmit={gitSubmit}>
                                <div className='d-flex w100 align-items-center pipelinebox justify-content-between posrel'>
                                    <div className='w70 d-flex align-items-center'>
                                        <input autoComplete="off" type="text" required disabled={edit ? true : false} value={inputData} onChange={(e) => { setInputData(e.target.value) }} className='inputpipeline' placeholder='Provide your Github URL here...' /> <a target="_blank" href="https://github.com/"><img src={github} alt="" className='github' /></a>
                                    </div>
                                    <div className="git">
                                        <p className='samplelook '>
                                            Hey Take a look in github...
                                        </p>
                                    </div>
                                    <button type='submit' className='pipelinebtn commonbtn'> <img src={plus} className='plus' alt="" /> New Pipeline</button>
                                </div>
                            </form>

                            <div className="d-flex justify-content-end martop32">
                                <div className='commonbtn' onClick={() => { clearing(); setTotalBuilds(initialData); }} >
                                    <img src={clearFilter} className='filter' alt="" /> Clear Filter
                                </div>
                                <div className='commonbtn' onClick={() => deleteFunction()}  >
                                    <img src={deleteIcon} className='deleteIcon' alt="" /> Delete
                                </div>
                            </div>

                            <div className="w100 martop20 fixedTable">
                                <table className='w100 hometable nonitolight'>
                                    <thead className='nonitolight' style={{ fontWeight: "100" }}>
                                        <tr className='nonitolight'>
                                            <td className='w40px'><input type="checkbox" name="" id="" className='checkboxparent' onChange={changecheckBoxParent} /> </td>
                                            <td className='nonitolight'>PIPELINE NAME</td>
                                            <td>PIPELINE DURATION (ms)</td>
                                            <td className='posrel'>CREATED BY
                                                <img
                                                    src={filter} className="fa-solid fa-filter dropdown-toggle img-responsive filter"
                                                    data-bs-toggle="dropdown"
                                                    aria-expanded="false" alt="filter" />

                                                <div
                                                    onClick={(e) => e.stopPropagation()}
                                                    id="toggleDropdown"
                                                    className='posabs search-content dropdown-menu options'
                                                >
                                                    <input autoComplete="off" type="text" placeholder='Search' className='textinput' value={searchCreated} onChange={(e) => searchCreating(e)} />
                                                    <div className='d-flex allcheck'>
                                                        {
                                                            user.map((ele, index) => {
                                                                return (
                                                                    <div className='eachboxcheck' key={index}>
                                                                        <input type="checkbox" id={ele} name={ele?.toLowerCase()} className='eachcheck eachcheckcreatedby' /> <label htmlFor={ele} >{ele} </label>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                    <div className="text-end">
                                                        <button onClick={() => filterCreatedBy()} className='apply' id='applycreatedby'>Apply</button>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>CREATED AT</td>
                                            <td className='posrel'>STATUS
                                                <img onClick={() => setStatus(!status)} src={filter} className="fa-solid fa-filter dropdown-toggle img-responsive filter"
                                                    data-bs-toggle="dropdown"
                                                    aria-expanded="false" alt="filter" />
                                                <div id="toggleDropdown"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className='posabs search-content dropdown-menu options'
                                                >
                                                    <div className='d-flex allcheck'>

                                                        <div className='eachboxcheck' >
                                                            <input type="checkbox" id="success" name="success" className='eachcheckstatus' /> <label htmlFor="success" >Success </label>
                                                        </div>
                                                        <div className='eachboxcheck' >
                                                            <input type="checkbox" id="failed" name="failed" className='eachcheckstatus' /> <label htmlFor="failed" >Failed </label>
                                                        </div>
                                                        <div className='eachboxcheck' >
                                                            <input type="checkbox" id="running" name="running" className='eachcheckstatus' /> <label htmlFor="running" >Running </label>
                                                        </div>

                                                    </div>
                                                    <div className="text-end">
                                                        <button onClick={() => filterStatus()} className='apply' id='applyStatus'>Apply</button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            totalBuilds.map((data, idx) => {
                                                let each = data?.build?.split("#");
                                                let each_build = each[1];
                                                let dateAndTime = new Date(data.created_at).toLocaleString(undefined, { timeZone: "Asia/Kolkata" })
                                                return (
                                                    <tr key={idx}>
                                                        <td><input type="checkbox" name={data.build} value={`${project_id + "-" + each_build}`} id="" className='eachcheckbox' onChange={checkBoxEach} /> </td>

                                                        {
                                                            ["FINISHED", "SUCCESS", "UNFINISHED"].includes(data?.result?.toUpperCase()) ?
                                                                <td className='cursor cursorhover' onClick={() => rowclicked(`/eachPipes/Projects/${project_name}/${project_id}/${each_build}/false`)}>{data.build} </td> :
                                                                <td className='cursor cursorhover'>{data.build} </td>
                                                        }

                                                        <td>{data.pipeline_duration} </td>
                                                        <td>{data.created_by} </td>
                                                        <td>{dateAndTime}</td>
                                                        {
                                                            ["FINISHED", "SUCCESS"].includes(data?.result?.toUpperCase()) ? <td className='green'>Success </td> :
                                                                <></>
                                                        }
                                                        {
                                                            ["FAILED", "FAILURE"].includes(data?.result?.toUpperCase()) ? <td className='red'>Failed </td> :
                                                                <></>
                                                        }

                                                        {
                                                            (["RUNNING", "", "UNFINISHED"].includes(data?.result?.toUpperCase()) || !data.result) ? <td className='blue'>Runnning </td> :
                                                                <></>}
                                                    </tr>
                                                )
                                            })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* pipeline */}


                </div>
            </div>
        </div >
    )
}

export default Projectpipeline;