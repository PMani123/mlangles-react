import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import mllogo from "../logo/mlangles360logo.png";
import { backend_url } from "../Config.js"

export default function Activation() {
  // const [uid, setUid] = useState("");
  // const [token, setToken] = useState("");
  const navigate = useNavigate();

  const params = useParams();

  function submit(e) {
    try {
      fetch(`${backend_url}/auth/users/activation/`, {
        method: "POST",
        body: JSON.stringify(params),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        });
      navigate("/activated");
    }
    catch (err) {
      console.log("There is an error--", err);
    }
  }

  return (
    <div className="bgBlack">
      <div className="d-flex justify-content-start">
        <img src={mllogo} className="mlLogo1" alt="" />
      </div>
      <div className="sucessful container flex-center">
        <div>
          <div className="login_t">Activate your account</div>
          <div>
            <button className="Activate_btn" onClick={submit}>
              Activate
            </button>
          </div>
          <Link to="/" className="register_now">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
