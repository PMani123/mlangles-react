import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router';

const DataPreview = ({ data }) => {
    const [data1, setData1] = useState([]);
    const [tableHead, setTableHead] = useState([]);
    const [page, setPage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState([]);
    let navigate = useNavigate();


    useEffect(() => {
        let token = JSON.parse(localStorage.getItem("mlanglesToken"));
        if (!token) {
            navigate("/");
        }
        async function fetchData() {
            setTotal(data);
            let newArray = data.slice(0, 10);
            setData1(newArray);
            setTableHead(Object?.keys(newArray[0]));
            let perPage = 10;
            let pageCount = Math.floor(data.length / perPage);
            setPage(pageCount);
        }
        fetchData();
    }, [data]);

    function inputSubmit(e) {
        e.preventDefault();
        //console.log("input");
        if (currentPage <= 1) {
            let newValue = currentPage - 1;
            let newArray = total.slice(newValue * 10, (newValue * 10) + 10);
            setData1(newArray);
        } else {
            let newArray = total.slice(currentPage * 10, (currentPage * 10) + 10);
            setData1(newArray);
        }
    }

    function previousBtn() {
        let newNumber = currentPage - 1;

        if (newNumber < 1) {
            setCurrentPage(1);

            let newArray = total.slice(newNumber * 10, (newNumber * 10) + 10);
            setData1(newArray);
        } else {
            //console.log(newNumber)
            setCurrentPage(newNumber);

            let newArray = total.slice(newNumber * 10, (newNumber * 10) + 10);
            setData1(newArray);
        }
    }

    function forwardBtn() {
        let newNumber = currentPage + 1;
        //console.log(currentPage, page)
        if (newNumber > page) {
            //console.log(currentPage)
            setCurrentPage(page);
            // let newArray = total.slice(newNumber * 10, (newNumber * 10) + 10);
            // setData1(newArray);
        } else {
            setCurrentPage(newNumber);
            let newArray = total.slice(newNumber * 10, (newNumber * 10) + 10);
            setData1(newArray);
        }
    }


    return (
        <div>
            {data1.length === 0 ?
                <div className='d-flex justify-content-center align-items-center'>
                    <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
                </div>
                :
                <div>
                    <div className="scroll">
                        <table>
                            <thead>
                                <tr>
                                    {tableHead?.map((ele, index) => {
                                        return (
                                            <th key={index}>{ele} </th>
                                        )
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data1.map((ele, idx) => {
                                        console.log("data1---------",data1);
                                        let value = Object.values(ele);
                                        console.log("value--------",value);
                                        return (
                                            <tr key={idx}>
                                                {
                                                    value?.map((eachtd, idxtd) => {
                                                        return (
                                                            <td key={idxtd}>  { String(eachtd)} </td>
                                                        )
                                                    })
                                                }
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="navigate d-flex justify-content-center align-items-center">
                        <div className='left both' onClick={() => previousBtn()} > <ArrowBackIosIcon /> </div>
                        <div>
                            <form onSubmit={inputSubmit}>
                                <input autoComplete="off" type="number" value={currentPage} onChange={(e) => { setCurrentPage(Number(e.target.value)); }} /><span> of {page} </span>
                                <input type='submit' hidden />
                            </form>
                        </div>
                        <div className='right both' onClick={() => forwardBtn()} > <ArrowForwardIosIcon /> </div>
                    </div>
                </div>
            }
        </div >
    )
}

export default DataPreview