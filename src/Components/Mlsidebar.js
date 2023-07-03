import React, { useEffect, useState } from 'react'
import homeactive from "../logo/home-active.png"
import homeinactive from "../logo/home-inactive.svg"
import projectactive from "../logo/projectsactive.svg"
import projectinactive from "../logo/projectsinactive.svg"
import jupiteractive from "../logo/jupiteractive.svg"
import jupiterinactive from "../logo/jupiterinactive.svg"
import pipelineactive from "../logo/pipelineactive.svg"
import pipelineinactive from "../logo/pipelineinactive.svg"
import experimentactive from "../logo/experimentactive.svg"
import experimentinactive from "../logo/experimentinactive.svg"
import servingactive from "../logo/servingactive.svg"
import servinginactive from "../logo/servinginactive.svg"
import monitoringactive from "../logo/monitoringactive.svg"
import monitoringinactive from "../logo/monitoringinactive.svg"
import { Link } from 'react-router-dom'

const Mlsidebar = (props) => {

    const [sidebarData, setSidebarData] = useState([]);

    useEffect(() => {
        fetchData();
    }, [])

    function fetchData() {
        let userDetails = JSON.parse(localStorage.getItem("userDetails"));
        let sidebarData = [
            { imageactive: homeactive, imageinactive: homeinactive, data: "Home", localdata: "home", show: 1 },
            { imageactive: jupiteractive, imageinactive: jupiterinactive, data: "Jupyter Notebook", localdata: "is_jupyter", show: 1 },
            { imageactive: projectactive, imageinactive: projectinactive, data: "Projects", localdata: "projects_admin", show: 1 },
            { imageactive: pipelineactive, imageinactive: pipelineinactive, data: "Pipeline", localdata: "is_pipeline", show: 1 },
            { imageactive: experimentactive, imageinactive: experimentinactive, data: "Experiments", localdata: "experiments", show: 1 },
            { imageactive: servingactive, imageinactive: servinginactive, data: "Serving", localdata: "is_serve", show: 1 },
            { imageactive: monitoringactive, imageinactive: monitoringinactive, data: "Monitoring", localdata: "dashboard", show: 1 },
        ];

        let objData = userDetails?.permissions;
        if (userDetails?.permissions) {
            let arraydata = Object.keys(userDetails?.permissions);
            for (let x = 0; x < sidebarData.length; x++) {
                if (sidebarData[x]["localdata"]) {
                    for (let i of arraydata) {
                        if (objData[i] === 0 && sidebarData[x]["localdata"] === i) {
                            sidebarData[x]["show"] = 0;
                        }
                    }
                }
            }

            let newData = [];
            for (let i of sidebarData) {
                if (i["show"]) {
                    newData.push(i);
                }
            }
            setSidebarData(newData);
        }
    }

    return (
        <nav>
            <div className="df-center-col">
                {sidebarData.map((ele, idx) => {
                    return (
                        <div className="fullsidebarboth" key={idx}>
                            {props.data.toLocaleLowerCase() === ele.data.toLocaleLowerCase() ?
                                <Link to={`/${ele.data}`} >
                                    <div className='df-center-col cur eachsidebar sidebaractive123' >
                                        <img className='size32' src={ele.imageactive} alt={ele.data} />
                                        <h6 className='sidebardata green'>{ele.data} </h6>
                                    </div>
                                </Link>
                                :
                                <Link to={`/${ele.data}`} >
                                    <div className='df-center-col cur eachsidebar sidebaractive' >
                                        <img className='size32' src={ele.imageactive} alt={ele.data} />
                                        <h6 className='sidebardata'>{ele.data}</h6>
                                    </div>
                                    <div className='df-center-col cur eachsidebar sidebarnotactive'>
                                        <img className='size32' src={ele.imageinactive} alt={ele.data} />
                                        <h6 className='sidebardata'>{ele.data}</h6>
                                    </div>
                                </Link>
                            }
                            {/* <div className={path === ele.data ? 'df-center-col cur eachsidebar sidebaractive' : 'df-center-col cur eachsidebar sidebarnotactive'}  > */}
                        </div>
                    )
                })}
            </div>
        </nav>
    )
}

export default Mlsidebar;