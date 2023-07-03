import React, { useEffect, useState } from 'react';
import Loading from '../Components/Loading';
import { Link, useNavigate, useParams } from 'react-router-dom';
import mllogo from "../logo/ml-logo.png"
import profilePic from "../logo/profile-pic.png"
import notificationIcon from "../logo/notification-icon.png"
import mlimage from "../logo/mlangles360logo.png"
import Mlsidebar from '../Components/Mlsidebar';
import { Dialog } from 'primereact/dialog';


import pencil from "../logo/pencil.png";
import deleteIcon from "../logo/deleteIcon.png";
import plus from "../logo/plus.png";
import close from "../logo/close.png";
import axios from 'axios';
import Superuser from '../Components/Superuser';
import { backend_url, backend_url1 } from '../Config';
import Logout from '../Pages/Logout';
import { Modal } from '@mui/material';

const RoleManage = () => {
    const [open, setOpen] = useState(false);
    const [createRole, setCreateRole] = useState(false);
    const [edit, setEdit] = useState(false);
    const [rolename, setRolename] = useState("");
    const [roledata, setRoledata] = useState([]);
    const [btndisable, setBtndisable] = useState(false);
    const { createUser } = useParams();
    const [editRoledata, setEditRoledata] = useState({});
    const navigate = useNavigate();
    const [moduleAndpolicydata, setmoduleAndpolicyData] = useState([]);
    const [editRoleName, setEditRoleName] = useState("");
    const [currentpage, setCurrentpage] = useState("");
    const [userDetails, setUserDetails] = useState({});
    const [logout, setLogout] = useState(false);
    const [roleErr, setRoleErr] = useState("");

    let path = "profile";

    let token = JSON.parse(localStorage.getItem("mlanglesToken"));
    let Header = { headers: { "Authorization": `Bearer ${token}` } };

    useEffect(() => {
        let token = JSON.parse(localStorage.getItem("mlanglesToken"));
        let userdetails = JSON.parse(localStorage.getItem("userDetails"));
        setUserDetails(userdetails);
        if (userdetails) {
            if (!token || userDetails?.permissions?.user_management_roles_admin === 0) {
                navigate("/");
            }
            let data = window.location.href.split("/");
            console.log(data[data.length - 2]);
            setCurrentpage(data[data.length - 2]);
            fetchData();
        }
    }, [])

    async function fetchData() {
        setOpen(true);
        let show = window.location.href.split("/");
        let showRole = show[show.length - 1];

        if (showRole === "true") {
            setCreateRole(true);
        } else {
            setCreateRole(false);
        }

        const res = await axios.get(`${backend_url}/settings/get_all_polices_or_roles`, Header);
        if (res.data.success) {
            setOpen(false);
            setRoledata(res.data.data);
        }
    }

    async function createRoleBtn(e) {
        e.preventDefault();
        console.log("rolename-------", rolename);
        if (rolename.length === 0) {
            setRoleErr("Enter role name");
            setTimeout(() => {
                setRoleErr("");
            }, 4000)
        } else {
            const radiocheck = document.getElementsByClassName("radioChecking1");
            let newData = {
                "user_account_role_name": "",
                "user_management_roles_admin": 0,
                "projects_admin": 0,
                "is_pipeline": 0,
                "experiments": 0,
                "is_serve": 0,
                "is_jupyter": 0,
                "dashboard": 0
            };
            newData = { ...newData, "user_account_role_name": rolename };
            for (let i of radiocheck) {
                if (i.checked) {
                    newData = { ...newData, [i.name]: i.value }
                }
            }
            setOpen(true);
            const res = await axios.post(`${backend_url}/settings/create_role`, newData, Header);
            if (res.data.success) {
                console.log("create role-----------");
                setCreateRole(false);
                setRolename("");
                navigate("/rolemanage/false");
                fetchData();
            } else {
                setCreateRole(false);
                setRolename("");
                navigate("/rolemanage/false");
                fetchData();
            }
        }
    }

    async function deleteBtn(e) {
        e.preventDefault();
        let checkboxRole = document.getElementsByClassName("checkboxForRole");
        // console.log(checkboxRole);
        let selected = []
        for (let i of checkboxRole) {
            if (i.checked) {
                console.log(i.value);
                selected.push(i.value);
                i.checked = false;
            }
        }
        console.log(selected);
        if (selected.length > 0) {

            setOpen(true);
            const res = await axios.delete(`${backend_url}/settings/edit_delete_roles`, { headers: { "Authorization": `Bearer ${token}` }, data: { "role_id": selected } });
            if (res.data.success) {
                // setOpen(false);
                fetchData();
            }
        }
    }

    function radioChanging(e) {
        var count = 0;
        let radioChange = document.getElementsByClassName("checkboxForRole");
        console.log(radioChange);

        for (let i of radioChange) {
            if (i.checked) {
                count += 1;
                console.log(i.value);
            }

            if (count >= 2) {
                setBtndisable(true);
                break;
            } else {
                setBtndisable(false);
            }
        }
    }

    function pass() {
    }

    function editBtnRole() {
        let checkboxForRole = document.getElementsByClassName("checkboxForRole");
        let id;
        for (let i of checkboxForRole) {
            if (i.checked) {
                id = i.value;
                break;
            }
        }

        let selected = {};
        for (let i of roledata) {
            if (i.id === Number(id)) {
                setEdit(true);
                setEditRoledata(i);
                selected = i;
                console.log("roledata------", i)
                setEditRoleName(i.user_role);
                console.log("i.user_role-------", i.user_role)
            }
        }

        let moduleAndpolicy1 = {
            "user_management_roles_admin": { "policies": ["Assign/Modify user roles", "Update the profile info of any user", "None"], "value": 0, "name": "User Management" },
            "projects_admin": { "policies": ["Edit/modify all projects", "Edit/modify my projects", "Edit/modify assigned projects", "None"], "value": 0, "name": "User Management" },
            "is_jupyter": { "policies": ["Access Jupyter Notebook"], "value": 0, "name": "Jupyter Notebook" },
            "is_pipeline": { "policies": ["Edit/modify pipelines"], "value": 0, "name": "Pipelines" },
            "experiments": { "policies": ["View Runs", "Edit/modify runs", "None"], "value": 0, "name": "Experiments" },
            "is_serve": { "policies": ["View Serving"], "value": 0, "name": "Serving" },
            "dashboard": { "policies": ["View dashboards", "Edit/modify monitoring dashboards", "None"], "value": 0, "name": "Monitoring" },
        };

        console.log("selected----", selected)
        let onlyPolicy = selected.policies;
        console.log("onlyPolicy--", onlyPolicy);
        for (let i in onlyPolicy) {
            console.log(i)
            let keyName = ""
            if (i === "user_management") {
                keyName = "user_management_roles_admin"
            } else if (i === "projects") {
                keyName = "projects_admin"
            }
            else if (i === "pipeline") {
                keyName = "is_pipeline"
            }
            else if (i === "experiments") {
                keyName = "experiments"
            }
            else if (i === "serving") {
                keyName = "is_serve"
            }
            else if (i === "jupyter") {
                keyName = "is_jupyter"
            }
            else if (i === "monitoring") {
                keyName = "dashboard"
            }

            if (onlyPolicy[i].length !== 0) {
                let data = moduleAndpolicy1[keyName].policies;
                for (let x = 0; x < data.length; x++) {
                    if (data[x] === onlyPolicy[i][0]) {
                        // console.log(onlyPolicy[i][0]);
                        moduleAndpolicy1[keyName].value = x + 1;
                    }
                }
            }
        }
        // moduleAndpolicy1["user_account_role_name"] = "hi"
        console.log(moduleAndpolicy1);
        setmoduleAndpolicyData(moduleAndpolicy1);
    }

    async function saveEdit() {
        setOpen(true);
        let editmodalchecking = document.getElementsByClassName("editmodalchecking");
        let newData = {
            "user_account_role_name": "",
            "user_management_roles_admin": 0,
            "projects_admin": 0,
            "is_pipeline": 0,
            "experiments": 0,
            "is_serve": 0,
            "is_jupyter": 0,
            "dashboard": 0
        };

        newData = { ...newData, "user_account_role_name": editRoleName };

        for (let i of editmodalchecking) {
            if (i.checked) {
                newData = { ...newData, [i.name]: i.value }
            }
        }
        console.log("newdata----", newData);
        // setEdit(false);
        let roleID = 0;
        const checkboxForRole = document.getElementsByClassName("checkboxForRole");
        for (let i of checkboxForRole) {
            console.log("checkboxForRole----", i)
            if (i.checked) {
                console.log(i.value);
                roleID = i.value;
            }
        }
        const getData = await axios.post(`${backend_url}/settings/edit_delete_roles`, {
            "role_id": roleID
        }, Header);

        if (getData.data.success) {
            let insideData = getData.data.data;
            newData["role_id"] = roleID;
            newData["user_organization"] = insideData["user_organization"];
            newData["user_account_role_id"] = roleID;
            // console.log("newdTaa----------", newData);
            const res = await axios.put(`${backend_url}/settings/edit_delete_roles`, newData, Header);
            if (res.data.success) {
                setEdit(false);
                fetchData();
            }
        }
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
                        <h4 className='capitailze'>{userDetails?.user_full_name} workspace / </h4><span> User & Role Management/ </span> {currentpage === "rolemanage" ? <span>Role Management</span> : <span>User Management</span>}
                    </div>
                    <Superuser logoutClicked={() => { setLogout(true) }} />

                </div>
            </header>

            <Dialog className="logout-dialogbox" visible={logout} style={{ width: '30vw' }} onHide={() => setLogout(false)}>
                <Logout no={() => setLogout(false)} />
            </Dialog>

            <Mlsidebar data={path} />

            <div className="middlepart">
                <div className='d-flex backgrey fixedsubttab'>
                    <Link to="/usermanage"><h4 className='page-title'>USER MANAGEMENT</h4></Link>
                    <h4 className='page-title green'>ROLE MANAGEMENT</h4>
                </div>
                {createRole ?
                    <div className="innerrole role">
                        {/* <form onSubmit={createRoleBtn}> */}
                        {
                            roleErr ? <div className="text-center error-message">
                                {roleErr}
                            </div> : <></>
                        }
                        <form>
                            <div className="d-flex align-items-center">
                                <label htmlFor="">Role Name</label>
                                <input autoComplete="off" type="text" className='roleinput' required value={rolename} onChange={(e) => setRolename(e.target.value)} />
                            </div>
                            <div className="policies">
                                <h6 className='selectpolicy'>Select Policies</h6>
                                <div className="d-flex tables width50">
                                    <div className="width40 th module-right">Modules Available</div>
                                    <div className="width60 th policyspace">Policies</div>
                                </div>
                                <div className="insideTable">
                                    <div className="d-flex width50  border-bott">
                                        <div className="width40 align-border-bot">
                                            <div className='d-flex paddleft'>
                                                {/* <input type="checkbox" />  */}
                                                <label htmlFor=""> User Management </label>
                                            </div>
                                        </div>
                                        <div className="width60">
                                            <div>
                                                <div className='d-flex eachcheck'>
                                                    <input type="radio" name='user_management_roles_admin' className='radioChecking radioChecking1' value="1" /> <label htmlFor="">Assign/Modify user roles  </label>
                                                </div>
                                                <div className='d-flex eachcheck'>
                                                    <input type="radio" name='user_management_roles_admin' className='radioChecking radioChecking1' value="2" /> <label htmlFor="">Update the profile info of any user </label>
                                                </div>
                                                <div className='d-flex eachcheck'>
                                                    <input type="radio" name='user_management_roles_admin' className='radioChecking radioChecking1' value="0" /> <label htmlFor="">None</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex width50  border-bott">
                                        <div className="width40 align-border-bot">
                                            <div className='d-flex paddleft'>
                                                {/* <input type="radio" /> */}
                                                <label htmlFor=""> Projects </label>
                                            </div>
                                        </div>
                                        <div className="width60">
                                            <div>
                                                <div className='d-flex eachcheck'>
                                                    <input type="radio" name='projects_admin' className='radioChecking radioChecking1' value="1" /> <label htmlFor=""> Edit/modify all projects</label>
                                                </div>
                                                <div className='d-flex eachcheck'>
                                                    <input type="radio" name='projects_admin' className='radioChecking radioChecking1' value="2" /> <label htmlFor=""> Edit/modify my projects</label>
                                                </div>
                                                <div className='d-flex eachcheck'>
                                                    <input type="radio" name='projects_admin' className='radioChecking radioChecking1' value="3" /> <label htmlFor=""> Edit/modify assigned projects</label>
                                                </div>
                                                <div className='d-flex eachcheck'>
                                                    <input type="radio" name='projects_admin' className='radioChecking radioChecking1' value="0" /> <label htmlFor="">None</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex width50  border-bott">
                                        <div className="width40 align-border-bot">
                                            <div className='d-flex paddleft'>
                                                {/* <input type="radio" />  */}
                                                <label htmlFor="">Jupyter Notebook</label>
                                            </div>
                                        </div>
                                        <div className="width60">
                                            <div>
                                                <div className='d-flex eachcheck'>
                                                    <input type="checkbox" name='is_jupyter' className='radioChecking radioChecking1' value="1" /> <label htmlFor="">Access Jupyter Notebook</label>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex width50  border-bott">
                                        <div className="width40 align-border-bot">
                                            <div className='d-flex paddleft'>
                                                {/* <input type="radio" />  */}
                                                <label htmlFor="">Pipelines</label>
                                            </div>
                                        </div>
                                        <div className="width60">
                                            <div>
                                                <div className='d-flex eachcheck'>
                                                    <input type="checkbox" name='is_pipeline' className='radioChecking radioChecking1' value="1" /> <label htmlFor=""> Edit/modify pipelines</label>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex width50  border-bott">
                                        <div className="width40 align-border-bot">
                                            <div className='d-flex paddleft'>
                                                {/* <input type="radio" />  */}
                                                <label htmlFor="">Experiments</label>
                                            </div>
                                        </div>
                                        <div className="width60">
                                            <div>
                                                <div className='d-flex eachcheck'>
                                                    <input type="radio" name='experiments' className='radioChecking radioChecking1' value="1" /> <label htmlFor=""> View Runs</label>
                                                </div>
                                                <div className='d-flex eachcheck'>
                                                    <input type="radio" name='experiments' className='radioChecking radioChecking1' value="2" /> <label htmlFor=""> Edit/modify runs</label>
                                                </div>
                                                <div className='d-flex eachcheck'>
                                                    <input type="radio" name='experiments' className='radioChecking radioChecking1' value="0" /> <label htmlFor="">None</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex width50  border-bott">
                                        <div className="width40 align-border-bot">
                                            <div className='d-flex paddleft'>
                                                {/* <input type="radio" /> */}
                                                <label htmlFor="">Serving</label>
                                            </div>
                                        </div>
                                        <div className="width60">
                                            <div>
                                                <div className='d-flex eachcheck'>
                                                    <input type="checkbox" name='is_serve' className='radioChecking radioChecking1' value="1" /> <label htmlFor="">View Serving</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex width50  border-bott">
                                        <div className="width40 align-border-bot">
                                            <div className='d-flex paddleft'>
                                                {/* <input type="radio" /> */}
                                                <label htmlFor="">Monitoring</label>
                                            </div>
                                        </div>
                                        <div className="width60">
                                            <div>
                                                <div className='d-flex eachcheck'>
                                                    <input type="radio" name='dashboard' className='radioChecking radioChecking1' value="1" /> <label htmlFor="">View dashboards</label>
                                                </div>
                                                <div className='d-flex eachcheck'>
                                                    <input type="radio" name='dashboard' className='radioChecking radioChecking1' value="2" /> <label htmlFor="">Edit/modify monitoring dashboards</label>
                                                </div>
                                                <div className='d-flex eachcheck'>
                                                    <input type="radio" name='dashboard' className='radioChecking radioChecking1' value="0" /> <label htmlFor="">None</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className='d-flex create-btn'>
                                    <div className="commonbtn" type="submit" onClick={(e) => createRoleBtn(e)} >Create user role</div>
                                    {/* <div className="commonbtn" type="submit" >Create user role</div> */}
                                </div>
                            </div>
                        </form>
                    </div>
                    :
                    <>

                        <div className="allroles">
                            <div className='d-flex justify-content-end align-items-center marBot12'>
                                <div className='d-flex fullsetbtn' >
                                    <div className="commonbtn" onClick={() => setCreateRole(true)} >
                                        <img src={plus} alt="" /> <span>Create New Role</span>
                                    </div>
                                    <div className={btndisable ? "commonbtn opacity50" : "commonbtn"} onClick={() => { btndisable ? pass() : editBtnRole() }}>
                                        <img src={pencil} alt="" /> <span>Edit</span>
                                    </div>
                                    <div className="commonbtn" onClick={deleteBtn} >
                                        <img src={deleteIcon} alt="" /> <span>Delete</span>
                                    </div>
                                </div>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th className='padleft46'>User Roles</th>
                                        <th>Policies</th>
                                        <th>Created By</th>
                                        <th>Created At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roledata?.map((ele, idx) => {
                                        let newArray = [];
                                        for (let i in ele.policies) {
                                            if (ele.policies[i][0]) {
                                                newArray.push({ [i]: ele.policies[i][0] })
                                            }
                                        }
                                        return (
                                            <tr key={idx}>
                                                <td>
                                                    <div className='d-table-td-top'>
                                                        <input onChange={radioChanging} type="checkbox" className='checkboxForRole' value={ele.id} /><label htmlFor="">{ele?.user_role} </label>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className='details'>
                                                        {
                                                            newArray.map((dataKey, index) => {
                                                                let key = Object.keys(dataKey);
                                                                let value = Object.values(dataKey);
                                                                return (
                                                                    <div key={index}>
                                                                        <h2>{index + 1}. {key} </h2>
                                                                        <ul>
                                                                            <li>{value}</li>
                                                                        </ul>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className='d-table-td-top'>{ele.created_by}</div>
                                                </td>
                                                <td>
                                                    <div className='d-table-td-top'>
                                                        {ele.created_at}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                    }

                                </tbody>
                            </table>
                        </div>
                        <Modal
                            open={edit}
                            onClose={() => setEdit(false)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                            className='flex-center'
                        >
                            <div className='editmodal'>
                                <img src={close} onClick={() => setEdit(false)} className='closex' alt="" />
                                <div className='edit-content'>
                                    <h4>Edit User Role</h4>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h2 className='rolename' >Role Name :    <input className='rolename' type="text" value={editRoleName} onChange={(e) => setEditRoleName(e.target.value)} /></h2>
                                    </div>
                                    <div className="editmodal-table">
                                        <div className="d-flex tables width100">
                                            <div className="width50 th module-right">Modules Available</div>
                                            <div className="width50 th policyspace">Policies</div>
                                        </div>
                                        <div className="insideTable modaleditpopup">
                                            {
                                                Object.keys(moduleAndpolicydata).map((ele, index) => {
                                                    let mappingData = {
                                                        "user_management_roles_admin": "User Management",
                                                        "projects_admin": "Projects",
                                                        "is_jupyter": "Jupyter Notebook",
                                                        "is_pipeline": "Pipelines",
                                                        "experiments": "Experiments",
                                                        "is_serve": "Serving",
                                                        "dashboard": "Monitoring"
                                                    }
                                                    return (
                                                        // <></>
                                                        <div className="d-flex width100 border-bott" key={index}>
                                                            <div className="width50 align-border-bot">
                                                                <div className='d-flex paddleft'>
                                                                    <label htmlFor=""> {mappingData[ele]} </label>
                                                                </div>
                                                            </div>
                                                            <div className="width50">
                                                                <div>
                                                                    {
                                                                        moduleAndpolicydata[ele]?.policies.map((policydata, idx) => {
                                                                            let checkOrnot = false;
                                                                            let checking = false;

                                                                            if (moduleAndpolicydata[ele]?.policies.length === 1) {
                                                                                checkOrnot = true;
                                                                            }

                                                                            if (moduleAndpolicydata[ele]?.value === idx + 1) {
                                                                                checking = true;
                                                                            }

                                                                            return (
                                                                                <div className='d-flex eachcheck' key={idx} >
                                                                                    {policydata === "None" ?
                                                                                        <>
                                                                                            <input type="radio" className='radioChecking editmodalchecking' value={0} name={ele} /> <label htmlFor={policydata} > {policydata}  </label>
                                                                                        </>
                                                                                        :
                                                                                        <>
                                                                                            {
                                                                                                checking
                                                                                                    ? <>
                                                                                                        <input type={checkOrnot ? "checkbox" : "radio"} defaultChecked className='radioChecking editmodalchecking' value={idx + 1} name={ele} id={policydata} /> <label htmlFor={policydata}>{policydata}  </label>
                                                                                                    </> :
                                                                                                    <>
                                                                                                        <input type={checkOrnot ? "checkbox" : "radio"} className='radioChecking editmodalchecking' value={idx + 1} name={ele} id={policydata} /> <label htmlFor={policydata}>{policydata}  </label>
                                                                                                    </>

                                                                                            }
                                                                                        </>
                                                                                    }
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }

                                        </div>
                                        <div className='d-flex create-btn'>
                                            <div onClick={() => saveEdit()} className="commonbtn create-userbtn">Save</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                    </>
                }
            </div>
        </div>
    )
}

export default RoleManage