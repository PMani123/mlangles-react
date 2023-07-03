import React from 'react'
import { useNavigate } from 'react-router';

const Logout = ({ no }) => {

    const navigate = useNavigate();

    function Logout() {
        localStorage.removeItem("userDetails");
        localStorage.removeItem("mlanglesToken");
        navigate("/");
    }
    return (
        <div className='logout'>
            <h4>Logout</h4>
            <h6>Would you like to logout?</h6>
            <div className="d-flex">
                <button className='yes' onClick={() => Logout()} >Yes</button>
                <button className='no' onClick={() => no()}>No</button>
            </div>
        </div>
    )
}

export default Logout;