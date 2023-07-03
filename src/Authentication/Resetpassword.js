import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../Components/Loading";
import mllogo from "../logo/mlangles360logo.png";
import { backend_url } from "../Config";

export default function Resetpassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState("");

  function errorFun() {
    setTimeout(() => {
      setErr("");
    }, 4000)
  }

  async function submitForm(e) {
    try {
      const mail = { email: email };
      console.log("mail --------", mail);
      e.preventDefault();
      setOpen(true);
      const res = await axios.post(`${backend_url}/resetPassword`, mail);
      setOpen(false);
      if (res.data.success) {
        navigate("/checkinemail", { state: { mail } });
      }
      else {
        setErr("Error in sending Mail");
        errorFun();

      }
    }
    catch (e) {
      console.log("There is an Error--", e);
      setOpen(false);
    }

    // fetch("${backend_url}/auth/users/reset_password/", {
    //   method: "POST",
    //   body: JSON.stringify(mail),
    //   headers: {
    //     "Content-type": "application/json; charset=UTF-8",
    //   },
    // })
    //   .then((response) => response.json())
    //   .then((data) => console.log(data));
  }

  return (
    <div className="bgBlack">
      <Loading loading={open} />
      <div className="d-flex justify-content-start">
        <img src={mllogo} className="mlLogo1" alt="" />
      </div>
      <div className="container">
        <div className="reset">
          <div className="resetpassword flex-center">
            <div>
              {err ? <div className='d-flex align-items-center justify-content-center'>
                <h4 className='error-message'>{err}</h4>
              </div> : <></>
              }
              <div>
                <div className="login_t">Forgot Password?</div>
                <div className="to_your_account">
                  Enter your email and w'll send you a link to <br /> reset a
                  password
                </div>
              </div>
              <form onSubmit={submitForm}>
                <div className="forgot_email">
                  <input autoComplete="off"
                    value={email}
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="login_username"
                    type="email"
                    required
                    placeholder="Enter your mail id"
                  />
                </div>
                <div>
                  <button type="submit" className="login_btn">
                    Submit
                  </button>
                </div>
              </form>
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
}
