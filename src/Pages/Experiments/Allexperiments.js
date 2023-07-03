import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Mlsidebar from '../../Components/Mlsidebar'
import mllogo from "../../logo/ml-logo.png"
import profilePic from "../../logo/profile-pic.png"
import mlimage from "../../logo/mlangles360logo.png"
import { Dropdown } from "primereact";
import successIcon from "../../logo/successIcon.png";
import axios from 'axios'
import Loading from '../../Components/Loading'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import ExperimentSidebar from '../Projects/ExperimentSidebar'
import Superuser from '../../Components/Superuser'
import deleteIcon from "../../logo/deleteIcon.png";
import filterIcon from "../../logo/clear_filter.png";
import plus from "../../logo/plus.png";
import filter from "../../logo/filter.png";
import { backend_url, backend_url1 } from "../../Config";
import Logout from '../Logout'
import { Dialog } from 'primereact/dialog';

const Allexperiments = () => {
    const [exp, setexp] = useState([]);
    const [open, setOpen] = useState(false);
    const [tableHead, setTableHead] = useState([]);
    let [projectName, setProjectName] = useState("");
    const [status, setStatus] = useState(false);
    const [initialData, setInitialData] = useState([]);
    const [createdBy, setCreatedBy] = useState(false);
    const [searchCreated, setSearchCreated] = useState("");
    const [project_id, setProject_id] = useState("");
    const [openSidebar, setOpenSidebar] = useState(false);
    const [sidebarData, setSidebarData] = useState({});
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();
    const [btnshow, setBtnshow] = useState(false);
    const [allProjects, setAllProjects] = useState([]);
    const [user, setUser] = useState([]);
    const [initialUser, setInitialUser] = useState([]);
    const [err, setErr] = useState("");

    const [projectFilter, setProjectFilter] = useState(false);
    const [initialproject, setInitialproject] = useState([]);
    const [searchProject, setSearchProject] = useState("");
    const [userDetails, setUserDetails] = useState({});
    const [logout, setLogout] = useState(false);
    const [metricsTh, setMetricsTh] = useState([]);
    const [paramTh, setParamTh] = useState([]);


    let token = JSON.parse(localStorage.getItem("mlanglesToken"));
    let Header = { headers: { "Authorization": `Bearer ${token}` } };

    let path = "experiments";
    console.log("hi1")

    useEffect(() => {
        let token = JSON.parse(localStorage.getItem("mlanglesToken"));
        let userdetails = JSON.parse(localStorage.getItem("userDetails"));
        setUserDetails(userdetails);
        if (userdetails) {
            if (!token || userDetails?.permissions?.experiments === 0) {
                navigate("/");
            }
            fetchData();
        }
    }, []);

    function errorFun() {
        setTimeout(() => {
            setErr("");
        }, 4000)
    }

    async function fetchData() {
        try {
            setOpen(true);
            const res = await axios.get(`${backend_url}/tracking/all_experiments`, Header);
            if (res.data.success) {
                setOpen(false);
                setexp(res.data.all_experiments);
                let pro = res.data.projects;
                let projectArray = [];
                for (let i of pro) {
                    projectArray.push(i.project_name)
                }
                setProjects(projectArray);
                setInitialproject(projectArray);
                setAllProjects(res.data.projects);

                setInitialData(res.data.all_experiments);
                if (res.data.all_experiments[0]) {
                    setTableHead(Object.keys(res.data.all_experiments[0]));
                }
                let user1 = new Set();
                let data1 = res.data.all_experiments;

                let uniqueMetrics = new Set();
                let uniqueParam = new Set();
                for (let i = 0; i < data1.length; i++) {
                    user1.add(data1[i].created_by);
                    let parameters = data1[i]?.data?.data;
                    if (parameters?.params) {
                        for (let i of parameters?.params) {
                            uniqueParam.add(i.key);
                        }
                    }
                    if (parameters?.params) {
                        for (let i of parameters?.metrics) {
                            uniqueMetrics.add(i.key);
                        }
                    }
                }

                let onlyMetric = Array.from(uniqueMetrics);
                let onlyParam = Array.from(uniqueParam);
                let newd2 = [...uniqueParam];
                // console.log("onlyMetric11111----------", onlyMetric, onlyMetric.length);

                let already = 0;
                for (let i = 0; i < onlyMetric.length; i++) {
                    if (onlyMetric[i] === "Score") {
                        onlyMetric.splice(i, 1);
                        already = 1;
                        break;
                    }
                }

                if (already) {
                    onlyMetric.push("Score");
                }

                setMetricsTh(onlyMetric);
                setParamTh(onlyParam);





                setUser(Array.from(user1));
                setInitialUser(Array.from(user1));
            } else {
                setOpen(false);
                setErr("Error Occured in all_experiments");
                errorFun();
            }
        }
        catch (err) {
            setOpen(false);
            console.log("There is a error--", err);
            setErr(err.message);
            errorFun();
        }
    }

    function projectNamesearch(e) {
        console.log("initialproject---------", initialproject);

        let data = e.target.value?.toLowerCase();
        setSearchProject(data);
        let newData = [];
        for (let i = 0; i < initialproject.length; i++) {
            if (initialproject[i]?.toLowerCase().includes(data)) {
                newData.push(initialproject[i]);
            }
        }
        setProjects(newData);
    }

    function handleChange(e) {
        setBtnshow(true);
        setProjectName(e.target.value);
    }

    function newRunClicked() {
        let projectId = "";
        let status1 = "";
        for (let x of allProjects) {
            console.log(x);
            if (x.project_name === projectName) {
                projectId = x.project_id;
                status1 = x.status;
                break;
            }
        }
        console.log("newRunClicked----- status1-----", status1);
        if (status1) {
            navigate(`/createRun/Projects/${projectName}/${projectId}`);
        } else {
            navigate(`/projectpipeline/Projects/${projectName}/${projectId}`);
        }
    }

    function filterProjectName() {
        toggle();
        if (projectFilter) {
            setProjectFilter(!projectFilter)
        }

        let selected = [];
        var projectname = document.getElementsByClassName("projectname");
        for (let i = 0; i < projectname.length; i++) {
            if (projectname[i].checked) {
                selected.push(projectname[i].name)
            }
        }

        let newData = [];
        for (let i = 0; i < initialData.length; i++) {
            console.log("initialproject[i].created_by?.toLowerCase()-------------", initialData[i]);
            if (selected.includes(initialData[i].project_name?.toLowerCase())) {
                newData.push(initialData[i])
            }
        }

        if (selected.length === 0) {
            setexp(initialData);
        } else {
            setexp(newData);
        }
        setSearchCreated("");
        setProjects(initialproject);
    }


    function filterStatus() {
        toggle();
        if (status) {
            setStatus(!status);
        }
        let atleastOne = false;
        let selected = [];
        var eachcheckstatus = document.getElementsByClassName("eachcheckstatus");
        for (let i = 0; i < eachcheckstatus.length; i++) {
            if (eachcheckstatus[i].checked) {
                atleastOne = true;
                if (eachcheckstatus[i]?.name === "success") {
                    selected.push("success", "finished")
                } else if (eachcheckstatus[i]?.name === "failed") {
                    selected.push("failed", "failure")
                } else {
                    selected.push("running", "unfinished")
                }
            }
        }

        let newData = [];

        for (let i = 0; i < initialData.length; i++) {
            console.log(initialData[i].status);
            if (["RUNNING", "UNFINISHED", " ", "null"].includes(initialData[i]?.status)) {
                newData.push(initialData[i]);
            } else {
                if (selected.includes(initialData[i]?.data?.info?.status?.toLowerCase())) {
                    console.log(initialData[i]);
                    newData.push(initialData[i]);
                }
            }
        }

        console.log("selected-------", selected, "newData----", newData);

        if (selected.length === 0) {
            setexp(initialData)
        }
        else {
            setexp(newData);
        }
    }

    async function runIdClicked(data) {
        console.log("data---------", data, projects);
        setOpenSidebar(true);
        setSidebarData({ data: data.data });
        // for (let i of projects) {
        //     if (i === data.project_name) {
        //         console.log("first-----------", i.project_id);
        //         setProject_id(i.project_id);
        //         break;
        //     }
        // }

        let projectId = "";
        for (let x of allProjects) {
            if (x.project_name === data.project_name) {
                projectId = x.project_id;
                setProject_id(projectId);
                break;
            }
        }

    }

    function searchCreating(e) {
        let data = e.target.value.toLowerCase();
        setSearchCreated(data);
        let newData = [];
        for (let i = 0; i < initialUser.length; i++) {
            if (initialUser[i].toLowerCase().includes(data)) {
                newData.push(initialUser[i]);
            }
        }
        setUser(newData);
    }

    function closing() {
        setOpenSidebar(false);
    }

    async function deleteExperiment() {
        try {
            console.log("deleting");
            let deleteArray = [];

            let checkboxparent = document.getElementsByClassName("checkboxparent")[0];
            let eachCheck = document.getElementsByClassName("eachcheckbox");

            for (let i of eachCheck) {
                if (i.checked) {
                    console.log(i.value);
                    let d1 = i?.value?.split("-");
                    deleteArray.push({ "run_name": d1[0], "run_id": d1[1] });
                    i.checked = false;
                }
            }

            if (deleteArray.length > 0) {

                setOpen(true);
                const deleting = await axios.delete(`${backend_url}/tracking/deleteExperimentRun`, { data: { "run_ids": deleteArray }, headers: { "Authorization": `Bearer ${token}` } });
                fetchData();
                if (deleting.data.success) {
                } else {

                }
                checkboxparent.checked = false;
            }
        }
        catch (err) {
            setOpen(false);
            console.log("There is a error--", err);
            setErr(err.message);
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

    function pass() {
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
            // console.log("initialData------", initialData)
            if (selected.includes(initialData[i].created_by.toLowerCase())) {
                newData.push(initialData[i])
            }
        }

        if (selected.length === 0) {
            setexp(initialData);
        } else {
            setexp(newData);
        }
        setSearchCreated("");
        setUser(initialUser);
    }

    function clearing() {
        uncheckAll();
        filterCreatedBy();
        setSearchProject("");
        setProjects(initialproject);
    }

    return (
        <div className='allpipeline'>
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
                        <h4 className='capitailze'>{userDetails?.user_full_name} workspace / </h4><span> Experiments</span>
                    </div>

                    <Superuser logoutClicked={() => { setLogout(true) }} />
                </div>
            </header>

            <Dialog className="logout-dialogbox" visible={logout} style={{ width: '30vw' }} onHide={() => setLogout(false)}>
                <Logout no={() => setLogout(false)} />
            </Dialog>

            <Loading loading={open} />

            {openSidebar ? <ExperimentSidebar data={sidebarData} project_id={project_id} close={closing} /> : <></>}

            <Mlsidebar data={path} />

            <section className='middlepart allprojects dashboard allpipelines'>
                <h2>All EXPERIMENTS</h2>

                <div className='d-flex align-items-center justify-content-center'>
                    <h4 className='error-message'>{err}</h4>
                </div>

                <div className='d-flex justify-content-between align-items-center paddboth'>
                    <div className='d-flex align-items-center'>
                        <div className='w40 allexperiments'>

                            <div className="each-check1">
                                <label className='labelstyle' htmlFor="">Project Name</label>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Select Your Project Name</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        className='demo-simple-select'
                                        value={projectName}
                                        label="Problem Type"
                                        onChange={handleChange}
                                        required
                                    >
                                        {projects.map((data, idx) => {
                                            return (
                                                <MenuItem key={idx} value={data}>{data}</MenuItem>
                                            )
                                        })
                                        }
                                    </Select>
                                </FormControl>
                            </div>

                        </div>
                        {
                            btnshow ?
                                <button className='createbtn' onClick={() => newRunClicked()}> <img src={plus} alt="plus" className='plus' /> New Run</button>
                                : <></>
                        }

                    </div>
                    <div className='d-flex'>
                        <div className="commonbtn" onClick={() => { setexp(initialData); clearing(); }} >
                            <img src={filterIcon} alt="" /> <span>Clear Filter</span>
                        </div>
                        <div className="commonbtn" onClick={() => { deleteExperiment() }} >
                            <img src={deleteIcon} alt="" /> <span>Delete</span>
                        </div>
                    </div>
                </div>

                <div className="fixedsize">
                    <table className='sample' style={{ width: "max-content" }} >
                        <thead className='fixing'>
                            <tr className='smp'>
                                <th colSpan={8}></th>
                                {/* <th colSpan={4}>Metrics</th> */}
                                {
                                    metricsTh.length > 0 ?
                                        <th colSpan={metricsTh.length}>Metrics</th> : <></>
                                }
                                {/* <th colSpan={14}>Parameters</th> */}
                                {
                                    paramTh.length > 0 ?
                                        <th colSpan={paramTh.length}>Parameters</th> : <></>
                                }
                            </tr>
                            <tr>
                                <th><input type="checkbox" className='checkboxparent' onChange={changecheckBoxParent} /> </th>
                                <th className='posrel'>PROJECT NAME

                                    <img src={filter}
                                        className="fa-solid fa-filter dropdown-toggle img-responsive"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        onClick={() => { setProjectFilter(!projectFilter) }} />

                                    <div
                                        id="toggleDropdown"
                                        className='posabs search-content dropdown-menu options'
                                        onClick={(e) => e.stopPropagation()}>
                                        <input autoComplete="off" type="text" placeholder='Search' className='textinput' value={searchProject} onChange={(e) => projectNamesearch(e)} />
                                        <div className='d-flex allcheck'>
                                            {
                                                projects.map((ele, index) => {
                                                    return (
                                                        <div className='eachboxcheck' key={index}>
                                                            <input type="checkbox" id={ele} name={ele?.toLowerCase()} className='eachcheck projectname' /> <label htmlFor={ele} >{ele} </label>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        <div className="text-end">
                                            <button onClick={() => filterProjectName()} className='apply' id='applycreatedby'>Apply</button>
                                        </div>
                                    </div>
                                </th>

                                <th>RUN ID <span  > </span>  </th>
                                <th>RUN NAME<span  > </span>  </th>
                                <th className='posrel width140px'>STATUS
                                    <img src={filter}
                                        className="fa-solid fa-filter dropdown-toggle img-responsive"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        onClick={() => setStatus(!status)} />

                                    <div
                                        id="toggleDropdown"
                                        className='posabs search-content dropdown-menu options'
                                        onClick={(e) => e.stopPropagation()}
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
                                    </div>  </th>
                                <th className='posrel'>CREATED BY
                                    <img src={filter}
                                        className="fa-solid fa-filter dropdown-toggle img-responsive"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        onClick={() => { setCreatedBy(!createdBy) }} />
                                    <div
                                        id="toggleDropdown"
                                        className='posabs search-content dropdown-menu options'>
                                        <input autoComplete="off" type="text" placeholder='Search' className='textinput' value={searchCreated} onChange={(e) => searchCreating(e)} />
                                        <div className='d-flex allcheck'>
                                            {
                                                user.map((ele, index) => {
                                                    return (
                                                        <div className='eachboxcheck' key={index}>
                                                            <input type="checkbox" id={ele} name={ele.toLowerCase()} className='eachcheck eachcheckcreatedby' /> <label htmlFor={ele} >{ele} </label>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        <div className="text-end">
                                            <button onClick={() => filterCreatedBy()} className='apply' id='applycreatedby'>Apply</button>
                                        </div>
                                    </div>

                                </th>
                                <th>START TIME<span  > </span>  </th>
                                <th>END TIME<span  > </span>  </th>


                                {
                                    metricsTh?.map((ele, idx) => {
                                        return (
                                            <th key={idx}>{ele} </th>
                                        )
                                    })
                                }

                                {/* <th>MEAN ABSOLUTE <span  > </span>  </th>
                                <th>MEAN SQUARE ERROR <span  > </span>  </th>
                                <th>ROOT MEAN SQUARE <span  > </span>  </th>
                                <th>SCORE <span  > </span>  </th> */}

                                {
                                    paramTh.map((ele, idx) => {
                                        return (
                                            <th key={idx}>{ele} </th>
                                        )
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                exp.map((allData, idx) => {
                                    let starttime = new Date(allData?.data?.info?.start_time).toLocaleString(undefined, { timeZone: "Asia/Kolkata" });
                                    let endtime = new Date(allData?.data?.info?.end_time).toLocaleString(undefined, { timeZone: "Asia/Kolkata" });

                                    return (
                                        <tr key={idx}>
                                            <td><input type="checkbox" className='eachcheckbox' value={`${allData?.data?.info?.run_name}-${allData?.data?.info?.run_id}`} onChange={checkBoxEach} /></td>
                                            <td>{allData.project_name}</td>
                                            <td className='runidtd cursorhover'
                                                onClick={() => ["finished", "success"].includes(allData?.data?.info?.status?.toLowerCase()) ? runIdClicked(allData) : pass()
                                                } >
                                                {allData?.data?.info?.run_id}
                                            </td>
                                            <td>{allData?.data?.info?.run_name}</td>

                                            {
                                                ["FINISHED", "SUCCESS"].includes(allData?.data?.info?.status?.toUpperCase()) ?
                                                    <td className='green'>Success</td> :
                                                    <></>
                                            }
                                            {
                                                ["FAILED", "FAILURE"].includes(allData?.data?.info?.status?.toUpperCase()) ?
                                                    <td className='red'>Failed</td> : <></>
                                            }
                                            {
                                                ["ERROR"].includes(allData?.data?.info?.status?.toUpperCase()) ?
                                                    <td className='red'>Error</td> : <></>
                                            }
                                            {
                                                (["RUNNING", "", "UNFINISHED"].includes(allData?.data?.info?.status?.toUpperCase()) || !allData?.data?.info?.status) ?
                                                    <td className='blue'>Running...</td> : <></>
                                            }

                                            <td>{allData.created_by}</td>
                                            <td>{starttime}</td>
                                            <td>{endtime}</td>
                                            {/* {
                                                allData?.data?.data?.metrics?.map((ele, index) => {
                                                    return (
                                                        <td key={index}> {ele.value.toFixed(2)} </td>
                                                    )
                                                })
                                            }

                                            {
                                                paramTh.map((ele1, index) => {
                                                    return (
                                                        <React.Fragment key={index}>
                                                            {
                                                                allData?.data.data?.params?.map((ele, index) => {
                                                                    if (ele1 === ele.key) {
                                                                        return (
                                                                            <td key={index}> {ele.value ? ele.value : "-"} </td>
                                                                        )
                                                                    }
                                                                })
                                                            }
                                                        </React.Fragment>
                                                    )
                                                })
                                            } */}


                                            {
                                                metricsTh.map((ele1, index) => {
                                                    let flag = 0;
                                                    return (
                                                        <React.Fragment key={index}>
                                                            {
                                                                allData?.data.data?.metrics?.map((ele, index1) => {
                                                                    if (ele1 === ele.key) {
                                                                        flag = 1;
                                                                        return (
                                                                            <td key={index1}> {ele.value} </td>
                                                                        )
                                                                    }
                                                                })
                                                            }
                                                            {
                                                                !flag
                                                                    ?
                                                                    <><td> - </td></>
                                                                    : <></>
                                                            }
                                                        </React.Fragment>
                                                    )
                                                })
                                            }

                                            {
                                                paramTh.map((ele1, index) => {
                                                    let flag = 0;
                                                    return (
                                                        <React.Fragment key={index}>
                                                            {
                                                                allData?.data.data?.params?.map((ele, index) => {
                                                                    if (ele1 === ele.key) {
                                                                        flag = 1;
                                                                        return (
                                                                            <td key={index}> {ele.value} </td>
                                                                        )
                                                                    }
                                                                })
                                                            }
                                                            {
                                                                !flag
                                                                    ?
                                                                    <><td> - </td></>
                                                                    : <></>
                                                            }
                                                        </React.Fragment>
                                                    )
                                                })
                                            }



                                            {/* {
                                                allData?.data?.data?.params?.map((ele, index) => {
                                                    return (
                                                        <td key={index}> {ele.value} </td>
                                                    )
                                                })
                                            } */}
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>

            </section>
        </div>
    )
}

export default Allexperiments