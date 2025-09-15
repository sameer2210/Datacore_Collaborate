import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import Sidebar from "../shared/Sidebar";

function Overview() {
  return (
    <div className='text-center d-flex justify-content-center align-items-center' style={{height: "620px"}}>
    <Link to="/">
    <h4 className='text-center align-items-center fs-1'>Overview</h4></Link>  
    </div>
  )
}

export default Overview
