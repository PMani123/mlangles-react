import React, { useEffect, useState } from 'react'
import Mlsidebar from '../../Components/Mlsidebar'
import mllogo from "../../logo/ml-logo.png"
import mlimage from "../../logo/mlangles360logo.png"
import { Link, useNavigate, useParams } from 'react-router-dom'
import profilePic from "../../logo/profile-pic.png"
import { TabView, TabPanel } from 'primereact/tabview';
import PipeslineBox from '../../Components/PipeslineBox'
import file from "../../logo/file.png"
import ExperimentTracking from './ExperimentTracking';
import axios from 'axios';
import Loading from '../../Components/Loading'
import { CSVLink } from "react-csv";
import DataPreview from './DataPreview';
import pdf from "../../BigMart.pdf";
import graph from "../../logo/graph1.png";
import page1 from "../../logo/data-visu/page1.png"
import page2 from "../../logo/data-visu/page2.png"
import page3 from "../../logo/data-visu/page3.png"
import page4 from "../../logo/data-visu/page4.png"
import page5 from "../../logo/data-visu/page5.png"
import page6 from "../../logo/data-visu/page6.png"
import page7 from "../../logo/data-visu/page7.png"
import page8 from "../../logo/data-visu/page8.png"
import page9 from "../../logo/data-visu/page9.png"
import page10 from "../../logo/data-visu/page10.png"
import page11 from "../../logo/data-visu/page11.png"
import page12 from "../../logo/data-visu/page12.png"
import Superuser from '../../Components/Superuser';
import { backend_url, backend_url1 } from '../../Config'
import { Dialog } from 'primereact/dialog';
import Logout from '../Logout'

const Pipes = () => {
    let { path, project_name, each_build, project_id } = useParams();
    const [open, setOpen] = useState(true);
    const [datas, setDatas] = useState([]);
    const [logs, setLogs] = useState([]);
    const [currentLog, setCurrentLog] = useState(0);
    const [csvreport, setCsvreport] = useState({ data: "" });
    const [report, setReport] = useState(false);
    const [datapreviewData, setDatapreviewData] = useState([]);
    const [fileDown, setFileDown] = useState(false);
    const [fileName, setFileName] = useState("");
    let navigate = useNavigate();
    const [userDetails, setUserDetails] = useState({});
    const [logout, setLogout] = useState(false);
    const [err, setErr] = useState("");
    const [images, setImages] = useState([]);

    let token = JSON.parse(localStorage.getItem("mlanglesToken"));
    let Header = { headers: { "Authorization": `Bearer ${token}` } };

    function errorFun() {
        setTimeout(() => {
            setErr("");
        }, 4000)
    }

    useEffect(() => {
        try {
            let token = JSON.parse(localStorage.getItem("mlanglesToken"));
            let userdetails = JSON.parse(localStorage.getItem("userDetails"));
            setUserDetails(userdetails);

            if (userdetails) {
                if (!token || userDetails?.permissions?.is_pipeline === 0) {
                    navigate("/");
                }
                setOpen(true);
                fetchData()
                async function fetchData1() {
                    setOpen(true);
                    dataFetchingforRun();
                }
                fetchData1();
                const myInterval = setInterval(continous, 3000)
                async function continous() {
                    const totalBuildList = await axios.get(`${backend_url}/pipeline/total_build_list/${project_id}`, Header);

                    if (totalBuildList.data.success) {
                        let arrayData = totalBuildList.data.data
                        let count = 0
                        for (let i = 0; i < arrayData.length; i++) {
                            if (arrayData[i].result) {
                                // console.log("count-------", count);
                                count += 1
                            }
                        }
                        dataFetchingforRun();
                        if (count === arrayData.length) {
                            console.log("successfully fetched");
                            dataFetchingforRun();
                            clearInterval(myInterval)
                        }
                    } else {
                        // setBuilds([]);
                    }
                }
                return () => {
                    clearInterval(myInterval);
                }
            }
        }
        catch (e) {
            // console.log("error", e);
            setOpen(false);
            setErr(e.message);
            errorFun();
        }
    }, []);

    async function fetchData() {
        // console.log("dataFetchingforRun----------");
        try {
            const logs = await axios.get(`${backend_url}/pipeline/list_of_the_builds/${project_id}/${each_build}`, Header);
            if (logs.data.success) {
                setDatas(logs.data.data);
            }
            const allLogs = await axios.get(`${backend_url}/pipeline/pipeline_each_step_logs/${project_id}/${each_build}`, Header);
            if (allLogs.data.success) {
                setLogs(allLogs.data.logs);
            }
            setOpen(false)
        }
        catch (e) {
            // console.log("There is an Error--", e);
            setOpen(false);
            setErr(e.message);
            errorFun();
        }
    }

    async function dataFetchingforRun() {
        try {
            const logs = await axios.get(`${backend_url}/pipeline/list_of_the_builds/${project_id}/${each_build}`, Header);
            if (logs.data.success) {
                setDatas(logs.data.data);
            }

            setOpen(false);

            const allLogs = await axios.get(`${backend_url}/pipeline/pipeline_each_step_logs/${project_id}/${each_build}`, Header);
            if (allLogs.data.success) {
                setLogs(allLogs.data.logs);
            }
            const dataPreview = await axios.get(`${backend_url}/pipeline/data_preview/${project_id}/${each_build}`, Header);
            // console.log("dataPreview------------", dataPreview);
            if (dataPreview.data.success) {
                setDatapreviewData(dataPreview.data.data);
            }

            const createCharts = await axios.post(`${backend_url}/pipeline/data_visualization/${project_id}/${each_build}`, "", Header);

            const getCharts = await axios.get(`${backend_url}/pipeline/data_visualization/${project_id}/${each_build}`, Header);
            if (getCharts.data.success) {
                setImages(getCharts.data.data);
            }

            const artifacts = await axios.get(`${backend_url}/pipeline/get_artifacts/${project_id}/${each_build}`, Header);
            if (artifacts.data.success) {
                let name = artifacts.data.artifacts[0]?.split("/");
                let fileName = name[name.length - 1]?.split(".")[0];
                const fileData = await axios.post(artifacts.data.url, {}, { headers: { 'Authorization': 'Basic ' + btoa(`admin:${artifacts.data.jenkins_key}`), 'Access-Control-Allow-Origin': '*' } });
                // console.log("fileData--------------0,fileData", fileData);
                if (fileData.status === 200) {
                    setFileDown(true);
                    setFileName(fileName)
                    setCsvreport({ "filename": fileName, "data": fileData?.data });
                }
            }
        }
        catch (e) {
            // console.log("There is an Error--", e);
            setErr(e.message);
            errorFun();
        }
    }

    function logging(data) {
        setCurrentLog(data + 1);
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
                        <Link to="/home"><h4 className='capitailze'>{userDetails?.user_full_name} workspace / </h4></Link> <Link to="/Projects"><span> All Projects/</span></Link> <Link to={`/projectpipeline/Projects/${project_name}/${project_id}`} ><span className='capitailze'>{project_name} Pipeline/</span></Link> <span className='capitailze'>{project_name} #{each_build} </span>
                    </div>
                    <Superuser logoutClicked={() => { setLogout(true) }} />
                </div>
            </header>

            <Dialog className="logout-dialogbox" visible={logout} style={{ width: '30vw' }} onHide={() => setLogout(false)}>
                <Logout no={() => setLogout(false)} />
            </Dialog>

            <Mlsidebar data={path} />

            <div className="middlepart">
                <div className="card">
                    <div>
                        <div className="each-pipehead d-flex">
                            <h4 className='green' >PIPELINES</h4>
                            <Link to={`/experimentTracking/${path}/${project_name}/${project_id}`}><h4>EXPERIMENT TRACKING</h4></Link>
                        </div>

                        <div>
                            <div className='d-flex align-items-center justify-content-center'>
                                <h4 className='error-message'>{err}</h4>
                            </div>

                            <div className="d-flex">
                                <div className="pipes">
                                    {datas.map((ele, idx) => {
                                        return <PipeslineBox value={ele} lengthOfData={datas.length} index={idx} logs={logging} key={idx} />;
                                    })}
                                </div>
                            </div>
                            <div className="card pipes1">
                                <TabView>
                                    <TabPanel header="LOGS" className='logs logging'>

                                        <div className='scroll-logs'>
                                            {logs.length === 0 ?
                                                <div className='d-flex justify-content-center align-items-center'>
                                                    <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
                                                </div>
                                                :
                                                <>
                                                    <div className="view-right">
                                                        <p className='viewall' onClick={() => setCurrentLog(0)} >VIEW ALL</p>
                                                    </div>
                                                    {logs?.map((data, idx) => {
                                                        if (currentLog > 0) {
                                                            if (currentLog === idx + 1) {
                                                                return (
                                                                    <p key={idx}>
                                                                        {data}
                                                                    </p>
                                                                )
                                                            }
                                                        } else {
                                                            return (
                                                                <p key={idx}>
                                                                    {data}
                                                                </p>
                                                            )
                                                        }
                                                    })}
                                                </>
                                            }
                                        </div>

                                    </TabPanel>
                                    <TabPanel header="DATA VISUALIZATIONS">
                                        {/* <iframe src={pdf} width="100%" height="800px" ></iframe> */}
                                        <div className="flexing justifyCenter">
                                            {
                                                images.length === 0 ?
                                                    <div className='d-flex justify-content-center align-items-center'>
                                                        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
                                                    </div>
                                                    :
                                                    <>
                                                        {
                                                            images.map((ele, idx) => {
                                                                console.log("idx---", ele);
                                                                return (
                                                                    <img key={idx} src={ele} alt="" className='w33 eachimges' />
                                                                )
                                                            })
                                                        }
                                                    </>
                                            }


                                        </div>
                                    </TabPanel>
                                    <TabPanel header="DATA PREVIEW">
                                        <DataPreview data={datapreviewData} />
                                    </TabPanel>
                                    <TabPanel header="ARTIFACTS">
                                        <div className='d-flex justify-content-center'>
                                            <div className="col-md-4">
                                                {
                                                    !fileDown ?
                                                        <div className='d-flex justify-content-center align-items-center'>
                                                            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
                                                        </div>
                                                        :
                                                        <div className="artifacts d-flex flex-col">
                                                            <img src={file} alt="" />
                                                            <p>Download your cleaned data CSV file</p>
                                                            <h6 className='artifacts-filename'>{fileName}.csv</h6>
                                                            <CSVLink {...csvreport} ><button >Download</button></CSVLink>
                                                        </div>
                                                }
                                            </div>
                                        </div>
                                    </TabPanel>
                                </TabView>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Pipes