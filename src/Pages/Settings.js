import React, { useEffect, useState } from 'react'
import Loading from '../Components/Loading'
import Superuser from '../Components/Superuser'
import mllogo from "../logo/ml-logo.png";
import mlimage from "../logo/mlangles360logo.png";
import profilePic from "../logo/profile-pic.png";
import { useNavigate } from 'react-router';
import Mlsidebar from '../Components/Mlsidebar';
import axios from 'axios';
import { backend_url } from '../Config';
import Logout from './Logout';
import { Dialog } from 'primereact/dialog';

const Settings = () => {

    const [open, setOpen] = useState(false);
    const [logout, setLogout] = useState(false);
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState({});
    const [config, setConfig] = useState({});
    const path = "settings";
    const [err, setErr] = useState("");

    let token = JSON.parse(localStorage.getItem("mlanglesToken"));
    let Header = { headers: { "Authorization": `Bearer ${token}` } };
    const [mand, setMand] = useState(false);

    useEffect(() => {
        let token = JSON.parse(localStorage.getItem("mlanglesToken"));
        let userdetails = JSON.parse(localStorage.getItem("userDetails"));
        setUserDetails(userdetails);
        if (!userdetails) {
            if (!token || userdetails?.permissions?.user_management_roles_admin === 0) {
                navigate("/");
            }
        }
        fetchData();
    }, [])

    async function fetchData() {
        try {
            setOpen(true);
            const getConfig = await axios.get(`${backend_url}/configuration/config`, Header);
            setOpen(false);
            if (getConfig.data.success) {
                let n1 = getConfig.data.output;
                setConfig(n1);
                for (let i in n1) {
                    if (i !== "organization_git") {
                        if (n1[i].length > 0) {
                            console.log("i=======", n1[i]);
                            setMand(true);
                            break;
                        }
                    }
                }
            } else {
                setErr("Error in Config..")
            }
        } catch (e) {
            console.log("There is an Error---", e);
            setErr(e.message);
            setOpen(false);
        }
    }


    function check() {
        for (let i in config) {
            if (i !== "organization_git") {
                if (config[i].length > 0) {
                    setMand(true);
                    break;
                }
            }
        }
    }

    async function submitSetting(e) {
        try {
            e.preventDefault();
            setOpen(true);
            check();
            console.log("mand---", mand);
            const res = await axios.post(`${backend_url}/configuration/config`, { "inputs": config }, Header);
            setOpen(false);
            if (!res.data.success) {
                setErr("Error in updating data");
            }
        } catch (e) {
            setErr(e.message)
            setOpen(false);
        }
    }

    function settingChange(e) {
        setConfig({ ...config, [e.target.name]: e.target.value });
        check();
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
                        <h4 className='capitailze'>{userDetails?.user_full_name} workspace / </h4><span> Profile Settings</span>
                    </div>
                    <Superuser logoutClicked={() => { setLogout(true) }} />
                </div>
            </header>

            <Dialog className="logout-dialogbox" visible={logout} style={{ width: '30vw' }} onHide={() => setLogout(false)}>
                <Logout no={() => setLogout(false)} />
            </Dialog>


            <Mlsidebar data={path} />

            <div className="middlepart">
                <h4 className='page-title green fixedsubttab'>SETTINGS</h4>
                <form className='padTop60' onSubmit={submitSetting}>
                    <div className="setting">
                        <h4>Git Configuration</h4>
                        <h6>Organizational Git</h6>
                        <input type="text" name='organization_git' onChange={settingChange} value={config?.organization_git} placeholder='Enter your Git hub url' className='settings-input' />
                        <h4>config Bucket</h4>
                        <div className="d-flex align-items-center justify-content-between gap30 padRight">
                            <div className='eachvalue'>
                                <h6>AWS Access key</h6>
                                <input type="text" name="aws_access_key_id" id="" onChange={settingChange} value={config?.aws_access_key_id} required={mand} placeholder='Enter your access key' />
                            </div>
                            <div className='eachvalue'>
                                <h6>AWS Secret key</h6>
                                <input type="text" name="aws_secret_access_key" id="" onChange={settingChange} value={config?.aws_secret_access_key} required={mand} placeholder='Enter your secret key' />
                            </div>
                            <div className='eachvalue'>
                                <h6>Region</h6>
                                <input type="text" name="region" id="" onChange={settingChange} value={config?.region} required={mand} placeholder='Enter your region' />
                            </div>
                            <div className='eachvalue'>
                                <h6>Bucket Name</h6>
                                <input type="text" name="bucket_name" id="" onChange={settingChange} value={config?.bucket_name} required={mand} placeholder='Enter your bucket name' />
                            </div>
                        </div>
                        <button type='submit' className='commonbtn'> Save </button>
                    </div>
                </form>

            </div>

        </div>
    )
}

export default Settings