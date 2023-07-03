import React, { useEffect, useState } from 'react'
import Mlsidebar from '../../Components/Mlsidebar'
import mllogo from "../../logo/ml-logo.png"
import { Link, useNavigate, useParams } from 'react-router-dom'
import profilePic from "../../logo/profile-pic.png"
import { TabView, TabPanel } from 'primereact/tabview';
import PipeslineBox from '../../Components/PipeslineBox'
import file from "../../logo/file.png"
import mlimage from "../../logo/mlangles360logo.png"
import { Dropdown } from "primereact";
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import axios from 'axios'
import Loading from '../../Components/Loading'
import Superuser from '../../Components/Superuser';
import { backend_url, backend_url1 } from '../../Config'
import Logout from '../Logout';
import { Dialog } from 'primereact/dialog';


const Serving = () => {

    let [project_id, setProject_id] = useState("");
    let [project_name, setProject_name] = useState("");
    const [experiment_name, setExperiment_name] = useState("");
    const [modal_name, setModal_name] = useState("");
    let path = window.location.href.split("/")[3];
    const [projectName, setProjectName] = useState([]);
    const [expName, setExpName] = useState([]);
    const [modelName, setModalName] = useState([]);
    const [open, setOpen] = useState(false);
    const [postserv, setPostserv] = useState([]);
    const [fullModaldata, setFullModaldata] = useState([]);
    const [columns, setCloumns] = useState([]);
    const [colEnterData, setColEnterData] = useState({});
    const [result, setResult] = useState("");
    const [urls, setUrls] = useState("");
    const [col1, setCol1] = useState([]);
    const [feature, setFeature] = useState("");
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState({});
    const [logout, setLogout] = useState(false);
    const [err, setErr] = useState("");

    let token = JSON.parse(localStorage.getItem("mlanglesToken"));
    let Header = { headers: { "Authorization": `Bearer ${token}` } };

    useEffect(() => {
        let token = JSON.parse(localStorage.getItem("mlanglesToken"));
        let userdetails = JSON.parse(localStorage.getItem("userDetails"));
        setUserDetails(userdetails);

        if (userdetails) {
            if (!token || userDetails?.permissions?.is_serve === 0) {
                navigate("/");
            }
            fetchData();
        }
    }, [])

    async function fetchData() {
        setOpen(true);
        const res = await axios.get(`${backend_url}/tracking/serving`, Header);
        setOpen(false);
        if (res.data.success) {
            //console.log(res.data.data);
            setProjectName(res.data.data);
        }
    }

    function errorFun() {
        setTimeout(() => {
            setErr("");
        }, 4000)
    }

    async function handleChange(e) {
        try {
            //console.log(e.target);
            // setExperiment(e.target.value);
            setProject_name(e.target.value);
            let project_name = e.target.value;
            let id = "";
            for (let i of projectName) {
                if (i.project_name === project_name) {
                    //console.log(project_name, i.project_id)
                    id = i.project_id;
                    setProject_id(id);
                    break;
                }
            }
            setOpen(true);
            // setOpen(false);
            //console.log(id);
            const res = await axios.post(`${backend_url}/tracking/serving`, { 'project_id': id }, Header);
            if (res.data.success) {
                setOpen(false);
                //console.log(res.data.data);
                let data = res.data.data;
                setPostserv(data);
                let arrayData = [];
                for (let i of data) {
                    arrayData.push(i.run_name)
                }
                setExpName(arrayData);
                setModalName([]);
                setExperiment_name("");
                setModal_name("");
                setResult("");
                setColEnterData("");
                setCloumns([]);
                setCol1(res.data.columns);
            } else {
                setOpen(false);
                setExpName([]);
                setModalName([]);
                setExperiment_name("");
                setModal_name("");
                setResult("");
                setColEnterData("");
                setCloumns([]);
            }
        }
        catch (e) {
            setOpen(false);
            setErr(e.message);
            errorFun();
        }
    }

    async function handleChange1(e) {
        try {
            setExperiment_name(e.target.value);
            let expName = e.target.value;
            let run_id = ""
            for (let i of postserv) {
                if (i.run_name === expName) {
                    run_id = i.run_id;
                    break;
                }
            }
            setOpen(true);
            const res = await axios.post(`${backend_url}/tracking/get_models_`, { 'project_id': project_id, 'run_id': run_id }, Header);
            if (res.data.success) {
                setOpen(false);
                let ans = res.data.list_of_algo_names;
                setFullModaldata(res.data.urls);
                let newArray = [];
                for (let i of ans) {
                    let newStr = i.replace("(", "").replace(")", "");
                    //console.log(i, typeof i, newStr);
                    newArray.push(newStr);
                }
                setModalName(newArray);
                setModal_name("");
                setResult("");

                setColEnterData("");
                setCloumns([]);
            } else {
                setModalName([]);
                setModal_name("");
                setResult("");

                setColEnterData("");
                setCloumns([]);
            }
        }
        catch (e) {
            setOpen(false);

            setErr(e.message);
            errorFun();
        }
    }

    async function handleChange2(e) {
        //console.log(e.target);
        try {
            setModal_name(e.target.value);
            let modal = e.target.value + "()";
            for (let i of fullModaldata) {
                //console.log("modal data----", i, modal);
                if (modal === i.algorithem) {
                    let urls = i.urls[0];
                    //console.log("urls-----", i.urls[0]);
                    setUrls(urls);
                    setOpen(true);
                    const res = await axios.post(`${backend_url}/tracking/getColoumns`, { "model_url": urls }, Header);
                    if (res.data.success) {
                        setOpen(false);
                        setCloumns(res.data.coloums);
                        let colObj = {};
                        for (let i of res.data.coloums) {
                            colObj[i] = 0;
                        }
                        setColEnterData(colObj);
                        let col2 = res.data.coloums;

                        let featureMap = new Map();
                        for (let i of col1) {
                            // console.log("i------", i);
                            featureMap.set(i, 1);
                        }
                        // console.log("featureMap-------", featureMap);
                        for (let i of col2) {
                            if (featureMap.has(i)) {
                                // console.log(featureMap[i])
                                featureMap.set(i, featureMap.get(i) + 1)
                            }
                        }

                        console.log("final featire map=-----------", featureMap);

                        for (let i of featureMap) {
                            console.log(i);
                            if (i[1] === 1) {
                                console.log("iiiiiii--------", i[0]);
                                setFeature(i[0])
                            }
                        }
                    } else {
                        setOpen(false);
                        setCloumns([]);
                        setResult("");
                    }
                    // console.log(res);
                    break;
                }
            }
        }
        catch (e) {
            console.log(" getColoumns error---", e.message);
            setOpen(false);
            // setErr(e.message);
            errorFun();
            // setCloumns([]);
            setResult("");
        }
    }

    //console.log(colEnterData);

    function inputDataChange(e) {
        //console.log("e.target--------", e.target.name, e.target.value);
        setColEnterData({ ...colEnterData, [e.target.name]: e.target.value })
    }

    async function predicting(e) {
        try {
            e.preventDefault();
            let newData = [];
            //console.log(colEnterData)
            for (let i in colEnterData) {
                newData.push(Number(colEnterData[i]));
            }
            setOpen(true);
            const res = await axios.post(`${backend_url}/tracking/loadAndPredict`, { "model_url": urls, "data": newData }, Header);
            //console.log(res)
            if (res.data.success) {
                setOpen(false)
                setResult(res.data.result[0])
            }
        }
        catch (e) {
            console.log("There is an Error--", e);
            setOpen(false);
            setErr(e.message);
            errorFun();
        }
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
                        <h4 className='capitailze'>{userDetails?.user_full_name} workspace / </h4><span> Serving</span>
                    </div>
                    <Superuser logoutClicked={() => { setLogout(true) }} />

                </div>
            </header>
            <Dialog className="logout-dialogbox" visible={logout} style={{ width: '30vw' }} onHide={() => setLogout(false)}>
                <Logout no={() => setLogout(false)} />
            </Dialog>

            <Loading loading={open} />

            <Mlsidebar data={path} />
            <div className="middlepart serving">
                <h2>MODEL SERVING</h2>
                <div className='d-flex align-items-center justify-content-center'>
                    <h4 className='error-message'>{err}</h4>
                </div>
                <div className="inside-ser">
                    <div className="servingdata">
                        <div className="d-flex">
                            <div className="col-md-4">
                                <h4>Select Project Name</h4>

                                <FormControl className='dropdown-serving' fullWidth>
                                    <InputLabel id="demo-simple-select-label">Select Your Project Name</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={project_name}
                                        label="Select your Project"
                                        onChange={handleChange}
                                        name="project_name"
                                    >
                                        {projectName.map((data, idx) => {
                                            return (
                                                <MenuItem key={idx} value={data.project_name}>{data.project_name}</MenuItem>
                                            )
                                        })
                                        }
                                    </Select>
                                </FormControl>
                            </div>

                            <div className="col-md-4">
                                <h4>Select Experiment Name</h4>
                                <FormControl className='dropdown-serving' fullWidth>
                                    <InputLabel id="demo-simple-select-label">Select Your Experiment Name</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={experiment_name}
                                        label="Select your Project"
                                        onChange={handleChange1}
                                        name='experiment_name'
                                    >
                                        {expName.map((data, idx) => {
                                            return (
                                                <MenuItem key={idx} value={data}>{data}</MenuItem>
                                            )
                                        })
                                        }
                                    </Select>
                                </FormControl>
                            </div>

                            <div className="col-md-4">
                                <h4>Select Model</h4>
                                <FormControl className='dropdown-serving' fullWidth>
                                    <InputLabel id="demo-simple-select-label">Select Your Modal Name</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={modal_name}
                                        label="Select your Project"
                                        onChange={handleChange2}
                                        name='modal_name'
                                    >
                                        {
                                            modelName.map((data, idx) => {
                                                return (
                                                    <MenuItem key={idx} value={data}>{data}</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                    </div>

                    {
                        columns.length > 0 ?
                            <>
                                <form onSubmit={predicting}>
                                    <div className="servinginputs">
                                        <h2>Enter the inputs</h2>
                                        <div className="d-flex flex-wrap fullinputs align-items-center">
                                            {columns.map((ele, index) => {
                                                let len = ele.length;
                                                let show = false;
                                                if (len > 10) {
                                                    show = true;
                                                }
                                                return (
                                                    <div className={show ? "hover eachinput" : "eachinput"} key={index}>
                                                        {/* <div className="column-dir"> */}
                                                        <label htmlFor="caret" className='largeData'>{ele}</label>
                                                        <div className="d-flex justify-content-between">
                                                            <label htmlFor="caret" className='textoverflow'>{ele}</label>
                                                            {/* </div> */}
                                                            <input autoComplete="off" required step="any" type="number" name={ele} onChange={inputDataChange} id="" />
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div className="last d-flex align-items-center">
                                        <button type='submit' className='predict'>Predict</button>
                                        {result ? <p className='result'>  <span className='green'>Result  </span> <span className='finalres'>{feature} {result} </span>  </p> : <></>}
                                    </div>
                                </form>
                            </>
                            :
                            <></>
                    }
                </div>

            </div>
        </div>
    )
}

export default Serving