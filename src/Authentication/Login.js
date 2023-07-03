import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../logo/mlangles360logo.png";
import axios from "axios";
import Robot from "./Robot";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { Chips } from "primereact/chips";
import Loading from "../Components/Loading";
import { backend_url, backend_url1 } from "../Config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [server, setServer] = useState(false)
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [eye, setEye] = useState(true);
  const navigate = useNavigate();

  async function submitForm(e) {
    try {
      e.preventDefault();
      setOpen(true);
      let body = { email: email, password: password };
      const res = await axios.post(
        `${backend_url}/login`,
        body
      );
      console.log(res);

      if (res.data.success) {
        localStorage.setItem("mlanglesToken", JSON.stringify(res.data.jwt));
        localStorage.setItem("userDetails", JSON.stringify(res.data.payload));

        let token = JSON.parse(localStorage.getItem("mlanglesToken"));
        let Header = { headers: { "Authorization": `Bearer ${token}` } };

        try {
          const checkServer = await axios.get(`${backend_url}/mlflow/create_server`, Header);
          console.log("checkServer ------", checkServer);
          setOpen(false);
          let updateData = {};
          if (checkServer.data.success) {
            setOpen(true);
            const checkIpchange = await axios.get(`${backend_url}/mlflow/update_instance_ip`, Header);
            console.log("checkIpchange--------", checkIpchange);
            if (!checkIpchange.data.success) {
              setOpen(false);
              navigate("/home");
            } else {
              try {
                const checkIpchange = await axios.get(`${backend_url}/mlflow/update_instance_ip`, Header);
                updateData = checkIpchange.data.data;
                console.log("checkIpchange---------", checkIpchange);
              }
              catch (e) {
                setError("Error in getting instance ip for updating");
                funError();
              }
              try {
                const updateIp = await axios.put(`${backend_url}/mlflow/update_instance_ip`, updateData, Header);
                console.log("updateIp----------", updateIp);
                if (updateIp.data.success) {
                  setOpen(false);
                  navigate("/home");
                }
              }
              catch (e) {
                setError("Error in updating instance ip");
                funError();
              }
            }
          }
          else {

            let token = JSON.parse(localStorage.getItem("mlanglesToken"));
            let Header = { headers: { "Authorization": `Bearer ${token}` } };

            console.log("token-----", token);

            try {
              setServer(true);
              const createServer = await axios.post(`${backend_url}/mlflow/create_server`,{}, Header);
              setServer(false);
              console.log("createServer ------", createServer);
              if (createServer.data.success) {
                navigate("/home");
              }
            } catch (e) {
              setError("Error in creating server");
              funError();
            }
          }
        }
        catch (e) {
          setError("Error in getting in create server details");
          funError();
        }


      }
      else {
        setOpen(false);
        setError(res.data.message);
        setEmail("");
        setPassword("");
        funError();
      }
    } catch (e) {
      setOpen(false);
      console.log("There is an Error---", e);
      setError("Enter vaild email and password");
      funError();
    }
  }

  function funError() {
    setTimeout(() => {
      setError("");
    }, 5000);
  }

  return (
    <div className="bgBlack vh100">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={server}
      >
        <h2>Server is creating... </h2>
      </Backdrop>
      <Loading loading={open} />

      <div className="container">
        <div className="row vh100 flex">
          <div className="col-sm-6 flex-col">
            <div className="d-flex">
              <div className="col-md-12 flex-col align-items-center">
                <h2 className="datascience">
                  Reimagining MLOps and ModelOps</h2>
                <Robot />
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="login_title">
              <img src={logo} className="mlangleslogo" alt="" />
              <div className="mar32">
                <span className="login_t">Login</span>
              </div>
              <div>
                <span className="to_your_account">Welcome to mlangles</span>
              </div>
            </div>

            <h4 className="errorName">
              {error ? error : ""}
            </h4>

            <form className="row g-3 flex-col" onSubmit={submitForm}>
              <div className="col-8">
                <input
                  placeholder="Email "
                  value={email}
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="login_username"
                  type="email"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="col-8 pos-rel">
                <input
                  placeholder="Password"
                  value={password}
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="login_username"
                  type={eye ? "password" : "text"}
                  required
                  autoComplete="off"
                />
                <div className="eye-icon" onClick={(e) => setEye(!eye)}>
                  {eye ? (
                    <i className="fa-solid fa-eye-slash" ></i>
                  ) : (
                    <i className="fa-solid fa-eye"></i>
                  )}
                </div>
              </div>

              {/* <div>
                <Chips value={value} onChange={(e) => setValue(e.value)} />
              </div> */}

              <div className="col-8 clear">
                <div className="in_input_fields d-flex justify-content-between">
                  <div className="login-check ">
                    {/* <input id="checking" className="checkbox" type="checkbox" />
                    <label htmlFor="checking" className="remember">
                      Remember me
                    </label> */}
                  </div>
                  <div>
                    <Link className="register_now" to="/reset_password">
                      Forgot password?
                    </Link>
                  </div>
                </div>
              </div>
              <div className="login_section">
                <button type="submit" className="login_btn">
                  Login
                </button>
                <p className="not_a_member">
                  Not a member yet?
                  <Link to="/register" className="register_now" href="">
                    Register now
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
