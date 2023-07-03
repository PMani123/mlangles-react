import React, { Component, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../Components/Loading";
import mllogo from "../logo/mlangles360logo.png";
import { backend_url } from "../Config";

export default function Resetpasswordconfirm() {
  const [userid, setUserid] = useState("");
  const [token, setToken] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [re_new_password, setReNewPassword] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [fullData, setFullData] = useState({});

  const param = useParams();
  console.log("param ---------", param);
  useEffect(() => {
    setUserid(param.User_id);
    fetching();
  }, []);

  function errorFun() {
    setTimeout(() => {
      setError("");
    }, 4000)
  }

  async function fetching() {
    setOpen(true);
    const res = await axios.post(`${backend_url}/restsetpassword_confirm`, { "user_id": Number(param.User_id) });
    setOpen(false);
    console.log("res------", res.data);
    if (res.data.success) {
      setFullData(res.data.data[0]);
    } else {
      setError("Error in getting user details");
      errorFun();
    }
  }

  async function submitForm(e) {
    try {
      e.preventDefault();
      setOpen(true);

      console.log("fullData----", fullData);
      fullData.password = new_password;
      fullData.confirm_password = re_new_password;

      if (fullData.password !== fullData.confirm_password) {
        setError("Password didnt match");
        errorFun();
      } else {
        const res = await axios.put(`${backend_url}/restsetpassword_confirm`, fullData);
        setOpen(false);
        if (res.data.success) {
          navigate("/");
        } else {
          setError("Error in updating the password");
          errorFun();
        }
      }
    }
    catch (e) {
      console.log("There is an Error--", e);
      setError("Error in updating the password");
      setOpen(false);
    }
  }

  return (
    <div className="bgBlack">
      <Loading loading={open} />
      <div className="d-flex justify-content-start">
        <img src={mllogo} className="mlLogo1" alt="" />
      </div>
      <div className="container">
        <div className="resetpassword flex-center">
          <div>
            <div>
              <div className="login_t">Reset password</div>
              <div className="to_your_account">
                What would you like your new password to be
              </div>
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <div className="error-message">
                {error}
              </div>
            </div>
            <form onSubmit={submitForm}>
              <div>
                <div className="login_inputs">
                  <input
                    value={new_password}
                    name="new_password"
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="off"
                    className="login_username"
                    type="password"
                    required
                    placeholder="New password"
                  />
                  <br />
                  <br />
                  <input
                    placeholder="Confirm new password"
                    value={re_new_password}
                    name="re_new_password"
                    onChange={(e) => setReNewPassword(e.target.value)}
                    autoComplete="off"
                    className="login_username"
                    type="password"
                    required
                  />
                </div>
              </div>
              <div className="bb">
                <button type="submit" className=" reset_btn">
                  Reset
                </button>
              </div>
              <div className="back_to_login">
                <Link className="register_now" to="/">
                  Go back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
