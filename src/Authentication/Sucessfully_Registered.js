import React from "react";
import { Link } from "react-router-dom";
import mllogo from "../logo/mlangles360logo.png";

const Sucessfully_Registered = () => {
  return (
    <div className="bgBlack">
      <div className="d-flex justify-content-start">
        <img src={mllogo} className="mlLogo1" alt="" />
      </div>
      <div className="container">
        <div className="sucessful flex-center">
          <div className="martop100">
            <div className="login_t">Registration Successful</div>
            <div className="to_your_account">
              Check your inbox for activation link
            </div>
            <div className="ll">
              <Link className="register_now back_to_login" to="/">
                Go back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sucessfully_Registered;
