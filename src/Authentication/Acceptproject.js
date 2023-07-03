import React, { useEffect, useState } from 'react'
import mllogo from "../logo/mlangles360logo.png";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router';
import { backend_url, backend_url1 } from '../Config';

const Acceptproject = () => {
    const [message, setMessage] = useState("");
    const { project_id, owner_id, user_id } = useParams();
    const navigate = useNavigate();
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");

    let token = JSON.parse(localStorage.getItem("mlanglesToken"));
    let Header = { headers: { "Authorization": `Bearer ${token}` } };

    useEffect(() => {
        fetchData();
    }, []);

    function errorFun() {
        setTimeout(() => {
            setErr("");
        }, 4000)
    }

    async function fetchData() {
        try {
            const res = await axios.post(`${backend_url}/mlflow/assigned_activation/${project_id}/${owner_id}/${user_id}`, { "project_id": project_id, "owner_id": owner_id, "user_id": user_id });
            console.log("getting message from post---", res.data);
            setMsg(res.data.message);
        }
        catch (error) {
            console.log("There is an Error---", error);
            setErr(error.message);
            errorFun();
        }
    }

    async function Activate() {
        try {
            const res = await axios.put(`${backend_url}/mlflow/assigned_activation/${project_id}/${owner_id}/${user_id}`, { "project_id": project_id, "is_active": 1, "project_status": "1" });
            console.log("put method----", res);
            if (res.data.success) {
                if (token) {
                    navigate("/assignedProjects");
                } else {
                    navigate("/");
                }
            } else {
                setErr(res.data.message);
                errorFun();
            }
        }
        catch (error) {
            console.log("There is an Error---", error);
            setErr(error.message);
            errorFun();
        }
    }

    async function Decline() {
        try {
            const res = await axios.put(`${backend_url}/mlflow/assigned_activation/${project_id}/${owner_id}/${user_id}`, { "project_id": project_id, "is_active": 2, "project_status": "1" });
            console.log("put method----", res);
            if (res.data.success) {
                navigate("/");
            } else {
                setErr(res.data.message);
            }
        }
        catch (error) {
            console.log("There is an Error---", error);
            setErr(error.message);
            errorFun();
        }
    }

    return (
        <div>
            <div className="d-flex justify-content-start">
                <img src={mllogo} className="mlLogo1" alt="" />
            </div>
            <div className="sucessful container flex-center flex-col">

                {err ?
                    <div className='d-flex align-items-center justify-content-center'>
                        <h4 className='error-message'>{err}</h4>
                    </div>
                    : <></>
                }

                <p className='activepdata'>{msg} </p>
                <p className='activepdata'>Click the below link to accept the invitation</p>
                <div className="twoBtn">
                    <button onClick={() => Activate()} className='accept acceptProject'>Accept</button>
                    <button onClick={() => Decline()} className='decline'>Decline</button>
                </div>
            </div>
        </div>
    )
}

export default Acceptproject;