import React, { useEffect, useState } from 'react'
import Superuser from '../Components/Superuser'
import mllogo from "../logo/ml-logo.png"
import profilePic from "../logo/profile-pic.png"
import mlimage1 from "../logo/mlangles360logo.png";
import Mlsidebar from '../Components/Mlsidebar';
import { useNavigate } from 'react-router';
import Logout from './Logout';
import { Dialog } from 'primereact/dialog';

const Monitoring = () => {
    const [userDetails, setUserDetails] = useState({});
    const navigate = useNavigate();
    const [logout, setLogout] = useState(false);

    let path = "monitoring";

    useEffect(() => {
        let token = JSON.parse(localStorage.getItem("mlanglesToken"));
        let userdetails = JSON.parse(localStorage.getItem("userDetails"));
        setUserDetails(userdetails);
        if (userdetails) {
            if (!token || userDetails?.permissions?.dashboard === 0) {
                navigate("/");
            }
        }
    }, []);

    return (
        <div className="home dashboard">
            <header>
                <div className='d-flex align-items-center justify-content-between' >
                    <div className="d-flex align-items-center">
                        <div className='logohover'>
                            <div className='mllogo'>
                                <img src={mllogo} alt="mlangles logo" />
                            </div>
                            <div className="newlogo">
                                <img src={mlimage1} className='newlogos' alt="" />
                            </div>
                        </div>
                        <h4 className='capitailze'>{userDetails?.user_full_name} workspace / </h4><span> Monitoring</span>
                    </div>
                    <Superuser logoutClicked={() => { setLogout(true) }} />

                </div>
            </header>
            <Dialog className="logout-dialogbox" visible={logout} style={{ width: '30vw' }} onHide={() => setLogout(false)}>
                <Logout no={() => setLogout(false)} />
            </Dialog>

            <Mlsidebar data={path} />
            <div className="middlepart1">
                {/* <iframe src="https://en.wikipedia.org/wiki/A._P._J._Abdul_Kalam" frameBorder="0"></iframe> */}
                <iframe src="http://54.84.62.198:3000/dashboards" id="monitor-dashboard" title='grafana dashboard' frameBorder="0"></iframe>
            </div>
        </div>
    )
}

export default Monitoring