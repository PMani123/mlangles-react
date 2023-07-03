import React from "react";
import logo from "../logo/mlangles360logo.png";
import profilePic from "../logo/profile-pic.png";
import "./header.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="head-bg">
      <div className="container-fluid">
        <div className="header">
          <div className="d-flex justify-content-between align-items-center">
            <div className="head-left d-flex">
              <div className="col-md-3">
                <img
                  src={logo}
                  alt="MLAngles 360 Logo"
                  className="img-responsive logos "
                />
              </div>
            </div>
            <div className="head-right d-flex">
              {/* <div className="search">
                <input type="text" name="" id="" className="head-input" />
                <i className="fa-solid fa-magnifying-glass head-search-icon"></i>
              </div> */}
              {/* <div className="notifi">
                <i className="fa-solid fa-bell fa-lg"></i>
                <span className="notifi-number">5</span>
              </div> */}
              <div className="profilePic btn-group row">
                <div className="col-md-4">
                  <img
                    src={profilePic}
                    alt="Profile Picture"
                    className="btn dropdown-toggle img-responsive headicon "
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  />
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/user">
                        <span className="dropdown-item" href="">
                          <i className="fa-solid fa-user"></i> User
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/settings">
                        <span className="dropdown-item" href="">
                          <i className="fa-solid fa-gear"></i> Settings
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/logout">
                        <span className="dropdown-item" href="">
                          <i className="fa-solid fa-power-off"></i> Logout
                        </span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
