import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Mlsidebar from '../../Components/Mlsidebar'
import mllogo from "../../logo/ml-logo.png"
import profilePic from "../../logo/profile-pic.png"
import mlimage from "../../logo/mlangles360logo.png";
import axios from 'axios';
import { Dropdown } from "primereact";
import successIcon from "../../logo/successIcon.png";
import Loading from '../../Components/Loading'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import filter from "../../logo/filter.png";
import Superuser from '../../Components/Superuser';
import deleteIcon from "../../logo/deleteIcon.png";
import filterIcon from "../../logo/clear_filter.png";
import plus from "../../logo/plus.png";
import { backend_url, backend_url1 } from "../../Config";
import Logout from '../Logout'
import { Dialog } from 'primereact/dialog';

const Allpipeline = () => {
  // let [pipeline, setPipeline] = useState({});
  const [table, setTable] = useState([]);
  const [dropdown, setDropdown] = useState([])
  const [open, setOpen] = useState(true);
  const [projectName, setProjectName] = useState("");
  const [project_id, setProject_id] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [btnshow, setBtnshow] = useState(false);
  let path = window?.location?.href?.split("/")[3];
  let navigate = useNavigate();
  const [status, setStatus] = useState(false);
  const [initialData, setInitialData] = useState([]);
  const [createdBy, setCreatedBy] = useState(false);
  const [projectFilter, setProjectFilter] = useState(false);
  const [searchCreated, setSearchCreated] = useState("");
  const [searchProject, setSearchProject] = useState("");

  const [user, setUser] = useState([]);
  const [initialUser, setInitialUser] = useState([]);
  const [project, setProject] = useState([]);
  const [initialproject, setInitialproject] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [logout, setLogout] = useState(false);
  const [err, setErr] = useState("");


  let token = JSON.parse(localStorage.getItem("mlanglesToken"));
  let Header = { headers: { "Authorization": `Bearer ${token}` } };

  async function fetchData() {
    try {
      const allPipeline = await axios.get(`${backend_url}/pipeline/all_pipelines`, Header);
      if (allPipeline.data.success) {
        setTable(allPipeline.data.all_pipelines);
        setInitialData(allPipeline.data.all_pipelines);
        setDropdown(allPipeline.data.allProjects);
        setOpen(false);

        let data1 = allPipeline.data.all_pipelines;

        let user1 = new Set();
        for (let i = 0; i < data1.length; i++) {
          user1.add(data1[i].created_by);
        }
        setUser(Array.from(user1));
        setInitialUser(Array.from(user1));

        let data2 = allPipeline.data.allProjects;
        let project2 = new Set();
        for (let i of data2) {
          project2.add(i.project_name);
        }
        setProject(Array.from(project2));
        setInitialproject(Array.from(project2));
      } else {
        errorFun();
      }
    }
    catch (e) {
      console.log("There is an Error--", e);
      setErr(e.message);
      setOpen(false);
      errorFun();
    }
  }

  useEffect(() => {
    let token = JSON.parse(localStorage.getItem("mlanglesToken"));
    let userdetails = JSON.parse(localStorage.getItem("userDetails"));
    setUserDetails(userdetails);

    if (userdetails) {
      if (!token || userDetails?.permissions?.is_pipeline === 0) {
        navigate("/");
      }
      fetchData();
    }
  }, [])

  // function filterProject(e) {
  //   console.log("name filtered clicked")
  //   setName(!name)
  //   console.log(name)
  //   if (name) {
  //     users.sort(function (a, b) {
  //       let x = a.name.toLowerCase()
  //       let y = b.name.toLowerCase()
  //       if (x < y) { return -1 }
  //       if (x > y) { return 1 }
  //       return 0
  //     })
  //     console.log(users)
  //     setUsers(users)
  //   } else {
  //     users.sort(function (a, b) {
  //       let x = a.name.toLowerCase()
  //       let y = b.name.toLowerCase()
  //       if (x < y) { return 1 }
  //       if (x > y) { return -1 }
  //       return 0
  //     })
  //     console.log(users)
  //     setUsers(users)
  //   }
  // }

  // function filterPipeline(e) {
  //   console.log("age filter clicked")
  //   setAge(!age)
  //   if (age) {
  //     users.sort(function (a, b) {
  //       return a.age - b.age
  //     })
  //     console.log("age filter ----", users)
  //     setUsers(users)
  //   } else {
  //     users.sort(function (a, b) {
  //       return b.age - a.age
  //     })
  //     console.log("age filter ----", users)
  //     setUsers(users)
  //   }
  // }


  function errorFun() {
    setTimeout(() => {
      setErr("");
    }, 4000)
  }


  function handleChange(e) {
    setBtnshow(true);
    setProjectName(e.target.value);
    for (let i = 0; i < dropdown.length; i++) {
      if (dropdown[i].project_name === e.target.value) {
        setRedirect(dropdown[i].success);
        setProject_id(dropdown[i].project_id);
      }
    }
  }

  async function buildOrRun() {
    try {
      setOpen(true);
      const totalBuildList = await axios.get(`${backend_url}/pipeline/total_build_list/${projectName}`, Header);
      console.log("totalBuildList---", totalBuildList)
      if (totalBuildList.data.success) {
        // setTotalBuilds(totalBuildList.data.data);
        let newData = totalBuildList.data.data;
        let lastData = newData[newData.length - 1];
        let each = lastData?.build?.split("#");
        let each_build = each[1];

        if (!newData[newData.length - 1].result) {
          console.log("new data ---", newData);
          // setOpen(false);
          navigate(`/eachPipes/Projects/${projectName}/${project_id}/${each_build}/false`);
        } else {
          // setOpen(false);
          navigate(`/eachPipes/Projects/${projectName}/${project_id}/${each_build}/false`);
        }
      }
    } catch (e) {
      setErr(e.message);
      setOpen(false);
      errorFun();
    }
  }

  async function createPipeline() {
    try {
      setOpen(true)
      if (redirect) {
        const runBuild = await axios.post(`${backend_url}/pipeline/run_build`, { "project_name": projectName }, Header);
        console.log("runBuild--", runBuild);
        if (runBuild.data.success) {
          console.log("settimeout");
          setOpen(true);
          setTimeout(() => {
            buildOrRun();
          }, 8000)
        }
      }
      else {
        navigate(`/projectpipeline/Projects/${projectName}/${project_id}`);
      }
    }
    catch (e) {
      setErr(e.message);
      setOpen(false);
      errorFun();
    }
  }

  function navigateTo(data) {
    // console.log("navigating ------", data);
    let buildId = data?.pipeline_name?.split("#")[1];
    navigate(`/eachPipes/Projects/${data.project_name}/${data.id}/${buildId}/false`);
  }


  function changecheckBoxParent(e) {
    let checkboxparent = document.getElementsByClassName("checkboxparent")[0];
    let eachCheck = document.getElementsByClassName("eachcheckbox");

    if (checkboxparent.checked) {
      for (let i = 0; i < eachCheck.length; i++) {
        eachCheck[i].checked = true;
      }
    }
    else {
      for (let i = 0; i < eachCheck.length; i++) {
        eachCheck[i].checked = false;
      }
    }
  }

  function checkBoxEach(e) {
    //console.log(e)
    let checkboxparent = document.getElementsByClassName("checkboxparent")[0];
    let eachCheck = document.getElementsByClassName("eachcheckbox");
    for (let i of eachCheck) {
      if (!i.checked) {
        checkboxparent.checked = false;
      }
    }
  }

  function searchCreating(e) {
    let data = e.target.value?.toLowerCase();
    setSearchCreated(data);
    let newData = [];
    for (let i = 0; i < initialUser.length; i++) {
      if (initialUser[i]?.toLowerCase().includes(data)) {
        newData.push(initialUser[i]);
      }
    }
    setUser(newData);
  }

  function projectNamesearch(e) {
    let data = e.target.value?.toLowerCase();
    setSearchProject(data);
    let newData = [];
    for (let i = 0; i < initialproject.length; i++) {
      if (initialproject[i]?.toLowerCase().includes(data)) {
        newData.push(initialproject[i]);
      }
    }

    setProject(newData);
  }

  function toggle() {
    const toggleDropdown = document.getElementsByClassName("dropdown-menu");
    console.log("toggleDropdown----", toggleDropdown);
    for (let i of toggleDropdown) {
      console.log(i);
      i.classList.remove("show");
    }
    // toggleDropdown.classList.remove("show");
  }


  function filterProjectName() {
    toggle();
    if (projectFilter) {
      setProjectFilter(!projectFilter)
    }

    let selected = [];
    var projectname = document.getElementsByClassName("projectname");
    for (let i = 0; i < projectname.length; i++) {
      if (projectname[i].checked) {
        selected.push(projectname[i].name)
      }
    }

    let newData = [];
    for (let i = 0; i < initialData.length; i++) {
      console.log("initialproject[i].created_by?.toLowerCase()-------------", initialData[i]);
      if (selected.includes(initialData[i].project_name?.toLowerCase())) {
        newData.push(initialData[i])
      }
    }

    if (selected.length === 0) {
      setTable(initialData);
    } else {
      setTable(newData);
    }
    setSearchCreated("");
    setProject(initialproject);
  }

  function filterCreatedBy() {
    toggle();
    if (createdBy) {
      setCreatedBy(!createdBy)
    }
    let selected = [];
    var eachcheckcreatedby = document.getElementsByClassName("eachcheckcreatedby");
    for (let i = 0; i < eachcheckcreatedby.length; i++) {
      if (eachcheckcreatedby[i].checked) {
        selected.push(eachcheckcreatedby[i].name)
      }
    }
    let newData = [];
    for (let i = 0; i < initialData.length; i++) {
      if (selected.includes(initialData[i].created_by?.toLowerCase())) {
        newData.push(initialData[i])
      }
    }
    if (newData.length === 0) {
      setTable(initialData);
    } else {
      setTable(newData);
    }
    setSearchCreated("");
    setUser(initialUser);
  }

  function filterStatus() {
    toggle();
    if (status) {
      setStatus(!status);
    }
    let selected = [];
    var eachcheckstatus = document.getElementsByClassName("eachcheckstatus");
    for (let i = 0; i < eachcheckstatus.length; i++) {
      if (eachcheckstatus[i].checked) {
        // console.log("rfghvjbk", eachcheckstatus[i].name)
        if (eachcheckstatus[i].name === "success") {
          selected.push("success", "finished")
        } else if (eachcheckstatus[i].name === "failed") {
          selected.push("failed", "failure")
        } else {
          selected.push("running", "unfinished", " ", "null")
        }
      }
    }

    console.log("selcted-----", selected);
    let newData = [];
    for (let i = 0; i < initialData.length; i++) {
      console.log(initialData[i].status);

      if (["RUNNING", "UNFINISHED", " ", "null"].includes(initialData[i]?.status)) {
        newData.push(initialData[i]);
      } else {
        if (selected.includes(initialData[i]?.status?.toLowerCase())) {
          newData.push(initialData[i]);
        }
      }
    }

    if (selected.length === 0) {
      setTable(initialData);
    } else {
      setTable(newData);
    }
  }

  async function deleteFunction() {
    try {

      let eachCheck = document.getElementsByClassName("eachcheckbox");
      let deleteData = [];
      for (let i of eachCheck) {
        if (i.checked) {
          // checkboxparent.checked = false;
          console.log(i);
          console.log(i.target);
          console.log(i.value);
          console.log(i.className);
          let spliting = i?.value?.split("-");
          console.log("spliting----------", spliting);
          let buildId = spliting[1]?.split("#")[1];
          deleteData.push({
            "project_id": spliting[0],
            "build_id": buildId
          })
        }
      }

      if (deleteData.length > 0) {
        setOpen(true);
        const deletingPipeline = await axios.delete(`${backend_url}/pipeline/delete_pipeline_builds`, { data: { "project": deleteData }, headers: { "Authorization": `Bearer ${token}` } });
        setOpen(false);
        if (deletingPipeline.data.success) {
        } else {
        }
        for (let i of eachCheck) {
          if (i.checked) {
            i.checked = false;
          }
        }
        let checkboxparent = document.getElementsByClassName("checkboxparent")[0];
        checkboxparent.checked = false;
        fetchData();
      }
    }
    catch (e) {
      setErr(e.message);
      setOpen(false);
      errorFun();
    }
  }

  function uncheckAll() {
    const checkboxAll = document.querySelectorAll("[type=checkbox]");
    // console.log("checkboxAll-------", checkboxAll);
    for (let i of checkboxAll) {
      console.log(i);
      if (i.checked) {
        // console.log("checked already");
        i.checked = false;
      }
    }
  }

  function changecheckBoxParent(e) {
    let checkboxparent = document.getElementsByClassName("checkboxparent")[0];
    let eachCheck = document.getElementsByClassName("eachcheckbox");

    if (checkboxparent.checked) {
      for (let i = 0; i < eachCheck.length; i++) {
        eachCheck[i].checked = true;
      }
    } else {
      for (let i = 0; i < eachCheck.length; i++) {
        eachCheck[i].checked = false;
      }
    }
  }

  function checkBoxEach(e) {
    //console.log(e)
    let checkboxparent = document.getElementsByClassName("checkboxparent")[0];
    let eachCheck = document.getElementsByClassName("eachcheckbox");
    for (let i of eachCheck) {
      if (!i.checked) {
        checkboxparent.checked = false;
      }
    }
  }

  function clearing() {
    uncheckAll();
    filterCreatedBy();
    setSearchProject("");
    setProject(initialproject);
  }

  return (
    <div className='allpipeline'>

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
            <h4 className='capitailze'>{userDetails?.user_full_name} workspace / </h4><span> Pipelines</span>
          </div>
          <Superuser logoutClicked={() => { setLogout(true) }} />

        </div>
      </header>

      <Dialog className="logout-dialogbox" visible={logout} style={{ width: '30vw' }} onHide={() => setLogout(false)}>
        <Logout no={() => setLogout(false)} />
      </Dialog>

      <Mlsidebar data={path} />

      <section className='middlepart1 allprojects dashboard allpipelines'>
        <h2>ALL PIPELINES</h2>
        <div className='d-flex align-items-center justify-content-center'>
          <h4 className='error-message'>{err}</h4>
        </div>
        <div className='d-flex justify-content-between align-items-center topspace allpipedropbox'>
          <div className='d-flex align-items-center'>
            <div className='w40'>

              <div className="each-check1">
                <label className='labelstyle' htmlFor="">Project Name</label>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Select Your Project Name</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    className='demo-simple-select'
                    value={projectName}
                    label="Problem Type"
                    onChange={handleChange}
                    required
                  >
                    {dropdown.map((data, idx) => {
                      return (
                        <MenuItem key={idx} value={data.project_name} >{data.project_name}</MenuItem>
                      )
                    })
                    }
                  </Select>
                </FormControl>
              </div>

              {/* <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Select your Project</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={projectName}
                  label="Select your Project"
                  onChange={handleChange}
                >
                  {dropdown.map((data, idx) => {
                    return (
                      <MenuItem key={idx} value={data.project_name} >{data.project_name}</MenuItem>
                    )
                  })
                  }
                </Select>
              </FormControl> */}

            </div>

            {btnshow ?
              <>
                <button className='createbtn' onClick={() => createPipeline()}> <img src={plus} alt="plus" className='plus' /> New Pipeline</button>
              </> :
              <></>}
          </div>

          <div className='d-flex'>
            <div className="commonbtn" onClick={() => { setTable(initialData); clearing() }} >
              <img src={filterIcon} alt="" /> <span>Clear Filter</span>
            </div>
            <div className="commonbtn" onClick={() => { deleteFunction() }} >
              <img src={deleteIcon} alt="" /> <span>Delete</span>
            </div>
          </div>

        </div>

        <div className="fixedsize">
          <table className='sample' style={{ width: "100%" }} >
            <thead className='fixing'>
              <tr className='darkblue'>
                <th className='posrel'><input type="checkbox" className='posrel allpipecheckbox checkboxparent' onChange={changecheckBoxParent} />
                  PROJECT NAME
                  <img src={filter}
                    className="fa-solid fa-filter dropdown-toggle img-responsive filter"
                    data-bs-toggle="dropdown"
                    aria-expanded="false" alt=""
                    onClick={() => { setProjectFilter(!projectFilter) }} />
                  <div
                    id="toggleDropdown"
                    className='posabs search-content dropdown-menu options'
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input autoComplete="off" type="text" placeholder='Search' className='textinput' value={searchProject} onChange={(e) => projectNamesearch(e)} />
                    <div className='d-flex allcheck'>
                      {
                        project.map((ele, index) => {
                          return (
                            <div className='eachboxcheck' key={index}>
                              <input type="checkbox" id={ele} name={ele?.toLowerCase()} className='eachcheck projectname' /> <label htmlFor={ele} >{ele} </label>
                            </div>
                          )
                        })
                      }
                    </div>
                    <div className="text-end">
                      <button onClick={() => filterProjectName()} className='apply' id='applycreatedby'>Apply</button>
                    </div>
                  </div>

                </th>
                <th>PIPELINE NAME <span > </span>  </th>
                <th className='posrel'>CREATED BY
                  <img src={filter} onClick={() => { setCreatedBy(!createdBy) }}
                    className="fa-solid fa-filter dropdown-toggle img-responsive filter"
                    data-bs-toggle="dropdown"
                    aria-expanded="false" alt="" />
                  <div
                    id="toggleDropdown"
                    className='posabs search-content dropdown-menu options'
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input autoComplete="off" type="text" placeholder='Search' className='textinput' value={searchCreated} onChange={(e) => searchCreating(e)} />
                    <div className='d-flex allcheck'>
                      {
                        user.map((ele, index) => {
                          return (
                            <div className='eachboxcheck' key={index}>
                              <input type="checkbox" id={ele} name={ele?.toLowerCase()} className='eachcheck eachcheckcreatedby' /> <label htmlFor={ele} >{ele} </label>
                            </div>
                          )
                        })
                      }
                    </div>
                    <div className="text-end">
                      <button onClick={() => filterCreatedBy()} className='apply' id='applycreatedby'>Apply</button>
                    </div>
                  </div>
                </th>
                <th>CREATED AT </th>
                <th className='posrel'>STATUS
                  <img src={filter} onClick={() => setStatus(!status)}
                    className="fa-solid fa-filter dropdown-toggle img-responsive filter"
                    data-bs-toggle="dropdown"
                    aria-expanded="false" alt=""
                  />
                  <div
                    id="toggleDropdown"
                    className='posabs search-content dropdown-menu options'
                    onClick={(e) => e.stopPropagation()}

                  >
                    <div className='d-flex allcheck'>

                      <div className='eachboxcheck' >
                        <input type="checkbox" id="success" name="success" className='eachcheckstatus' /> <label htmlFor="success" >Success </label>
                      </div>
                      <div className='eachboxcheck' >
                        <input type="checkbox" id="failed" name="failed" className='eachcheckstatus' /> <label htmlFor="failed" >Failed </label>
                      </div>
                      <div className='eachboxcheck' >
                        <input type="checkbox" id="running" name="running" className='eachcheckstatus' /> <label htmlFor="running" >Running </label>
                      </div>

                    </div>
                    <div className="text-end">
                      <button onClick={() => filterStatus()} className='apply' id='applyStatus'>Apply</button>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {
                table.map((user, idx) => {
                  let newDate = new Date(Number(user.created_at)).toLocaleString(undefined, { timeZone: "Asia/Kolkata" });
                  return (
                    <tr key={idx}>
                      <td>
                        <input type="checkbox" className='allpipecheckbox eachcheckbox' value={`${user.id}-${user.pipeline_name}`} onChange={checkBoxEach} />
                        {user.project_name}
                      </td>
                      <td className='cursor pipename1' onClick={() => navigateTo(user)}>{user.pipeline_name}</td>
                      <td>{user.created_by}</td>
                      <td>{newDate}</td>
                      {
                        ["FINISHED", "SUCCESS"].includes(user?.status?.toUpperCase()) ? <td className='green'>Success </td> :
                          <></>
                      }
                      {
                        ["FAILED", "FAILURE"].includes(user?.status?.toUpperCase()) ? <td className='red'>Failed </td> :
                          <></>
                      }
                      {
                        (["RUNNING", " ", "UNFINISHED"].includes(user?.status?.toUpperCase()) || !user?.status) ? <td className='blue'>Runnning </td> :
                          <></>
                      }
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>

      </section>

    </div>
  )
}

export default Allpipeline