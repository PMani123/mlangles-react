import React, { useEffect, useState } from 'react';
import Loading from '../Components/Loading';
import { Link, useNavigate, useParams } from 'react-router-dom';
import mllogo from "../logo/ml-logo.png"
import profilePic from "../logo/profile-pic.png"
import notificationIcon from "../logo/notification-icon.png"
import mlimage from "../logo/mlangles360logo.png"
import Mlsidebar from '../Components/Mlsidebar';

import pencil from "../logo/pencil.png";
import deleteIcon from "../logo/deleteIcon.png";
import plus from "../logo/plus.png";

import lock from "../logo/lock.png";
import close from "../logo/close.png";
import tick from "../logo/tick.png";
import { FormControl, MenuItem, Modal, Select } from '@mui/material';
import "./usermanage.css"
import axios from 'axios';
import Superuser from '../Components/Superuser';
import { backend_url, backend_url1 } from '../Config';
import Logout from '../Pages/Logout';
import { Dialog } from 'primereact/dialog';


const UserManage = () => {
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [newUser, setNewUser] = useState(false);
    const [assign, setAssign] = useState("");
    const [assigndata, setAssigndata] = useState([]);
    const [alldata, setAlldata] = useState([]);
    const [err, setErr] = useState("");
    const [btndisable, setBtndisable] = useState(false);
    const [userAccount, setUserAccount] = useState("");
    const navigate = useNavigate();
    const [logout, setLogout] = useState(false);

    const [userEditdata, setuserEditdata] = useState({
        "user_first_name": "",
        "user_last_name": "",
        "department": "",
        "business_unit": "",
        "assign_role": "",
        "email": "",
        "user_mobile": "",
        "user_organization": "",
    });
    const [allRoleDropdown, setAllRoleDropdown] = useState([]);
    const [userDetails, setUserDetails] = useState({});

    let token = JSON.parse(localStorage.getItem("mlanglesToken"));
    let Header = { headers: { "Authorization": `Bearer ${token}` } };
    let userdetails = JSON.parse(localStorage.getItem("userDetails"));

    const [user, setUser] = useState({});

    let path = "userManage";

    let dropdown = [
        "mani",
        "manu",
        "mass",
        "manikandan",
    ]

    async function fetchData() {
        setOpen(true);

        const res = await axios.get(`${backend_url}/settings/create_role`, Header);
        // console.log(res.data);
        const ans = await axios.get(`${backend_url}/settings/all_users`, Header);
        // console.log(ans);

        if (res.data.success) {
            setAlldata(ans.data.data);
            setOpen(false);
            setAssigndata(res.data.data);
        }
    }

    useEffect(() => {
        let token = JSON.parse(localStorage.getItem("mlanglesToken"));
        let userdetails = JSON.parse(localStorage.getItem("userDetails"));
        setUserDetails(userdetails);

        setUser({
            "user_first_name": "",
            "user_last_name": "",
            "user_mobile": "",
            "department": "",
            "business_unit": "",
            "user_organization": `${userdetails.organization}`,
            "email": "",
            "password": "",
            "re_password": "",
            "is_superuser": 0,
            "assign_role": "",
            "created_by": `${userdetails.user_full_name}`
        })

        if (userdetails) {
            if (!token || userdetails?.permissions?.user_management_roles_admin === 0) {
                navigate("/");
            }
            fetchData();
        }
    }, [])

    function newUserChanging(e) {
        let name = e.target.name;
        let value = e.target.value;
        if (name === "user_mobile") {
            if (value.length <= 10) {
                setUser({ ...user, [name]: value });
            }
        } else {
            setUser({ ...user, [name]: value });
        }
    }

    function errorFun() {
        setTimeout(() => {
            setErr("");
        }, 5000);
    }

    function createUserBtn(e) {
        setOpen(true);
        try {
            e.preventDefault();
            setOpen(true);

            if (user.user_mobile.length !== 10) {
                setOpen(false);
                setErr("Enter Correct mobile number");
                errorFun();
            } else {
                fetch(`${backend_url}/auth/users/`, {
                    method: "POST",
                    body: JSON.stringify(user),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                })
                    .then((response) => response.json())
                    .then((data) => {
                        setOpen(true);
                        let ans = Object.keys(data).length;
                        let ans1 = Object.values(data);
                        console.log("ans11----", ans1);
                        if (ans === 1) {
                            setErr(ans1[0][0]);
                            setOpen(false);
                            errorFun();
                        } else {
                            async function fetching() {
                                const res = await axios.post(`${backend_url}/settings/assign_instance_ip_to_user`, { "user_account_id": data.user_account_id }, Header);
                                if (res.data.success) {
                                    console.log("success");
                                }
                                setUser({
                                    "user_first_name": "",
                                    "user_last_name": "",
                                    "user_mobile": "",
                                    "department": "",
                                    "business_unit": "",
                                    "user_organization": `${userDetails.organization}`,
                                    "email": "",
                                    "password": "",
                                    "re_password": "",
                                    "is_superuser": 0,
                                    "assign_role": "",
                                    "created_by": `${userDetails.user_full_name}`
                                });
                                setOpen(false)
                                setNewUser(false);
                                fetchData();
                            }
                            fetching();
                        }
                    });
            }
        }
        catch (e) {
            console.log(e);
            setOpen(false);
        }
    }

    async function deleteUser() {
        let usercheckbox = document.getElementsByClassName("usercheckbox");
        console.log(usercheckbox);
        let selected = []
        for (let i of usercheckbox) {
            if (i.checked) {
                selected.push(i.value);
            }
        }
        if (selected.length > 0) {
            setOpen(true);
            const res = await axios.delete(`${backend_url}/settings/all_users`, { data: { "user_id": selected }, headers: { "Authorization": `Bearer ${token}` } });
            console.log(res);
            if (res.data.success) {
                setBtndisable(false);
                fetchData();
            }
        }
        uncheckAll();
    }

    function uncheckAll() {
        const checkboxAll = document.querySelectorAll("[type=checkbox]");
        for (let i of checkboxAll) {
            console.log(i);
            if (i.checked) {
                i.checked = false;
            }
        }
    }

    function userCheckBoxChange(e) {
        console.log(e);
        let count = 0
        let usercheckbox = document.getElementsByClassName("usercheckbox");
        for (let i of usercheckbox) {
            if (i.checked) {
                count += 1
            }
            if (count >= 2) {
                setBtndisable(true);
                break;
            } else {
                setBtndisable(false);
            }
        }
    }

    async function userEditBtn() {
        let usercheckbox = document.getElementsByClassName("usercheckbox");
        const getRole = await axios.get(`${backend_url}/settings/create_role`, Header);

        if (getRole.data.success) {
            setAllRoleDropdown(getRole.data.data);
        }
        for (let i of usercheckbox) {
            if (i.checked) {
                console.log(i.value);
                let value1 = Number(i.value)
                for (let x = 0; x < alldata.length; x++) {
                    console.log("hcgvjkuegf", i.value, typeof i.value, alldata[x].user_account_id, typeof alldata[x].user_account_id);

                    if (value1 === alldata[x].user_account_id) {
                        console.log("matxhde--", alldata[x]);
                        setuserEditdata(alldata[x]);
                        setuserEditdata({ ...alldata[x], "user_id": value1 });
                    }
                }
                setEditOpen(true);
            }
        }

    }

    function userEditChange(e) {
        console.log(e.target.value, e.target.name);
        setuserEditdata({ ...userEditdata, [e.target.name]: e.target.value });
    }

    async function saveChangeUser(e) {
        uncheckAll();
        e.preventDefault();
        console.log(userEditdata);
        setOpen(true);
        const updating = await axios.put(`${backend_url}/settings/edit_all_users`, userEditdata, Header);
        console.log(updating);
        if (updating.data.success) {
            fetchData();
            setEditOpen(false);
        }
    }

    function pass() {

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
                        <h4 className='capitailze'>{userDetails?.user_full_name} workspace / </h4><span> User & Role Management/ </span> <span>User Management</span>
                    </div>
                    <Superuser logoutClicked={() => { setLogout(true) }} />

                </div>
            </header>

            <Dialog className="logout-dialogbox" visible={logout} style={{ width: '30vw' }} onHide={() => setLogout(false)}>
                <Logout no={() => setLogout(false)} />
            </Dialog>

            <Mlsidebar data={path} />
            <div className="middlepart">

                <div>
                    <div className='d-flex backgrey fixedsubttab'>
                        <h4 className='page-title green'>USER MANAGEMENT</h4>
                        <Link to="/rolemanage/false"><h4 className='page-title'>ROLE MANAGEMENT</h4></Link>
                    </div>

                    {
                        !newUser
                            ?
                            <>
                                <div className="inneruser">
                                    {
                                        err ?
                                            <div className='d-flex align-items-center justify-content-center'>
                                                <h4 className='error-message'>{err}</h4>
                                            </div> : <></>
                                    }
                                    <div className='d-flex justify-content-end align-items-center'>
                                        <div className='d-flex' >
                                            <div className="eachbutton commonbackbtn" onClick={() => setNewUser(true)} >
                                                <img src={plus} alt="" /> <span>New User</span>
                                            </div>
                                            {
                                                btndisable ?
                                                    <div className="commonbtn opacity50">
                                                        <img src={pencil} alt="" /> <span>Edit</span>
                                                    </div>
                                                    :

                                                    <div className="commonbtn" onClick={() => userEditBtn()}>
                                                        <img src={pencil} alt="" /> <span>Edit</span>
                                                    </div>
                                            }

                                            <div className="commonbtn" onClick={() => deleteUser()} >
                                                <img src={deleteIcon} alt="" /> <span>Delete</span>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="usertable">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th className='padlef40'>FULL NAME </th>
                                                    <th>USER EMAIL</th>
                                                    <th>USER ROLE</th>
                                                    <th>DEPARTMENT</th>
                                                    <th>BUSINESS UNIT</th>
                                                    <th>CREATED BY</th>
                                                    <th>CREATED AT</th>
                                                    <th>STATUS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {alldata.map((data, idx) => {
                                                    // console.log(data)
                                                    return (
                                                        <tr key={idx}>
                                                            <td className='hovername d-flex align-items-center'><input type="checkbox" className='usercheckbox' value={data.user_account_id} onChange={userCheckBoxChange} /> {data.user_first_name} {data.user_last_name} </td>
                                                            <td>{data.email} </td>
                                                            <td>{data.assign_role} </td>
                                                            <td>{data.department} </td>
                                                            <td>{data.business_unit} </td>
                                                            <td>{data.created_by} </td>
                                                            <td>{data.record_created_date} </td>
                                                            {data.is_active ? <td className='green'>Active </td> : <td className='blue'>Pending</td>}
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <Modal
                                    open={editOpen}
                                    onClose={() => setEditOpen(false)}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                    className='flex-center'
                                >
                                    <div className='modalshowforgot modaledit'>
                                        <img src={close} onClick={() => setEditOpen(false)} className='closex' alt="" />

                                        <div className="modal-con">
                                            <h4 className='green edit-title'>Edit User</h4>
                                            <form action="" onSubmit={saveChangeUser}>

                                                <div className="d-flex gap20">
                                                    <div className="each-for-box">
                                                        <label htmlFor="" className='labelforgot'>First Name</label>
                                                        <input autoComplete="off" required type="text" value={userEditdata?.user_first_name} className='inputcommontextforgot' name="user_first_name" id="" onChange={userEditChange} />
                                                    </div>
                                                    <div className="each-for-box">
                                                        <label htmlFor="" className='labelforgot'>Last Name</label>
                                                        <input autoComplete="off" required type="text" value={userEditdata?.user_last_name} className='inputcommontextforgot' name="user_last_name" id="" onChange={userEditChange} />
                                                    </div>
                                                </div>

                                                <div className="d-flex gap20">
                                                    <div className="each-for-box">
                                                        <label htmlFor="" className='labelforgot'>Email ID</label>
                                                        <input autoComplete="off" required type="email" value={userEditdata?.email} className='inputcommontextforgot' name="email" id="" onChange={userEditChange} />
                                                    </div>
                                                    <div className="each-for-box">
                                                        <label htmlFor="" className='labelforgot'>Assign User Role</label>
                                                        <FormControl fullWidth>
                                                            <Select
                                                                labelId="demo-simple-select-label"
                                                                id="demo-simple-select"
                                                                value={userEditdata?.assign_role}
                                                                // value="manikandan"
                                                                label="Select your Project"
                                                                onChange={userEditChange}
                                                                className='dropdwon-user'
                                                                name='assign_role'
                                                                required
                                                            >
                                                                {allRoleDropdown.map((data, idx) => {
                                                                    return (
                                                                        <MenuItem key={idx} value={data}>{data}</MenuItem>
                                                                    )
                                                                })
                                                                }
                                                            </Select>
                                                        </FormControl>
                                                    </div>
                                                </div>

                                                <div className="d-flex gap20">
                                                    <div className="each-for-box">
                                                        <label htmlFor="" className='labelforgot'>Department</label>
                                                        <input autoComplete="off" required type="text" value={userEditdata?.department} className='inputcommontextforgot' name="department" id="" onChange={userEditChange} />

                                                        {/* <FormControl fullWidth>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={userEditdata?.department}
                                                        label="Select your Project"
                                                        onChange={userEditChange}
                                                        className='dropdwon-user'
                                                        name='department'
                                                    >
                                                        {dropdown.map((data, idx) => {
                                                            return (
                                                                <MenuItem key={idx} value={data}>{data}</MenuItem>
                                                            )
                                                        })
                                                        }
                                                    </Select>
                                                </FormControl> */}
                                                    </div>
                                                    <div className="each-for-box">
                                                        <label htmlFor="" className='labelforgot'>Business Unit</label>
                                                        <input autoComplete="off" required type="text" value={userEditdata?.business_unit} className='inputcommontextforgot' name="business_unit" id="" onChange={userEditChange} />
                                                    </div>
                                                </div>

                                                <div className="d-flex justify-content-start modaleditbtn">
                                                    <button className='commonbtn commonbackbtn backmodalbtn' type='submit'>Save</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </Modal>
                            </>
                            :
                            <form onSubmit={createUserBtn}>
                                <div className='inside-newuser'>
                                    {
                                        err ?
                                            <div className='d-flex align-items-center justify-content-center'>
                                                <h4 className='error-message'>{err}</h4>
                                            </div> : <></>
                                    }
                                    <div className="width50">
                                        <div className="d-flex gap30">
                                            <div className="each-for-box">
                                                <label htmlFor="" className='labelforgot'>First Name</label>
                                                <input autoComplete="off" type="text" required className='inputcommontextforgot' name="user_first_name" onChange={newUserChanging} id="" />
                                            </div>
                                            <div className="each-for-box">
                                                <label htmlFor="" className='labelforgot'>Last Name</label>
                                                <input autoComplete="off" type="text" required className='inputcommontextforgot' name="user_last_name" onChange={newUserChanging} id="" />
                                            </div>
                                        </div>
                                        <div className="d-flex gap30">
                                            <div className="each-for-box">
                                                <label htmlFor="" className='labelforgot'>Email ID</label>
                                                <input autoComplete="off" type="email" required className='inputcommontextforgot' name="email" onChange={newUserChanging} id="" />
                                            </div>
                                            <div className="each-for-box">
                                                <label htmlFor="" className='labelforgot'>Phone Number</label>
                                                <input type="number" required className='inputcommontextforgot' value={user.user_mobile} name="user_mobile" onChange={user.user_mobile.length <= 10 ? newUserChanging : pass} id="" />
                                            </div>
                                        </div>

                                        <div className="d-flex gap30">
                                            <div className="each-for-box">
                                                <label htmlFor="" className='labelforgot'>Department</label>
                                                <input autoComplete="off" type="text" required className='inputcommontextforgot' name="department" onChange={newUserChanging} id="" />
                                            </div>
                                            <div className="each-for-box">
                                                <label htmlFor="" className='labelforgot'>Business Unit</label>
                                                <input autoComplete="off" type="text" required className='inputcommontextforgot' name="business_unit" onChange={newUserChanging} id="" />
                                            </div>
                                        </div>

                                        <div className="d-flex gap30">
                                            <div className="each-for-box">
                                                <label htmlFor="" className='labelforgot'>Password</label>
                                                <input autoComplete="off" type="text" required className='inputcommontextforgot' name="password" onChange={newUserChanging} id="" />
                                            </div>
                                            <div className="each-for-box">
                                                <label htmlFor="" className='labelforgot'>Confirm Password</label>
                                                <input autoComplete="off" type="text" required className='inputcommontextforgot' name="re_password" onChange={newUserChanging} id="" />
                                            </div>
                                        </div>

                                        <div className="d-flex gap30 align-items-center">
                                            <div className="each-for-box">
                                                <label htmlFor="" className='labelforgot'>Assign User Role</label>
                                                <FormControl fullWidth>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={user.assign_role}
                                                        label="Select your Project"
                                                        onChange={newUserChanging}
                                                        className='dropdwon-user'
                                                        name="assign_role"
                                                        required
                                                    >
                                                        {assigndata.map((data, idx) => {
                                                            return (
                                                                <MenuItem key={idx} name="assign_role" value={data}>{data}</MenuItem>
                                                            )
                                                        })
                                                        }
                                                    </Select>
                                                </FormControl>
                                            </div>
                                            <div className="each-boxing">
                                                <Link to="/rolemanage/true">
                                                    <div className="eachbutton commonbackbtn buttonnewrole" onClick={() => setEditOpen(true)}>
                                                        <img src={plus} alt="" /> <span>New User Role</span>
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>

                                        {/* <div className='details'>
                                    <div>
                                        <h2>1.Projects</h2>
                                        <ul>
                                            <li>Edit/ delete/ modify all projects</li>
                                            <li>Assigned members to my projects</li>
                                            <li>Edit/ delete/ modify Assigned projects</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h2>2.Experiments</h2>
                                        <ul>
                                            <li>View Runs</li>
                                            <li>Edit/delete/modify runs</li>
                                        </ul>
                                    </div>
                                </div> */}

                                        {/* <button type='submit' className='commonbtn commonbackbtn createuserbtn ' onClick={() => { createUserBtn() }} >Create User</button> */}
                                        <button type='submit' className='commonbtn commonbackbtn createuserbtn' >Create User</button>
                                    </div>
                                </div>
                            </form>
                    }
                </div>
            </div>
        </div>

    )
}

export default UserManage