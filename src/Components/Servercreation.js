import React from "react";
import server from "../logo/server_starting.png";

const Servercreation = () => {
  return (
    <div>
      <div className="row">
        <div className="col-md-5 m-5">
          <h4>Your server is getting created...</h4>
        </div>
        <div className="col-md-6">
          <img src={server} className="img-fluid" alt="server creating" />
        </div>
      </div>
    </div>
  );
};

export default Servercreation;
