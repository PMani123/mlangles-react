import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import Loading from '../../Components/Loading';

// import createdat from "../../logo/createdat.png";
// import createdat from "../../logo/createdat.png";
import { TabPanel, TabView } from 'primereact/tabview';
import ExperimentSidebar from './ExperimentSidebar';
import deleteIcon from "../../logo/deleteIcon.png";
import filterIcon from "../../logo/clear_filter.png";
import plus from "../../logo/plus.png";
import { backend_url, backend_url1 } from '../../Config';

import mllogo from "../../logo/ml-logo.png"
import mlimage from "../../logo/mlangles360logo.png";
import { Link } from 'react-router-dom';
import Superuser from '../../Components/Superuser';
import Logout from '../Logout';
import { Dialog } from 'primereact/dialog';
import Mlsidebar from '../../Components/Mlsidebar';
import filter from "../../logo/filter.png";

const ProjectTable = () => {

    let { project_name, project_id, path, experiment, run } = useParams();
    const [open, setOpen] = useState(false);

    const [showrun, setShowrun] = useState(false);

    const [experimentTable, setExperimentTable] = useState([]);
    const navigate = useNavigate();

    const [createdBy, setCreatedBy] = useState(false);
    const [searchCreated, setSearchCreated] = useState("");
    const [initialUser, setInitialUser] = useState([]);
    const [initialData, setInitialData] = useState([]);
    const [user, setUser] = useState([]);
    const [status, setStatus] = useState(false);
    const [openSidebar, setOpenSidebar] = useState(false);
    const [sidebarData, setSidebarData] = useState({});
    const [userDetails, setUserDetails] = useState({});
    const [logout, setLogout] = useState(false);
    const [metricsTh, setMetricsTh] = useState([]);
    const [paramTh, setParamTh] = useState([]);

    let token = JSON.parse(localStorage.getItem("mlanglesToken"));
    let Header = { headers: { "Authorization": `Bearer ${token}` } };
    const [err, setErr] = useState("");

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

        // const myInterval = setInterval(continous, 3000);
        // async function continous() {
        //     fetchData1();
        // }
        // return () => {
        //     // console.log("cleaning data---- done");
        //     clearInterval(myInterval);
        // }

    }, [])

    function errorFun() {
        setTimeout(() => {
            setErr("");
        }, 4000)
    }

    async function fetchData() {
        try {
            // console.log("fetchData------fetchData");
            setOpen(true);
            if (run === "true") {
                setShowrun(true);
            }
            const res = await axios.get(`${backend_url}/tracking/experiment_tracking/${project_id}`, Header);
            if (res.data.success) {
                setOpen(false);

                setExperimentTable(res.data.data);
                // console.log(res.data.data);
                setInitialData(res.data.data);
                let data1 = res.data.data;
                let user1 = new Set();

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
                setExperimentTable([]);
            }
        }
        catch (e) {
            // console.log("There is an Error--", e);
            setErr(e.message);
            errorFun();
        }
    }


    // console.log("experimentTable------------", experimentTable);

    async function fetchData1() {
        try {
            // console.log("fetchData------fetchData");
            // setOpen(true);
            if (run === "true") {
                setShowrun(true);
            }
            const res = await axios.get(`${backend_url}/tracking/experiment_tracking/${project_id}`, Header);
            if (res.data.success) {
                setOpen(false);
                setExperimentTable(res.data.data);
                setInitialData(res.data.data);
                let data1 = res.data.data;
                let user1 = new Set();
                for (let i = 0; i < data1.length; i++) {
                    user1.add(data1[i].created_by);
                    // console.log("data1[i].data.created_by------------", data1[i].created_by);
                }
                // console.log(user1);
                setUser(Array.from(user1));
                setInitialUser(Array.from(user1));
            } else {
                setOpen(false);
                setExperimentTable([]);
            }
        }
        catch (e) {
            // console.log("There is an Error--", e);
            setErr(e.message);
            errorFun();
        }
    }

    async function runButton() {
        navigate(`/createRun/Projects/${project_name}/${project_id}`);
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
            setExperimentTable(initialData);
        } else {
            setExperimentTable(newData);
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
                if (eachcheckstatus[i]?.name === "success") {
                    selected.push("success", "finished");
                } else if (eachcheckstatus[i]?.name === "failed") {
                    selected.push("failed", "failure");
                } else {
                    selected.push("running", "unfinished");
                }
            }
        }

        let newData = [];
        for (let i = 0; i < initialData.length; i++) {
            if (["RUNNING", "UNFINISHED", " ", "null"].includes(initialData[i]?.status)) {
                newData.push(initialData[i]);
            } else {
                if (selected.includes(initialData[i]?.data?.info?.status?.toLowerCase())) {
                    newData.push(initialData[i]);
                }
            }
        }
        if (selected.length === 0) {
            setExperimentTable(initialData)
        }
        else {
            setExperimentTable(newData);
        }
    }

    function runIdClicked(data) {
        setOpenSidebar(true);
        setSidebarData(data);
    }

    function closing() {
        setOpenSidebar(false);
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
        let checkboxparent = document.getElementsByClassName("checkboxparent")[0];
        let eachCheck = document.getElementsByClassName("eachcheckbox");
        for (let i of eachCheck) {
            if (!i.checked) {
                checkboxparent.checked = false;
            }
        }
    }


    async function deleteExperiment() {
        try {
            // console.log("deleting");
            let deleteArray = [];
            let checkboxparent = document.getElementsByClassName("checkboxparent")[0];
            let eachCheck = document.getElementsByClassName("eachcheckbox");

            for (let i of eachCheck) {
                if (i.checked) {
                    // console.log(i.value);
                    let d1 = i?.value?.split("-");
                    deleteArray.push({ "run_name": d1[0], "run_id": d1[1] });
                    i.checked = false;
                }
            }
            if (deleteArray.length > 0) {
                setOpen(true);
                const deleting = await axios.delete(`${backend_url}/tracking/deleteExperimentRun`, { data: { "run_ids": deleteArray }, headers: { "Authorization": `Bearer ${token}` } });
                if (deleting.data.success) {
                    fetchData();
                }
                checkboxparent.checked = false;
            }
        }
        catch (err) {
            // console.log("There is a error:--", err);
            setErr(err.message);
            errorFun();
        }
    }

    function uncheckAll() {
        const checkboxAll = document.querySelectorAll("[type=checkbox]");
        // console.log("checkboxAll-------", checkboxAll);
        for (let i of checkboxAll) {
            // console.log(i);
            if (i.checked) {
                // console.log("checked already");
                i.checked = false;
            }
        }
    }

    function toggle() {
        const toggleDropdown = document.getElementsByClassName("dropdown-menu");
        // console.log("toggleDropdown----", toggleDropdown);
        for (let i of toggleDropdown) {
            // console.log(i);
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
                        <Link to="/Home"><h4 className='capitailze'>{userDetails?.user_full_name} workspace / </h4> </Link> <Link to="/Projects" ><span> Projects /</span></Link> <span className='capitailze'>{project_name} Experiment Tracking</span>
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
                                <Link to={`/projectpipeline/${path}/${project_name}/${project_id}`}><h6 className="head mypro cursor" >PIPELINES</h6></Link>
                                <h6 className='head green assignpro cursor'>EXPERIMENT TRACKING</h6>
                            </div>
                            <div>
                                <Link to="/serving"><button className='commonbtn servBtn'>Go to Serving</button></Link>
                            </div>
                        </div>
                    </div>
                    <div className='d-flex align-items-center justify-content-center'>
                        <h4 className='error-message'>{err}</h4>
                    </div>
                    {openSidebar ? <ExperimentSidebar data={sidebarData} project_id={project_id} close={closing} /> : <></>}
                    <div className='allpipelines martop48'>
                        <div className='d-flex mb-4 justify-content-end padd-24 martop12'>
                            <button className='commonbtn' onClick={() => runButton()}> <img src={plus} alt="plus" className='plus' /> New Run</button>

                            <div className="commonbtn" onClick={() => { setExperimentTable(initialData); clearing(); }} >
                                <img src={filterIcon} alt="" /> <span>Clear Filter</span>
                            </div>

                            <div className='commonbtn' onClick={() => deleteExperiment()}  >
                                <img src={deleteIcon} className='deleteIcon' alt="" /> Delete
                            </div>
                        </div>

                        <div className='overflows inputrightspace'>
                            <table className={experimentTable.length > 0 ? 'sample ' : "sample w100"} style={{ width: "max-content" }} >
                                <thead className='fixing'>
                                    <tr className='smp'>
                                        <th colSpan={6}></th>
                                        {/* <th colSpan={4}>Metrics</th> */}
                                        {
                                            metricsTh.length > 0 ?
                                                <th colSpan={metricsTh.length}>Metrics</th> : <></>
                                        }
                                        {
                                            paramTh.length > 0 ?
                                                <th colSpan={paramTh.length}>Parameters</th> : <></>
                                        }
                                    </tr>
                                    <tr>
                                        <th> <input type="checkbox" className='checkboxparent' onChange={changecheckBoxParent} />  RUN ID   </th>
                                        <th>RUN NAME  </th>
                                        <th className='posrel width140px'>STATUS <img src={filter} className="fa-solid fa-filter dropdown-toggle img-responsive filter"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false" alt="filter" />
                                            <div
                                                onClick={(e) => e.stopPropagation()}
                                                id="toggleDropdown"
                                                className='posabs search-content dropdown-menu options'>
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
                                        </th>
                                        <th className={experimentTable.length === 0 ? 'posrel width160px' : "posrel "}>CREATED BY <img src={filter} className="fa-solid fa-filter dropdown-toggle img-responsive filter"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false" alt="filter" />
                                            <div onClick={(e) => e.stopPropagation()}
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

                                        <th>START TIME  </th>
                                        <th>END TIME  </th>

                                        {
                                            metricsTh?.map((ele, idx) => {
                                                return (
                                                    <th key={idx}>{ele} </th>
                                                )
                                            })
                                        }
                                        {/* <th>MEAN ABSOLUTE   </th>
                                        <th>MEAN SQUARE ERROR   </th>
                                        <th>ROOT MEAN SQUARE   </th>
                                        <th>SCORE   </th> */}

                                        {
                                            paramTh?.map((ele, idx) => {
                                                return (
                                                    <th key={idx}>{ele} </th>
                                                )
                                            })
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        experimentTable.map((user, idx) => {
                                            let starttime = new Date(user.data.info.start_time).toLocaleString(undefined, { timeZone: "Asia/Kolkata" });
                                            let endtime = new Date(user.data.info.end_time).toLocaleString(undefined, { timeZone: "Asia/Kolkata" });

                                            return (
                                                <tr key={idx}>
                                                    {
                                                        ["finished", "success"].includes(user?.data?.info?.status?.toLowerCase()) ?
                                                            <td className='runidtd'> <input type="checkbox" className='eachcheckbox' value={`${user.data.info.run_name}-${user.data.info.run_id}`} onChange={checkBoxEach} /> <span className='cursorhover' onClick={() => runIdClicked(user)}>{user.data.info.run_id}</span> </td> :
                                                            <td className='runidtd'><input type="checkbox" className='eachcheckbox' value={`${user.data.info.run_name}-${user.data.info.run_id}`} onChange={checkBoxEach} /> {user.data.info.run_id}</td>
                                                    }

                                                    <td>{user.data.info.run_name}</td>

                                                    {
                                                        ["finished", "success"].includes(user?.data?.info?.status?.toLowerCase()) ? <td className='green'>Success</td> : <></>
                                                    }
                                                    {
                                                        ["failed", "failure"].includes(user?.data?.info?.status?.toLowerCase()) ? <td className='red'>Failed</td> : <></>
                                                    }
                                                    {
                                                        ["error"].includes(user?.data?.info?.status?.toLowerCase()) ? <td className='red'>Error</td> : <></>
                                                    }
                                                    {
                                                        ["running", "", "unfinished"].includes(user?.data?.info?.status?.toLowerCase() || !user?.data?.info?.status) ? <td className='blue'>Running</td> : <></>
                                                    }

                                                    <td>{user?.created_by}</td>
                                                    <td>{starttime}</td>
                                                    <td>{endtime}</td>

                                                    {
                                                        metricsTh.map((ele1, index) => {
                                                            let flag = 0;
                                                            return (
                                                                <React.Fragment key={index}>
                                                                    {
                                                                        user?.data.data?.metrics?.map((ele, index1) => {
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
                                                                        user?.data.data?.params?.map((ele, index) => {
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

                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default ProjectTable;