import React from "react";
import { Link } from "react-router-dom";
import mllogo from "../logo/mlangles360logo.png";
import { frontend_url } from "../Config";

const Activated = () => {
  return (
    <div className="bgBlack">
      <div className="d-flex justify-content-start">
        <img src={mllogo} className="mlLogo1" alt="" />
      </div>
      <div className="sucessful container flex-center">
        <div className="martop100">
          <div className="login_t">
            Account Activated
          </div>
          <a href={frontend_url} className="register_now">
            Go to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Activated;