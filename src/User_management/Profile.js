import React, { useEffect, useState } from 'react';
import Loading from '../Components/Loading';
import { Link, useNavigate } from 'react-router-dom';
import mllogo from "../logo/ml-logo.png";
import profilePic from "../logo/profile-pic.png"
import notificationIcon from "../logo/notification-icon.png"
import mlimage from "../logo/mlangles360logo.png";
import Mlsidebar from '../Components/Mlsidebar';
import userPhoto from "../logo/userPhoto.png";
import pencil from "../logo/pencil.png";
import lock from "../logo/lock.png";
import close from "../logo/close.png";
import tick from "../logo/tick.png";
import { FormControl, InputLabel, MenuItem, Modal, Select } from '@mui/material';
import axios from 'axios';
import Superuser from '../Components/Superuser';
import { backend_url, backend_url1 } from '../Config';
import Logout from '../Pages/Logout';
import { Dialog } from 'primereact/dialog';

const Profile = () => {
    const [open, setOpen] = useState(false);
    const [modalopen, setModalopen] = useState(false);
    const [success, setSuccess] = useState(false);
    const [department, setDepartment] = useState("");
    const [eye, setEye] = useState(true);
    const [eye1, setEye1] = useState(true);
    const navigate = useNavigate();
    const [edit, setEdit] = useState(false);
    const [name, setName] = useState("")
    const [email, setEmail] = useState("");
    const [userDetails, setUserDetails] = useState({});
    const [logout, setLogout] = useState(false);
    const [err, setErr] = useState("");
    const [changePass, setChangePass] = useState({ password: "", confirm_password: "" });
    const [changepassErr, setChangepassErr] = useState("");

    let token = JSON.parse(localStorage.getItem("mlanglesToken"));
    let Header = { headers: { "Authorization": `Bearer ${token}` } };

    const [user, setUser] = useState({
        "user_first_name": "",
        "user_last_name": "",
        "assign_role": "",
        "user_mobile": "",
        "email": "",
        "department": "",
        "business_unit": ""
    })

    let path = "profile-setting";

    let dropdown = [
        "mani",
        "manu",
        "mass",
        "manikandan",
    ];

    function errorFun() {
        setTimeout(() => {
            setErr("");
            setChangepassErr("");
        }, 4000)
    }

    async function getProfile() {
        setEdit(false);
        const res = await axios.get(`${backend_url}/settings/profile_settings`, Header);
        console.log("res----", res.data.data);
        let data1 = res.data.data;
        let phone = data1.user_mobile.split(" ");
        if (phone[1]) {
            data1["user_mobile"] = phone[1];
        } else {
            data1["user_mobile"] = phone[0];
        }
        setUser(data1);
        setName(res.data.data.user_first_name + " " + res.data.data.user_last_name);
        setEmail(res.data.data.email);
    }

    useEffect(() => {
        let token = JSON.parse(localStorage.getItem("mlanglesToken"));
        let userdetails = JSON.parse(localStorage.getItem("userDetails"));
        setUserDetails(userdetails);
        if (!token && userDetails?.permissions?.user_management_roles_admin === 0) {
            navigate("/");
        }
        getProfile();
    }, [])

    function changeHandler(e) {
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

    async function submitBtn(e) {
        try {
            e.preventDefault();
            setOpen(true);
            if (user.user_mobile.length !== 10) {
                setOpen(false);
                setErr("Enter Mobile Number correctly");
                errorFun();
            } else {
                const res = await axios.put(`${backend_url}/settings/profile_settings`, user, Header);
                console.log("res----", res);
                setOpen(false);
                if (res.data.success) {
                    setEdit(false);
                    getProfile();
                } else {
                    if (res.data.message) {
                        setErr(res.data.message);
                    } else {
                        setErr("Error in updating profile data");
                    }
                    errorFun();
                }
            }
        }
        catch (e) {
            setErr("Error in updating profile data");
            errorFun();
        }
    }

    function passing() {

    }

    async function handleFileChange(e) {
        // console.log("hiiiiiiiiiiii", e.target.files[0]);
        const img = {
            preview: URL.createObjectURL(e.target.files[0]),
            data: e.target.files[0],
        }
        let formData = new FormData();
        console.log("formData----------", formData);
        formData.append('file', img.data);

        console.log("formData----------", formData, img.data);

        let reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);

        console.log("reader---------", reader, reader.result);

        // const response = await fetch('https://45be9946-98a5-4468-abb4-7baa100885f8.mock.pstmn.io', {
        //     method: 'POST',
        //     body: formData,
        //     body: reader.result,
        // });
        // console.log("response------", response);

        // if (response) {
        // }

    }

    async function changePasswordSubmit(e) {
        e.preventDefault();
        console.log("value is -----", changePass);
        let d1 = changePass;
        d1["user_id"] = user.user_account_id;
        console.log("d1------", d1);
        if (changePass.password !== changePass.confirm_password) {
            setChangepassErr("Password didnt match");
            errorFun();
        } else {
            const res = await axios.post(`${backend_url}/change_password`, d1, Header);
            if (res.data.success) {
                let newPutData = res.data.data[0];
                newPutData.password = changePass.password;

                const putres = await axios.put(`${backend_url}/change_password`, newPutData, Header);
                setEye(true)
                setEye1(true)
                // setEye1(false)
                if (putres.data.success) {
                    setSuccess(true);
                    setModalopen(false);

                } else {
                    setChangepassErr("Error in changing password");
                    errorFun();
                }
                setChangePass({ password: "", confirm_password: "" });
            } else {
                setChangepassErr(res.data.message);
                errorFun();
            }
        }
    }

    function defaultEye() {
        setEye(true)
        setEye1(true)
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

                <h4 className='page-title green fixedsubttab'>PROFILE SETTINGS</h4>

                <div className="allcontent d-flex justify-content-between">

                    <div className="profile1">
                        {
                            err ?
                                <div className='d-flex align-items-center justify-content-center'>
                                    <h4 className='error-message'>{err}</h4>
                                </div> : <></>
                        }
                        <div className="relative d-flex align-items-center">
                            <input type="file" onChange={handleFileChange} className='fileselect' />
                            <img src={userPhoto} className='userphoto' alt="user profile photo" />
                        </div>
                        <h4 className='name'>{name} </h4>
                        <h6 className='role'>{email}</h6>
                    </div>

                    <div className="w100">
                        <form onSubmit={submitBtn} >
                            <div className="width80 inputprofile">
                                <div className="d-flex">
                                    <div className='eachboxinputprofile width50'>
                                        <label htmlFor="">First Name</label>
                                        <input autoComplete="off" type="text" required className={edit ? "editingcolor" : ""} value={user.user_first_name ? user.user_first_name : ""} name='user_first_name' onChange={edit ? changeHandler : passing} />
                                    </div>
                                    <div className='eachboxinputprofile width50'>
                                        <label htmlFor="">Last Name</label>
                                        <input autoComplete="off" type="text" required className={edit ? "editingcolor" : ""} value={user.user_last_name ? user.user_last_name : ""} name='user_last_name' onChange={edit ? changeHandler : passing} />
                                    </div>
                                </div>
                                <div className="d-flex">
                                    <div className='eachboxinputprofile width50'>
                                        <label htmlFor="">User Role </label>
                                        <input autoComplete="off" type="text" required className={edit ? "editingcolor" : ""} value={user.assign_role ? user.assign_role : ""} name='assign_role' onChange={edit ? changeHandler : passing} />
                                    </div>
                                    <div className='eachboxinputprofile width50' >
                                        <label htmlFor="">Mobile Number  </label>
                                        <input autoComplete="off" type="number" required className={edit ? "editingcolor" : ""} value={user.user_mobile ? user.user_mobile : ""} name='user_mobile' onChange={edit ? user.user_mobile.length <= 10 ? changeHandler : passing : passing} />
                                    </div>
                                </div>
                                <div className='eachboxinputprofile width100' >
                                    <label htmlFor="">Email ID  </label>
                                    <input autoComplete="off" type="email" required className={edit ? "editingcolor" : ""} value={user.email ? user.email : ""} name='email' onChange={edit ? changeHandler : passing} />
                                </div>
                                <div className="d-flex">
                                    <div className='eachboxinputprofile width50' >
                                        <label htmlFor="">Department</label>
                                        <input autoComplete="off" required type="text" className={edit ? "editingcolor" : ""} value={user.department ? user.department : ""} name='department' onChange={edit ? changeHandler : passing} />

                                        {/* <FormControl className='profile-checkbox' fullWidth>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={department}
                                        label="Select your Project"
                                        onChange={handleChange}
                                        className='dropdwon-profile'
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
                                    <div className='eachboxinputprofile width50' >
                                        <label htmlFor="">Business Unit</label>
                                        <input autoComplete="off" required type="text" className={edit ? "editingcolor" : ""} value={user.business_unit ? user.business_unit : ""} name='business_unit' onChange={edit ? changeHandler : passing} />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="change" onClick={() => setModalopen(true)}>Change Password?</h4>
                                </div>
                                <button type={edit ? "submit" : ""} className='savebtn commonbtn'>Save</button>
                            </div>
                        </form>
                    </div>

                    <div className="width10 rightside">
                        <div className="commonbtn editbtn d-flex align-items-center" onClick={() => setEdit(true)}>
                            <img src={pencil} className='pencil' alt="" /> <span>Edit </span>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                open={modalopen}
                onClose={() => { setModalopen(false); setChangePass({ password: "", confirm_password: "" }); defaultEye(); }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className='flex-center'
            >
                <div className='modalshowforgot'>
                    <img src={close} onClick={() => { setModalopen(false); setChangePass({ password: "", confirm_password: "" }); defaultEye() }} className='closex' alt="" />
                    <div className="head-forgot">
                        <img src={lock} className='lock' alt="" />
                        <p>Change password</p>
                    </div>
                    {
                        changepassErr ?
                            <div className='d-flex align-items-center justify-content-center'>
                                <h4 className='error-message marginNone'>{changepassErr}</h4>
                            </div> : <></>
                    }
                    <div className="modal-con">
                        <form onSubmit={changePasswordSubmit}>
                            <div className="each-for-box">
                                <label htmlFor="" className='labelforgot'>New Password</label>
                                <div className='posrel'>
                                    <input autoComplete="off" required type={eye ? "password" : "text"} value={changePass.password} onChange={(e) => setChangePass({ ...changePass, "password": e.target.value })} className='inputcommontextforgot' name="" id="" />
                                    <div className="eye-icon" onClick={(e) => setEye(!eye)}>
                                        {eye ? (
                                            <i className="fa-solid fa-eye-slash" ></i>
                                        ) : (
                                            <i className="fa-solid fa-eye"></i>
                                        )}
                                    </div>
                                </div>

                                {/* <label htmlFor="" className='labelforgot'>Old Password</label>
                            <input autoComplete="off" type='password' className='inputcommontextforgot' name="" id="" /> */}
                            </div>
                            <div className="each-for-box">
                                <label htmlFor="" className='labelforgot'>Confirm Password</label>
                                <div className="posrel">
                                    <input autoComplete="off" required type={eye1 ? "password" : "text"} value={changePass.confirm_password} onChange={(e) => setChangePass({ ...changePass, "confirm_password": e.target.value })} className='inputcommontextforgot' name="" id="" />
                                    <div className="eye-icon" onClick={(e) => setEye1(!eye1)}>
                                        {eye1 ? (
                                            <i className="fa-solid fa-eye-slash" ></i>
                                        ) : (
                                            <i className="fa-solid fa-eye"></i>
                                        )}
                                    </div>
                                </div>

                                {/* <label htmlFor="" className='labelforgot'>Old Password</label>
                            <input autoComplete="off" type='password' className='inputcommontextforgot' name="" id="" /> */}
                            </div>
                            <div className="flex-center">
                                <button className='commonbtn backmodalbtn' type='submit'>Save</button>
                            </div>
                        </form>

                    </div>
                </div>
            </Modal>

            <Modal
                open={success}
                onClose={() => setSuccess(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className='flex-center'
            >
                <div className='modalshowforgot'>
                    <div className="modal-con-for">
                        <div className="flex-center colwise">
                            <img src={tick} className='tick' alt="" />
                            <p className='successMess'>Your password <br />
                                changed successfully</p>
                        </div>
                        <div className="flex-center">
                            <button className='commonbtn backmodalbtn' onClick={() => { setSuccess(false) }}>Close</button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default Profile