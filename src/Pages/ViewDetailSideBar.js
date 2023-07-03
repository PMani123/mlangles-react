import React, { useEffect, useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import CloseIcon from '@mui/icons-material/Close';
import { Dropdown } from "primereact/dropdown";
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Chips } from "primereact/chips";
import axios from 'axios';
import Loading from '../Components/Loading';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { useNavigate } from 'react-router';
import { backend_url, backend_url1 } from '../Config';

const ViewDetailSideBar = ({ viewOpen, viewClose, allData, assign }) => {
    const [visibleRight, setVisibleRight] = useState(false);
    const [person, setPerson] = useState("");
    const [chipPerson, setChipPerson] = useState([]);
    const [assignedTo, setAssignedTo] = useState([]);
    const [search, setSearch] = useState("");
    const [searchAssign, setSearchAssigned] = useState([]);
    const [project_id, setProject_id] = useState("");
    const [open, setOpen] = useState(false);
    const [assignMembers, setAssignMembers] = useState([]);
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState({});
    const [removebtn, setRemovebtn] = useState(false);
    const [err, setErr] = useState("");

    let token = JSON.parse(localStorage.getItem("mlanglesToken"));
    let Header = { headers: { "Authorization": `Bearer ${token}` } };

    useEffect(() => {
        let token = JSON.parse(localStorage.getItem("mlanglesToken"));
        let userdetails = JSON.parse(localStorage.getItem("userDetails"));
        setUserDetails(userdetails);

        if (!token) {
            navigate("/");
        }

        console.log("allData--------", allData);

        setVisibleRight(viewOpen);
        setProject_id(allData?.project_details?.project_id);
        setAssignedTo(allData?.assigned_to);
        getdata();
    }, [allData]);

    function errorFun() {
        setTimeout(() => {
            setErr("");
        }, 4000);
    }

    async function getdata() {
        try {
            const search = await axios.get(`${backend_url}/mlflow/assign_search`, Header);
            let arrayData = [];
            if (search.data.success) {
                let d1 = search.data.users
                for (let i in d1) {
                    arrayData.push(d1[i].email);
                }
            }
            setAssignedTo(arrayData);

            if (allData?.project_details?.project_id) {
                const res = await axios.post(`${backend_url}/mlflow/view_details`, { "project_id": allData?.project_details?.project_id }, Header);
                if (res.data.success) {
                    console.log(res.data);
                    setAssignMembers(res.data.assigned_to);
                    if (res.data.assigned_to.length === 0) {
                        setRemovebtn(false);
                    }
                } else {
                    setErr("Error in getting view details data");
                }
            }
        }
        catch (e) {
            setErr(e.message);
            setOpen(false);
            errorFun();
        }
    }

    function addingPerson() {
        if (search) {
            if (!chipPerson.includes(search)) {
                setChipPerson([...chipPerson, search]);
            }
            setSearch("");
        }
    }

    async function chipsSubmit(e) {
        try {
            e.preventDefault();
            if (search) {
                setOpen(true);
                const res = await axios.post(`${backend_url}/mlflow/send_email_project_assign_verification/${project_id}`, { "persons": [search], "project_id": project_id, "project_status": 0 }, Header);
                console.log(res);
                setSearch("");
                if (res.data.success) {
                    setOpen(false);
                    setChipPerson([]);
                    getdata();
                } else {
                    setOpen(false);
                    setErr("Error in assigning member");
                    errorFun();
                }
            }
        } catch (e) {
            setErr("Enter valid mail id");
            setOpen(false);
            errorFun();
        }
    }

    function setting(data) {
        setSearch(data);

        let searching = [];
        for (let i of assignedTo) {
            if (i.toLowerCase().includes(data.toLowerCase())) {
                searching.push(i);
            }
        }
        if (data.length === 0) {
            setSearchAssigned([])
        } else {
            setSearchAssigned(searching);
        }
    }

    async function removeAssignedProject() {
        try {
            let selectedOne = [];
            let eachboxcheck = document.getElementsByClassName("eachboxcheck");
            for (let i of eachboxcheck) {
                if (i.checked) {
                    selectedOne.push(Number(i.name));
                }
            }
            let finalData = [];
            for (let i of selectedOne) {
                finalData.push([project_id, userDetails.user_account_id, i]);
            }
            setOpen(true);
            const res = await axios.delete(`${backend_url}/mlflow/deleteAssign`, { headers: { "Authorization": `Bearer ${token}` }, data: { "remove_assign": finalData } })
            setOpen(false);
            getdata();
            uncheckAll();
        }
        catch (e) {
            console.log("There is an Error--", e);
            setErr(e.message);
            setOpen(false);
            errorFun();
        }
    }

    function changingCheckbox(e) {
        let eachboxcheck = document.getElementsByClassName("eachboxcheck");
        let count = 0;
        for (let i of eachboxcheck) {
            if (i.checked) {
                setRemovebtn(true);
                break;
            } else {
                count += 1;
            }
        }
        if (count === eachboxcheck.length) {
            setRemovebtn(false);
        }
    }

    function uncheckAll() {
        const checkboxAll = document.querySelectorAll("[type=checkbox]");
        // console.log("checkboxAll-------", checkboxAll);
        for (let i of checkboxAll) {
            // console.log(i);
            if (i.checked) {
                // console.log("checked already");
                i.checked = false;
            }
        }
    }

    return (
        <div>
            <Loading loading={open} />
            <Sidebar visible={viewOpen} position="right" onHide={() => { setVisibleRight(false); viewClose(false) }}>
                <div className='marSidebar'>
                    <div className="sideright-head d-flex justify-content-between align-items-center">
                        <h4>View Details</h4>
                        <div>
                            <CloseIcon className='closeicon' onClick={() => { setVisibleRight(false); viewClose(false) }} />
                        </div>
                    </div>
                    <div className='right-content'>
                        <div className="proj">
                            <table>
                                <tbody>
                                    <tr>
                                        <td className='tit'>Project Name</td>
                                        <td className='name'>{allData.project_details?.project_name}</td>
                                    </tr>
                                    <tr>
                                        <td className='tit'>Created by</td>
                                        <td className='name'>{allData?.created_by}</td>

                                    </tr>
                                    <tr>
                                        <td className='tit'>Created at</td>
                                        <td className='name'>{allData?.created_at}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="des">
                            <h4>Description</h4>
                            <div className="box">
                                {allData?.project_details?.project_description}
                            </div>
                        </div>


                        {err ?
                            <div className='d-flex align-items-center justify-content-center'>
                                <h6 className='error-message'>{err}</h6>
                            </div> : <></>
                        }

                        {!assign ?
                            <div className="assigned">
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h4 className='width20'>Assigned Members</h4>
                                    <div className='width80 d-flex assigned1'>
                                        <form onSubmit={chipsSubmit} className='formAssign'>
                                            <div className='posrel width50'>
                                                <input autoComplete="off" required type="email" value={search} placeholder='Search for a member' onChange={(e) => { setting(e.target.value); }} />
                                                <div className='posabs1'>
                                                    {
                                                        searchAssign.map((ele, idx) => {
                                                            return (
                                                                <p onClick={() => { setSearch(ele); setSearchAssigned([]); }} key={idx}>{ele}</p>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            {/* <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Select Member</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={person}
                                            label="Search a Member"
                                            onChange={handleChange}
                                        >
                                            {assignedTo?.map((ele, index) => {
                                                return (
                                                    <MenuItem value={ele} key={index} >{ele}</MenuItem>
                                                )
                                            })}
                                        </Select>
                                    </FormControl> */}
                                            <button className='add' type='submit'>Send Invitation</button>
                                        </form>
                                    </div>

                                </div>
                            </div>
                            : <></>}

                        {/* {
                            chipPerson.length !== 0 ?
                                <div className="chips">
                                    <Chips value={chipPerson} onChange={(e) => setChipPerson(e.value)} />
                                    <div className='end'>
                                        <button className='chip-btn' onClick={() => addingPerson()}>Send Invitation</button>
                                    </div>
                                </div> :
                                <></>
                        } */}

                        <div className="pending">
                            {removebtn ?
                                <div className="d-flex justify-content-end">
                                    <button onClick={() => removeAssignedProject()} className='remove'>Remove</button>
                                </div> : <></>}

                            <table className='assigned1'>
                                <thead>
                                    <tr>
                                        <th className='assignedTh'>Assigned Members</th>
                                        <th>Status</th>
                                        {/* <th>Remove Access</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignMembers.map((ele, index) => {
                                        return (
                                            <tr key={index}>
                                                <td> <span className='d-flex align-items-center'>
                                                    {!assign ? <input type="checkbox" onChange={changingCheckbox} className='eachboxcheck' name={ele.user_id} /> : <></>}
                                                    <span>{ele.assign_members}</span></span>  </td>

                                                {ele.status === "Accepted" ? <td className='green'>{ele.status}</td> : <></>}
                                                {ele.status === "Pending..." ? <td className='blue'>{ele.status}</td> : <></>}
                                                {ele.status === "Declined" ? <td className='red'>{ele.status}</td> : <></>}

                                                {/* <td> <CancelRoundedIcon className='removeIcon' /> </td> */}
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </Sidebar>
        </div>
    )
}

export default ViewDetailSideBar