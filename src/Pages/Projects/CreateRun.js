import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../../Components/Loading';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import profilePic from "../../logo/profile-pic.png"
import informationIcon from "../../logo/informationIcon.png"
import mllogo from "../../logo/ml-logo.png"
import mlimage from "../../logo/mlangles360logo.png"
import Mlsidebar from '../../Components/Mlsidebar';
import Superuser from '../../Components/Superuser';
import { backend_url, backend_url1 } from "../../Config";
import Logout from '../Logout';
import { Dialog } from 'primereact/dialog';

const CreateRun = () => {
    let { path, project_name, project_id, each_build } = useParams();

    const [inputValue, setInputValue] = useState({});
    const [selected, setSelected] = useState([]);
    const [runName, setRunName] = useState("");
    const [fulldata, setFulldata] = useState({});
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const [problemtype, setProblemtype] = useState("");
    const [targetfeature, setTargetfeature] = useState("");
    const [dataversion, setDataversion] = useState("");
    const [showalogo, setShowalgo] = useState(false);
    const [problem, setProblem] = useState([]);
    const [target, setTarget] = useState([]);
    const [version, setVersion] = useState([]);
    const [runs, setRuns] = useState([]);
    const [currentTab, setCurrentTab] = useState("experimentTracking");
    const [userDetails, setUserDetails] = useState({});
    const [logout, setLogout] = useState(false);
    const [err, setErr] = useState("");
    const [fieldErr, setFieldErr] = useState({ runName: "", problemType: "", dataVersion: "", targetVariable: "" });

    let token = JSON.parse(localStorage.getItem("mlanglesToken"));
    let Header = { headers: { "Authorization": `Bearer ${token}` } };

    function errorFun() {
        setTimeout(() => {
            setErr("");
        }, 4000)
    }

    async function fetchData() {
        try {
            setOpen(true);
            const runfetch = await axios.get(`${backend_url}/tracking/tracking/${project_id}`, Header);
            //console.log("runfetch----", runfetch)
            setOpen(false);
            if (runfetch.data.success) {
                setProblem(runfetch.data.problem_type)
                setTarget(runfetch.data.target_feature)
                setVersion(runfetch.data.data_version);
                setRuns(runfetch.data.run_names);
            } else {
                setErr("Error occured while getting tracking data");
                errorFun();
            }
        }
        catch (e) {
            setOpen(false);
            setErr("Error occured while getting tracking data");
            errorFun();
        }
    }

    useEffect(() => {
        let token = JSON.parse(localStorage.getItem("mlanglesToken"));
        let userdetails = JSON.parse(localStorage.getItem("userDetails"));
        setUserDetails(userdetails);

        if (userdetails) {

            if (!token || userDetails?.permissions?.experiments === 0) {
                navigate("/");
            }
            fetchData()
        }
    }, []);

    function errorHide() {
        setTimeout(() => {
            setFieldErr({ runName: "", problemType: "", dataVersion: "", targetVariable: "" })
        }, 5000)
    }

    async function createRunbtn(e) {
        try {
            e.preventDefault();
            for (let i in inputValue) {
                if (selected.includes(i)) {
                    continue
                } else {
                    delete inputValue[i]
                }
            }

            for (let i = 0; i < selected.length; i++) {
                if (selected[i] in inputValue) {
                } else {
                    inputValue[selected[i]] = {}
                }
            }

            let finalValue = {}
            for (let x in inputValue) {
                finalValue[x + "()"] = inputValue[x]
            }

            let initalErr = { runName: "", problemType: "", dataVersion: "", targetVariable: "" }
            let flag = 0;
            if (!runName) {
                initalErr = { ...initalErr, "runName": "Enter Run Name" }
                errorHide();
                flag = 1;
            }
            if (!problemtype) {
                initalErr = { ...initalErr, "problemType": "Select Problem Type" }
                errorHide();
                flag = 1;
            }
            if (!dataversion) {
                initalErr = { ...initalErr, "dataVersion": "Select Data Version" }
                errorHide();
                flag = 1;
            }
            if (!targetfeature) {
                initalErr = { ...initalErr, "targetVariable": "Select Target Variable" }
                errorHide();
                flag = 1;
            }
            setFieldErr(initalErr);

            let runFlag = 0;

            for (let i of runs) {
                if (i === runName) {
                    runFlag = 1;
                    setErr("Run Name need to be unique for a project");
                    errorFun();
                    break;
                }
            }

            if (flag || runFlag) {
                window.scrollTo(0, 0);
            }

            if (!flag && !runFlag) {
                let finalDataPost = {}
                finalDataPost["run_name"] = runName;
                finalDataPost["problem_type"] = problemtype;
                finalDataPost["url"] = dataversion;
                finalDataPost["target_variable"] = targetfeature;
                finalDataPost["hyper_data"] = finalValue;
                finalDataPost["project_id"] = project_id;

                // console.log("finalDataPost---------", finalDataPost);
                setOpen(true);
                const get_UpdateProblemType = await axios.get(`${backend_url}/mlflow/update_problemType_targetFeature/${project_id}`, Header);
                let putData = get_UpdateProblemType.data.project;
                putData["problem_type"] = problemtype;
                putData["target_feature"] = targetfeature;
                const put_UpdateProblemType = await axios.put(`${backend_url}/mlflow/update_problemType_targetFeature/${project_id}`, putData, Header);
                setOpen(false);

                setTimeout(() => {
                    navigate(`/experimentTracking/Projects/${project_name}/${project_id}`);
                }, 10000);

                setOpen(true);
                const res = await axios.post(`${backend_url}/mlflow/mlflow_tracking/${project_id}`, finalDataPost, Header);
                setOpen(false);
                if (res.data.success) {
                    navigate(`/experimentTracking/Projects/${project_name}/${project_id}`);
                } else {
                    setErr(res.data.message);
                    errorFun();
                }
            }
        }
        catch (e) {
            // console.log("There is an Error--", e);
            setOpen(false);
            setErr("Error occured while creating a run with sever side");
            errorFun();
        }
    }

    async function problemsselect(e) {
        try {
            setProblemtype(e.target.value);
            setOpen(true);
            let selectedCheck = [];
            let d1 = document.getElementsByClassName("checkbox");
            for (let i = 0; i < d1.length; i++) {
                if (d1[i].checked) {
                    selectedCheck.push(d1[i].value);
                    d1[i].click();
                }
            }
            // console.log("selectedCheck problemsselect-----", selectedCheck);
            setSelected([]);
            const typeSelect = await axios.post(`${backend_url}/tracking/hyper_perameter_tuning_inputs_and_labels`, {
                "type": e.target.value
            }, Header);
            setOpen(false);
            if (typeSelect.data.success) {
                setShowalgo(true);
                setFulldata(typeSelect.data.data);
            } else {
                setErr("Error occured while taking hyper_perameter_tuning_inputs_and_labels");

            }
        }
        catch (e) {
            // console.log("There is an Error--", e);
            setOpen(false);
            setErr("Error occured while hyper_perameter_tuning_inputs_and_labels with sever side");
            errorFun();
        }
    }

    function inputAllGetting(e, main, sub) {

        let valueData = e.target.value;
        // console.log("value is----", valueData, typeof valueData, Number(valueData), typeof (Number(valueData)));

        if (["True"].includes(e.target.value)) {
            // console.log("true");
            setInputValue({ ...inputValue, [main]: { ...inputValue[main], [sub]: true } });
        }
        else if (["False"].includes(e.target.value)) {
            // console.log("false");
            setInputValue({ ...inputValue, [main]: { ...inputValue[main], [sub]: false } });
        }
        else if (Number(valueData)) {
            setInputValue({ ...inputValue, [main]: { ...inputValue[main], [sub]: Number(valueData) } });
        }
        else {
            // console.log("string");
            setInputValue({ ...inputValue, [main]: { ...inputValue[main], [sub]: e.target.value } });
        }

        let oldData = fulldata;
        // console.log("hi---->>>>", oldData[main][sub]["current"]);
        oldData[main][sub]["current"] = e.target.value;
        // console.log("lofddatat----", oldData);
        setFulldata(oldData);
    }

    // console.log("inputValue--------", inputValue);

    function operation() {
        let selectedCheck = [];
        let d1 = document.getElementsByClassName("checkbox");
        for (let i = 0; i < d1.length; i++) {
            if (d1[i].checked) {
                // console.log(d1[i].value);
                selectedCheck.push(d1[i].value);
                // d1[i].click();
            }
        }
        setSelected(selectedCheck);
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
                        <Link to="/Home"><h4 className='capitailze'>{userDetails?.user_full_name} workspace / </h4> </Link> <Link to="/Projects" ><span> Projects/</span></Link><Link to={`/projectpipeline/Projects/${project_name}/${project_id}`} > <span className='capitailze'>{project_name} Predication/</span></Link><span className='capitailze'>Experiment Tracking</span>
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
                <div className="each-pipehead d-flex">
                    {/* <h4 onClick={(e) => { setCurrentTab("pipeline"); navigate(`/eachPipes/Projects/${project_name}/${project_id}/${each_build}/false`) }}>PIPELINES</h4> */}
                    <h4 onClick={(e) => { setCurrentTab("pipeline"); navigate(`/projectpipeline/Projects/${project_name}/${project_id}`) }}>PIPELINES</h4>
                    <h4 onClick={(e) => setCurrentTab("experimentTracking")} className='green'>EXPERIMENT TRACKING</h4>
                </div>
                <form onSubmit={createRunbtn}>


                    <div className="run">
                        <div>
                            {err ?
                                <div>
                                    <h4 className="error-message">
                                        {err}
                                    </h4>
                                </div>
                                :
                                <></>}
                            <div className="run-checkbox">
                                <div className="each-check">
                                    <label htmlFor="">Run Name</label>
                                    <input autoComplete="off" type="text" placeholder='Enter Your Run Name' value={runName} onChange={(e) => setRunName(e.target.value)} />
                                    <span className='fieldError'>{fieldErr.runName}</span>
                                </div>
                                <div className="each-check">
                                    <label htmlFor="">Problem Type</label>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Select Your Problem Type</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            className='demo-simple-select'
                                            value={problemtype}
                                            label="Problem Type"
                                            onChange={(e) => { problemsselect(e) }}
                                        >
                                            {
                                                problem.map((data, idx) => {
                                                    let dat1 = data.charAt(0).toUpperCase() + data.slice(1);
                                                    return (
                                                        <MenuItem key={idx} value={data}>{dat1}</MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                        <span className='fieldError'>{fieldErr.problemType}</span>
                                    </FormControl>
                                </div>
                            </div>
                            <div className="run-checkbox">
                                <div className="each-check">
                                    <label htmlFor="">Data Version</label>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Select Your Data Version</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            className='demo-simple-select'
                                            value={dataversion}
                                            label="Data Version"
                                            onChange={(e) => setDataversion(e.target.value)}

                                        >
                                            {
                                                version.map((data, idx) => {
                                                    let newData = data?.split("/");
                                                    let no = newData[3];
                                                    let last = newData[newData.length - 1]?.split(".");
                                                    let values = last[0] + " " + "V" + no;
                                                    return (
                                                        <MenuItem key={idx} value={data}>{values}</MenuItem>
                                                    )
                                                })
                                            }
                                        </Select>
                                        <span className='fieldError'>{fieldErr.dataVersion}</span>
                                    </FormControl>
                                </div>
                                <div className="each-check">
                                    <label htmlFor="">Target Variable</label>

                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Select Your Target Variable</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            className='demo-simple-select'
                                            value={targetfeature}
                                            label="Target Feature"
                                            onChange={(e) => setTargetfeature(e.target.value)}

                                        >
                                            {target.map((data, idx) => {
                                                return (
                                                    <MenuItem key={idx} value={data}>{data}</MenuItem>
                                                )
                                            })
                                            }
                                        </Select>
                                        <span className='fieldError'>{fieldErr.targetVariable}</span>
                                    </FormControl>
                                </div>
                            </div>
                        </div>
                        {showalogo ?
                            <div className="algo">
                                <h5 className='green'>Select the Algorithm</h5>
                                <div className="algo-input">
                                    {Object.keys(fulldata).map((ele, idx) => {
                                        return (
                                            <div className="each-algoinp" key={idx}>
                                                <input
                                                    id={ele}
                                                    value={ele}
                                                    type="checkbox"
                                                    className="checkbox"
                                                    name="checkboxing"
                                                    onChange={(e) => { operation(e, ele); }}
                                                />
                                                <label htmlFor={ele} >{ele}</label>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div> :
                            <></>}
                        {
                            selected.length > 0 ?
                                <>
                                    <div className="">
                                        <h5 className='green'>Input Hyperparameters</h5>
                                        <div className="hyper-table">
                                            <div className='d-flex justify-content-between table-heading-hyper'>
                                                <div className='d-flex width30 justify-content-between'>
                                                    <div className="sno width20"> <h2 className='hyper-th'>#</h2> </div>
                                                    <div className="head-algo width80"> <h2 className='hyper-th'>Algorithm </h2> </div>
                                                </div>
                                                <div className="head-hyper width70"> <h2 className='hyper-th'>Hyperparameter </h2> </div>
                                            </div>

                                            <div className='d-flex justify-content-between align-items-center column-dir'>
                                                {Object.keys(fulldata).map((ele, ind) => {
                                                    // console.log(ele, fulldata);
                                                    // console.log("selected---", selected);
                                                    return (
                                                        // <></>
                                                        <React.Fragment key={ind} >
                                                            {selected.map((cur, idx) => {
                                                                // console.log("current---", cur,ele);
                                                                if (cur === ele) {
                                                                    return (
                                                                        <div key={idx} className="d-flex w100 mar12 align-items-center" >
                                                                            <div className='d-flex width30 justify-content-between'>
                                                                                <div className="sno width20"> <h2 className='hyper-td'>{idx + 1} </h2> </div>
                                                                                <div className="head-algo width80"> <h2 className='hyper-td'>{ele} </h2> </div>
                                                                            </div>
                                                                            <div className="head-hyper width70">
                                                                                {Object.keys(fulldata[ele]).map((elements, index) => {
                                                                                    let d1 = fulldata[ele][elements];
                                                                                    let type1 = "";

                                                                                    if (d1.options.length === 0) {
                                                                                        if (d1.limits[1] === "inf") {
                                                                                            type1 = "Infinity"
                                                                                        } else if (d1.limits[1]) {
                                                                                            type1 = d1.limits[1]
                                                                                        }
                                                                                        return (
                                                                                            // <></>
                                                                                            <div className='equalwidth' key={index}>
                                                                                                <div className='hoverInfo'>
                                                                                                    <label htmlFor="elements" className='infoLabel' >{elements}
                                                                                                        <img src={informationIcon} className='infoIcon' alt="" />
                                                                                                    </label>
                                                                                                    <span className='showInfo'>Enter {d1.type} value between {d1.limits[0]} to {type1}</span>
                                                                                                </div>

                                                                                                <input autoComplete="off"
                                                                                                    type={["int", "float"].includes(d1.type) ? "number" : "text"}
                                                                                                    // placeholder={["int", "float"].includes(d1.type) ? `${d1.limits.length > 0 ? `${d1.type} value bet. ${d1.limits[0]} to ${d1.limits[1]}` : ""}` : ""}
                                                                                                    onChange={(e) => inputAllGetting(e, ele, elements)}
                                                                                                    min={d1.limits[0] ? d1.limits[0] : 0}
                                                                                                    max={d1.limits[1] === "inf" ? "1.797693134862315E+308" : d1.limits[1]}
                                                                                                    step={["int", "float"].includes(d1.type) ? d1.type === "int" ? "1" : "any" : ""}
                                                                                                />
                                                                                            </div>
                                                                                        )
                                                                                    }
                                                                                    else {
                                                                                        return (
                                                                                            <div className='equalwidth d-flex' key={index} >
                                                                                                <label htmlFor="elements">{elements} </label>
                                                                                                <Select
                                                                                                    labelId="demo-simple-select-label"
                                                                                                    id="demo-simple-select"
                                                                                                    className='demo-simple-select'
                                                                                                    value={d1.current}
                                                                                                    label="select value"
                                                                                                    onChange={(e) => inputAllGetting(e, ele, elements)}
                                                                                                >
                                                                                                    {
                                                                                                        d1.options.map((data, idx) => {
                                                                                                            return (
                                                                                                                <MenuItem key={idx} value={data}>{data}</MenuItem>
                                                                                                            )
                                                                                                        })
                                                                                                    }
                                                                                                </Select>
                                                                                            </div>
                                                                                        )
                                                                                        // return (
                                                                                        //     // <></>
                                                                                        //     <div className='equalwidth' key={index}>
                                                                                        //         <label htmlFor="elements">{elements} </label> <input autoComplete="off" type="text" onChange={(e) => inputAllGetting(e, ele, elements)} />
                                                                                        //     </div>
                                                                                        // )
                                                                                    }
                                                                                })}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }
                                                            })}
                                                        </React.Fragment>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div> <button className='crerun-btn' type='submit'> Create Run </button>
                                </> : <></>
                        }

                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateRun