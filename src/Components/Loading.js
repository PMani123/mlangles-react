import React from 'react'
import Backdrop from "@mui/material/Backdrop";

const Loading = ({ loading }) => {

    return (
        <div>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                    style={{ margin: "auto", display: "block", shapeRendering: "auto" }} width="100px"
                    height="100px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                    <defs>
                        <linearGradient id="abcdlg" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: "#B0D136", stopOpacity: "1" }} />
                            <stop offset="100%" style={{ stopColor: "#37C6F4", stopOpacity: "1" }} />
                        </linearGradient>
                    </defs>
                    <path fill="none" stroke="url(#abcdlg)" strokeWidth="6"
                        strokeDasharray="133.42624267578125 123.162685546875"
                        d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z"
                        strokeLinecap="round" style={{ transform: "scale(0.8)", transformOrigin: "50px 50px" }}>
                        <animate attributeName="stroke-dashoffset" repeatCount="indefinite" dur="1.4705882352941175s"
                            keyTimes="0;1" values="0;256.58892822265625"></animate>
                    </path>
                </svg>
            </Backdrop>
        </div>
    )
}

export default Loading