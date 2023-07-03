import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moreoptions from "../logo/moreoptions.png"
import axios from "axios";

const EachPojectBox = ({
  value,
  forRename,
  forDelete,
  viewdetails,
  viewData,
  index,
  editing,
  initialEdit,
  checkName,
  updateParent,
  proId
}) => {
  const [edit, setEdit] = useState(true);
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [assign, setAssign] = useState(false);

  useEffect(() => {
    console.log("value----", value);
    setAssign(value?.assigned);
    setProjectName(value.project_name);
    setProjectId(value.project_id);
    // setEdit(initialEdit);

    if (proId) {
      if (proId === value.project_id) {
        setEdit(true);
      }
    }

  }, [value.project_name])

  function afterEdited(e) {
    e.preventDefault();
    e.stopPropagation();
    setEdit(true);
    forRename({ "projectId": projectId, "projectName": projectName });
  }

  function toggle() {
    const toggleDropdown = document.getElementsByClassName("dropdown-menu");
    for (let i of toggleDropdown) {
      i.classList.remove("show");
    }
  }

  function showonedropdown(indexvalue) {
    console.log("indexvalue------", indexvalue);
    const toggleDropdown = document.getElementsByClassName("dropping");
    for (let i = 0; i < toggleDropdown.length; i++) {
      if (i !== indexvalue) {
        console.log("i--------", i);
        toggleDropdown[i].classList.remove("show");
      }
    }
  }

  function sendData(data) {
    setEdit(false);
    console.log("3 dots", edit);
    editing({ "projectId": data.projectId, "projectName": data.projectName });
  }

  function sendData1() {
    setEdit(false);
    console.log("3 dots", edit);
    editing({ "projectId": projectId, "projectName": projectName });
  }

  return (
    <div
      className="each-project col-md-3 m-2"
      onClick={(e) => {
        setEdit(true);
        navigate(`/projectpipeline/Projects/${value.project_name}/${value.project_id}`);
        e.stopPropagation();
      }}
    >
      <div className="d-flex justify-content-between">
        <form>
          <input
            type="text"
            disabled={edit}
            value={projectName}
            autoFocus
            onChange={(e) => {
              setProjectName(e.target.value);
              updateParent({ "projectId": projectId, "projectName": e.target.value });
              let d2 = { "projectId": projectId, "projectName": e.target.value };
              sendData(d2);
            }}
            className={!edit ? "editunderline" : ""}
            onClick={(e) => { e.stopPropagation() }}
          />
          <input type="submit" onClick={afterEdited} hidden />
        </form>

        <div className="d-flex flex-col pos-rel">
          <img
            src={moreoptions}
            alt="Profile Picture"
            className="btn dropdown-toggle img-responsive"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            onClick={(e) => { e.stopPropagation(); showonedropdown(index); console.log("first") }}
          />
          <ul className="dropdown-menu options abs-dropdown dropping">
            <li
              className=""
              onClick={(e) => {
                viewdetails(true);
                viewData(value.project_id);
                e.stopPropagation();
                toggle();
              }}
            >
              <i className="fa-regular fa-folder-closed"></i>  View Details
            </li>
            {!assign ?
              <>
                <li onClick={(e) => {
                  toggle();
                  e.stopPropagation();
                  sendData1();
                }}>
                  <i className="fa-solid fa-pen"></i>  Rename
                </li>
                <li onClick={(e) => {
                  toggle();
                  forDelete(value.project_id);
                  e.stopPropagation();
                }}>
                  <i className="fa-solid fa-trash"></i> Delete
                </li>

              </>
              : <></>}

          </ul>
        </div>

      </div>
      <div className="d-flex justify-content-around m-38 ml-8">
        <div className="details">
          <div className="d-flex align-items-center">
            <h4>Pipelines</h4>
            <div className="pipeline-color-ball c1"></div>
          </div>
          <div className="values">{value.total_number_of_builds}</div>
        </div>
        <div className="lines"></div>
        <div className="details">
          <div className="d-flex align-items-center">
            <h4>Success</h4>
            <div className="pipeline-color-ball c2"></div>
          </div>
          <div className="values">{value.successfull_builds} </div>
        </div>
        <div className="lines"></div>
        <div className="details">
          <div className="d-flex align-items-center">
            <h4>Failed</h4>
            <div className="pipeline-color-ball c3"></div>
          </div>
          <div className="values">{value.failed_builds}</div>
        </div>
      </div>
    </div>
  );
};

export default EachPojectBox;
