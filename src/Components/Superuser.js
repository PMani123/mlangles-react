import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import profileIcon from "../logo/profileIcon.png";
import userIcon from "../logo/userIcon.png";
import logout from "../logo/logout.png";
import settings from "../logo/settings.png";
import profilePic from "../logo/profile-pic.png";

const Superuser = ({ logoutClicked }) => {

    const [permission, setPermission] = useState({});

    useEffect(() => {
        fetchData();
    }, [])

    async function fetchData() {
        let userDetails = JSON.parse(localStorage.getItem("userDetails"));
        if (userDetails) {
            setPermission(userDetails.permissions);
        }
    }

    return (
        <div className=" d-flex justify-content-start profilePic btn-group">
            <div>
                <div className='d-flex align-items-center'>
                    <Link to="/settings" >
                        <img src={settings} alt="" className='settings-icon' />
                    </Link>

                    <img
                        src={profilePic}
                        alt="Profile Picture"
                        className="btn dropdown-toggle img-responsive headicon"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    />

                    <ul className="dropdown-menu">
                        <li>
                            <Link to="/profile">
                                <span className="dropdown-item d-flex align-items-center" >
                                    <img src={profileIcon} alt="" /> <span className='dropContent'>Profile Settings</span>
                                </span>
                            </Link>
                        </li>
                        {
                            permission.user_management_roles_admin === 0 ? <></> :
                                <>
                                    <li>
                                        <Link to="/usermanage">
                                            <span className="dropdown-item d-flex align-items-center" >
                                                <img src={userIcon} alt="" /><span className='dropContent'> User & Role Management </span>
                                            </span>
                                        </Link>
                                    </li>
                                </>
                        }
                        <li>
                            <Link>
                                <span className="dropdown-item d-flex align-items-center" onClick={() => { console.log("logout----"); logoutClicked(); }} >
                                    <img src={logout} alt="" /><span className='dropContent'> Logout </span>
                                </span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Superuser