import React, { useEffect, useState } from "react";
import Servercreation from "./Servercreation";

const Createserver = () => {
  const [options, setOptions] = useState([]);
  const [server, setServer] = useState(false);
  useEffect(() => {
    setOptions([
      "min6in.large",
      "min6in.xlarge",
      "min6in.2xlarge",
      "min6in.4xlarge",
      "min6in.8xlarge",
    ]);
  }, []);
  console.log(options);
  return (
    <div className="servercreation">
      {server ? (
        <Servercreation />
      ) : (
        <div className="container-fluid box createserver">
          <h4>Server</h4>
          <div className="row">
            <div className="col-md-6">
              <div>
                <label htmlFor="server" className="select">
                  Select Server
                </label>
              </div>
              <div>
                <select name="" id="">
                  <option>EC2 Instance Types</option>
                  {options.map((option, idx) => {
                    return (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    );
                  })}
                </select>
              </div>
              <p className="pur">Server details : </p>
              <table cellPadding="12">
                <tbody>
                  <tr>
                    <td style={{ marginBottom: "24px" }}>Instance Type :</td>
                    <td>EC2 Instance Types </td>
                  </tr>
                  <tr>
                    <td>RAM :</td>
                    <td>8</td>
                  </tr>
                  <tr>
                    <td>Memory :</td>
                    <td>100GB</td>
                  </tr>
                </tbody>
              </table>
              {/* <p>Instance Type: EC2 Instance Types </p>
          <p>RAM : 8 </p>
          <p>CPU : 2 </p>
          <p>Memory : 100GB </p> */}
              <h6>
                Warning:Select the server based on the data size. For large data
                select large server, if you want to create a new server, the
                present server need to delete when the server the deleted the
                all projects will be deleted.
              </h6>
              <button
                type="submit"
                onClick={(e) => setServer(true)}
                className="login_btn serverbtn"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Createserver;
