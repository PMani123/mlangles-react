import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import terminal from "../logo/terminal.png"

const PipeslineBox = ({ value, index, logs, lengthOfData }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="eachpipelinebox">
      <div className="eachpipelinebox1">
        <div className="one d-flex align-items-center justify-content-between">
          <div className="flex-start">
            <h4 className="load">
              {index + 1}. {value.name}
            </h4>
          </div>
          <div className="flex-start">

            {value.status === "IN_PROGRESS" ? (
              <i className="pi pi-spin pi-spinner orange backShape"></i>
            ) : (
              <div className="posrel logHover">
                <button className="logbutton">Logs</button>
                <img onClick={() => logs(index)} className="cursor" src={terminal} alt="terminal icon" />
              </div>
            )}
          </div>
        </div>
        <div className="d-flex both">
          <div className="two d-flex flex-col">
            <h5 className="mb-1">Time</h5>
            <h4>{value.durationMillis} ms</h4>
          </div>
          <div className="middleline ms-4"></div>
          <div className="three d-flex flex-col ms-4">
            <h5>Status</h5>
            {value.status.toUpperCase() === "SUCCESS" ? <h6 className="success">{value.status}</h6> : <></>}
            {value.status.toUpperCase() === "FAILED" ? <h6 className="failure">{value.status}</h6> : <></>}
            {value.status.toUpperCase() === "IN_PROGRESS" ? <div className="running">{value.status}</div> : <></>}
          </div>
        </div>
        {value.status.toUpperCase() === "SUCCESS" ? <div className="bottomline bottomlinegreen"></div> : <></>}
        {value.status.toUpperCase() === "FAILED" ? <div className="bottomline bottomlinered"></div> : <></>}
        {value.status === "IN_PROGRESS" ? <div className="bottomline bottomlineorange"></div> : <></>}
      </div>

      <div className="eachlogs">
        {value.status === "SUCCESS" ? <div>
          <h4 className="green" >Success </h4>
          <button onClick={() => setVisible(true)}>Logs</button>
        </div> : <></>}
        {value.status === "IN_PROGRESS" ? <div>
          <h4 className="orange">In Progress </h4>
          <button onClick={() => setVisible(true)}>Logs</button>
        </div> : <></>}
        {!value.status ? <div>
          <h4 className="red">Falied </h4>
          <button onClick={() => setVisible(true)}>Logs</button>
        </div> : <></>}

      </div>
      {index % 2 === 1 ?
        (index === lengthOfData - 1 ?
          <>
            <div className="odd-arrow-bottom">
              <div className="odd-arrowIcon-bottomup">
                <i className="fa-solid fa-chevron-right arrowIcon"></i>
              </div>
            </div>
          </> : <>
            <div className="arrowrightlinco">
              <div className="arrowiconco">
                <i className="fa-solid fa-chevron-right arrowIcon"></i>
              </div>
            </div>
            <div className="odd-arrow-bottom">
              <div className="odd-arrowIcon-bottomup">
                <i className="fa-solid fa-chevron-right arrowIcon"></i>
              </div></div>
          </>)
        :
        (
          index === 0 ?
            <>
              <div className="arrowrightlinco">
                <div className="arrowiconco">
                  <i className="fa-solid fa-chevron-right arrowIcon"></i>
                </div>
              </div>
            </>
            :
            (
              index === lengthOfData - 1 ?
                <>
                  <div className="even-arrow-bottom">
                    <div className="even-arrowIcon-bottomup">
                      <i className="fa-solid fa-chevron-right arrowIcon"></i>
                    </div>
                  </div>
                </> :
                <>
                  <div className="arrowrightlinco">
                    <div className="arrowiconco">
                      <i className="fa-solid fa-chevron-right arrowIcon"></i>
                    </div>
                  </div>
                  <div className="even-arrow-bottom">
                    <div className="even-arrowIcon-bottomup">
                      <i className="fa-solid fa-chevron-right arrowIcon"></i>
                    </div>
                  </div>
                </>
            )

        )
      }

      {/* <div className="odd-rightarrow">
        <div className="odd-arrow-right">
          <i className="fa-solid fa-chevron-right odd-arrowIcon"></i>
        </div>
      </div> */}

      {/* <Dialog
        header="Logs"
        visible={visible}
        modal={false}
        style={{ width: "50vw", borderBottom: "1px solid #363636" }}
        onHide={() => setVisible(false)}
      >
        {value?.eachLogs.split("\n").map((data, idx) => {
          return (
            <p className="m-0" key={idx} >{data}</p>
          )
        })}
      </Dialog> */}
    </div>
  );
};

export default PipeslineBox;
