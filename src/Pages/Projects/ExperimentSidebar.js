import React, { useEffect, useState } from 'react';

import { Sidebar } from 'primereact/sidebar';
import CloseIcon from '@mui/icons-material/Close';
import run1 from "../../logo/run.png";
import createdat from "../../logo/createdat.png";
import artifactsActive from "../../logo/artifactsIconActive.svg";
import artifactsNotActive from "../../logo/artifactsIconNotActive.svg";
import metricActive from "../../logo/metricsIconActive.svg";
import metricNotActive from "../../logo/metricsIconNotActive.svg";
import parametersActive from "../../logo/parameterIconActive.svg";
import parametersNotActive from "../../logo/parameterIconNotActive.svg";
import subfile from "../../logo/subfile.png";
import folderDown from "../../logo/folderDown.png"
import FolderIcon from '@mui/icons-material/Folder';
import DownloadIcon from '@mui/icons-material/Download';
import Loading from '../../Components/Loading';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { backend_url, backend_url1 } from '../../Config';
import modal from "../../Data/model.pkl";
import view from "../../Data/viw details.txt";
import JSZip from "jszip";
import FileSaver from "file-saver";

const ExperimentSidebar = ({ data, project_id, close }) => {

    const [visibleRight, setVisibleRight] = useState(false);
    const [activeState, setActiveState] = useState("artifacts");
    const [sidebarData, setSidebardata] = useState({});
    const [runId, setRunId] = useState("");
    const [runName, setRunName] = useState("");
    const [startTime, setStartTime] = useState("");
    const [fullArtifacts, setFullArtifacts] = useState({});
    const [folder, setFolder] = useState("");
    const [url, setUrl] = useState("");
    const [open, setOpen] = useState(false);
    let navigate = useNavigate();
    const [err, setErr] = useState("");
    const [showDownload, setShowDownload] = useState(false);
    const [downfile, setDownfile] = useState(false);

    let token = JSON.parse(localStorage.getItem("mlanglesToken"));
    let Header = { headers: { "Authorization": `Bearer ${token}` } };

    useEffect(() => {
        let token = JSON.parse(localStorage.getItem("mlanglesToken"));
        if (!token) {
            navigate("/");
        }
        fetechData();

    }, [data])

    function errorFun() {
        setTimeout(() => {
            setErr("");
        }, 4000)
    }

    async function fetechData() {
        try {
            setVisibleRight(true);
            setSidebardata(data);
            setRunId(data.data.info.run_id);
            setRunName(data.data.info.run_name)
            let start = new Date(data.data.info.start_time).toLocaleString(undefined, { timeZone: 'Asia/Kolkata' });
            setStartTime(start);
            setOpen(true);
            const artifactsFile = await axios.post(`${backend_url}/tracking/get_mlfow_artifacts/${project_id}`, { "run_id": data.data.info.run_id }, Header);
            if (artifactsFile.data.success) {
                setFullArtifacts(artifactsFile.data);
                setOpen(false);
            } else {
                setOpen(false);
            }
        }
        catch (e) {
            console.log("There is an error--", e);
            setErr(e.message);
            errorFun();
        }
    }

    function toggleDownload(data, check) {
        // console.log("toggleDownload----", showDownload, data);
        let latest = showDownload;
        setShowDownload(!showDownload);
        setFolder(data);
        if (check === "all") {
            if (!latest) {
                setTimeout(() => {
                    const downloadAllonce = document.getElementsByClassName("downloadAllonce");
                    var urls = [];
                    for (let i = 0; i < downloadAllonce.length; i++) {
                        downloadAllonce[i].target = "_self";
                        console.log(downloadAllonce[i]);
                        urls.push(downloadAllonce[i]);
                    }
                    console.log("urls---", urls);
                    let interval = setInterval(repeat, 1000, urls);
                    function repeat(urls) {
                        var url = urls.pop();
                        url.click();
                        console.log("url---", url);
                        if (urls.length === 0) {
                            clearInterval(interval);
                            console.log("done");
                        }
                    }
                }, 1000);
                // setTimeout(() => {
                //     const downloadAllonce = document.getElementsByClassName("downloadAllonce");
                //     var urls = [];
                //     for (let i = 0; i < downloadAllonce.length; i++) {
                //         downloadAllonce[i].target = "_self";
                //         console.log(downloadAllonce[i]);
                //         urls.push(downloadAllonce[i].href);
                //     }
                //     console.log("urls---", urls);

                //     const saveZip = (filename, urls) => {
                //         if (!urls) return;
                //         const zip = new JSZip();
                //         const folder = zip.folder("files"); // folder name where all files will be placed in 

                //         urls.forEach((url) => {
                //             const blobPromise = fetch(url).then((r) => {
                //                 if (r.status === 200) return r.blob();
                //                 return Promise.reject(new Error(r.statusText));
                //             });
                //             const name = url.substring(url.lastIndexOf("/") + 1);
                //             folder.file(name, blobPromise);
                //         });
                //         zip.generateAsync({ type: "blob" }).then((blob) => FileSaver.saveAs(blob, filename));
                //     };

                //     saveZip("my_project_files_to_download.zip", urls);

                //     // ======================================================================================

                //     // var zip = new JSZip();
                //     // // Add a text file with the contents "Hello World\n"
                //     // zip.file("Hello.txt", "Hello World\n");

                //     // // Add a another text file with the contents "Goodbye, cruel world\n"
                //     // zip.file("Goodbye.txt", "Goodbye, cruel world\n");

                //     // // Add a folder named "images"
                //     // var img = zip.folder("images");

                //     // // Add a file named "smile.gif" to that folder, from some Base64 data
                //     // img.file("smile.gif", imgData, { base64: true });

                //     // zip.generateAsync({ type: "base64" }).then(function (content) {
                //     //     location.href = "data:application/zip;base64," + content;
                //     // });
                //     // ======================================================================================


                // }, 1000)
            }
        }
    }

    return (
        <>
            <Loading loading={open} />
            <Sidebar visible={visibleRight} position="right" onHide={() => { setVisibleRight(false); setActiveState("artifacts"); close() }}>
                <div className='sidemarleft'>
                    <div className="sideright-head d-flex justify-content-between align-items-center">
                        <h4 className='runidh4'>Run Name:{runName} </h4>
                        <div>
                            <CloseIcon className='closeicon' onClick={() => { setVisibleRight(false); setActiveState("artifacts"); close() }} />
                        </div>
                    </div>
                    <div className="runpad">
                        <div className='eachrun'>
                            <img src={run1} alt="" className='runimg' />
                            <span>Run ID: {runId} </span>
                        </div>
                        <div className=''>
                            <img src={createdat} alt="" className='runimg' />
                            <span>{startTime} </span>
                        </div>
                    </div>
                    <div className="navbars-side">
                        <div className="run-navbar">
                            <div className="eachnav" onClick={() => setActiveState("artifacts")} >
                                {activeState === "artifacts" ? <><><img src={artifactsActive} alt="" /> <span className='green' >ARTIFACTS </span></></> : <><img src={artifactsNotActive} alt="" /> <span>ARTIFACTS </span></>}
                            </div>
                            <div className="eachnav" onClick={() => setActiveState("metrics")} >
                                {activeState === "metrics" ? <><><img src={metricActive} alt="" /> <span className='green' >METRICS </span></></> : <><img src={metricNotActive} alt="" /> <span>METRICS </span></>}
                            </div>
                            <div className="eachnav" onClick={() => setActiveState("parameters")} >
                                {activeState === "parameters" ? <><><img src={parametersActive} alt="" /> <span className='green' >PARAMETERS </span></></> : <><img src={parametersNotActive} alt="" /> <span>PARAMETERS </span></>}
                            </div>
                        </div>
                        <div className="runbar-content">
                            {
                                activeState === "artifacts" ?
                                    <div className="d-flex w100">
                                        <div className='d-flex flex-column w50 align-items-start'>
                                            <table className='fullfolder'>
                                                <tbody>
                                                    {
                                                        fullArtifacts?.urls?.map((ele, idx) => {
                                                            let folderName = ele.algorithem.replace("(", "").replace(")", "");
                                                            // console.log("folderName----", folderName);
                                                            return (
                                                                <tr key={idx}>
                                                                    <td><FolderIcon /></td>
                                                                    <td className='cursor'><span onClick={() => { toggleDownload(folderName) }}>{folderName}</span></td>
                                                                    <td className='cursor' onClick={() => { toggleDownload(folderName, "all"); }}> <img src={folderDown} alt="" /> </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* <div className='testing'>
                                            <a
                                                href={modal}
                                                download="Example-PDF-document"
                                                target="_blank"
                                                rel="noreferrer"
                                                className='test'
                                            >
                                                modal
                                            </a>
                                            <a
                                                href={view}
                                                download="Example-PDF-document"
                                                target="_blank"
                                                rel="noreferrer"
                                                className='test'
                                            >
                                                view details
                                            </a>
                                        </div>

                                        <button className='white' onClick={() => downloadAll()}>Download All</button> */}

                                        <div className='d-flex flex-column w50 align-items-start'>
                                            {
                                                fullArtifacts?.urls?.map((ele, idx) => {
                                                    let folderName = ele.algorithem.replace("(", "").replace(")", "");
                                                    if (folder === folderName) {
                                                        return (
                                                            <div key={idx} className={showDownload ? "visBlock d-flex flex-col" : 'visNone d-flex flex-col'}>
                                                                <table className='subfile'>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td><img src={subfile} /></td>
                                                                            <td><span>ML model</span></td>
                                                                            <td className='cursor downloadAllfile'><a download="one" href={ele?.urls[0]} rel="noreferrer" className='downloadAllonce' > <DownloadIcon /></a></td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td><img src={subfile} /></td>
                                                                            <td><span>Conda.yaml</span></td>
                                                                            <td className='cursor downloadAllfile'><a download="two" href={ele?.urls[1]} rel="noreferrer" className='downloadAllonce'> <DownloadIcon /></a></td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td><img src={subfile} /></td>
                                                                            <td><span>model.pkl</span></td>
                                                                            <td className='cursor downloadAllfile'><a download="three" href={ele?.urls[2]} rel="noreferrer" className='downloadAllonce'> <DownloadIcon /></a></td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td><img src={subfile} /></td>
                                                                            <td><span>python_env.yaml</span></td>
                                                                            <td className='cursor downloadAllfile'><a download="four" href={ele?.urls[3]} rel="noreferrer" className='downloadAllonce'> <DownloadIcon /></a></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        )
                                                    }
                                                })
                                            }
                                        </div>
                                    </div>
                                    :
                                    <></>
                            }
                            {activeState === "metrics" ?
                                <table className='metrics'>
                                    <thead>
                                        <tr className='trrun'>
                                            <th>NAME</th>
                                            <th>VALUE</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sidebarData?.data?.data?.metrics?.map((ele, idx) => {
                                            return (
                                                <tr key={idx}>
                                                    <td>{ele?.key}</td>
                                                    <td>{ele?.value}</td>
                                                </tr>
                                            )
                                        })}

                                    </tbody>
                                </table>
                                :
                                <></>
                            }
                            {activeState === "parameters" ?
                                <table className='metrics'>
                                    <thead>
                                        <tr className='trrun'>
                                            <th>NAME</th>
                                            <th>VALUE</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sidebarData?.data?.data?.params?.map((ele, idx) => {
                                            return (
                                                <tr key={idx}>
                                                    <td>{ele?.key}</td>
                                                    <td>{ele?.value}</td>
                                                </tr>
                                            )
                                        })}

                                    </tbody>
                                </table>
                                :
                                <></>
                            }
                        </div>
                    </div>
                </div>
            </Sidebar>
        </>

    )
}

export default ExperimentSidebar