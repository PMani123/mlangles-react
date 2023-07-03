import React from "react";
import logo from "../logo/mlangles360logo.png";
import automl from "../logo/automl.png";
import ml from "../logo/ml.png";
import { Link } from "react-router-dom";

const MLselection = () => {
  return (
    <div className="mlselect">
      <div className="headimg">
        <div className="container-fluid">
          <div className="d-f ">
            <div className="col-md-2 head">
              <img src={logo} alt="" className="img-fluid" />
            </div>
          </div>
        </div>
      </div>
      <div className="mainml">
        <div className="container-fluid">
          <h2>ML Flow as a Service</h2>
          <div className="option flex-col">
            <h4>Which option do you prefer?</h4>
            <div className="d-flex box">
              <div className="automl col-md-6">
                <Link to="" className="flex-col links">
                  <img src={automl} alt="Auto ML" className="wh100" />
                  <h4>Auto ML</h4>
                </Link>
              </div>
              <div className="ml col-md-6">
                <Link to="/dashboard" className="flex-col links">
                  <img src={ml} alt="ML" className="wh100" />
                  <h4> ML</h4>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLselection;
