import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Loading from "../Components/Loading";
import mllogo from "../logo/mlangles360logo.png";
import { backend_url } from "../Config";

const CheckinEmail = () => {
  const [seconds, setSeconds] = useState(60);
  const [active, setActive] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const [open, setOpen] = useState(false);

  function timeSet() {
    setSeconds(seconds - 1);

    if (seconds === 0 || seconds === "00") {
      setSeconds("00");
      setActive(true);
    }
  }

  useEffect(() => {
    const timer = setInterval(() => timeSet(), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  async function sendMail() {
    try {

      console.log(state);
      setOpen(true);
      // const res = await axios.post(`${backend_url}/auth/users/reset_password/`, state.mail);
      // setOpen(false);
      // navigate("/");
      const res = await axios.post(`${backend_url}/resetPassword`, state.mail);
      setOpen(false);
      if (res.data.success) {
        navigate("/");
      }
    }
    catch (err) {
      console.log("There is an error--", err);
    }
  }

  function pass() {
  }

  return (
    <div className="bgBlack">
      <Loading loading={open} />
      <div className="d-flex justify-content-start">
        <img src={mllogo} className="mlLogo1" alt="" />
      </div>
      <div className="container">
        <div className="reset ">
          <div className="resetpassword flex-center">
            <div>
              <div>
                <div className="login_t">Reset password</div>
                <div className="to_your_account">
                  We just emailed you with instructions to reset your password
                </div>
              </div>
              <div className="not_a_member">Haven't received yet?</div>

              <div>
                <button onClick={() => { active ? sendMail() : pass() }} className={`reset_btn ${active ? `` : `blur`} `}>
                  Resend
                </button>
              </div>
              <div className="not_a_member">
                <span>00:{seconds}</span>
              </div>
              <div className="back_to_login">
                <Link className="register_now" to="/">
                  Go back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckinEmail;
