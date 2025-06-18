import React from 'react'
import { useState,useEffect} from 'react';
import {Alert} from 'react-bootstrap';
import AdminSanctionService from '../../services/AdminSanctionService';
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';

export const AdminSanctionDetails = ({changeWorkId,datafromChild}) => {
    const [adminDetails,setAdminDetails]=useState(null);
   // const [workId,setworkId] =useState(null);
   const navigate = useNavigate();
    const getAdminDetails = async () => {
       // setworkId(changeWorkId);
        AdminSanctionService.getWorkDetailsByWorkId({ params: {
          workId: changeWorkId}} ,(response)=>handleResponse(response),(error)=>handleError(error));
    };
    const handleResponse=(response)=>{
      setAdminDetails(response.data.data);
      datafromChild(response.data.data);
    }
    const handleError=(error)=>{
      console.log(error);
      if(error.status === 401 || error.status === 403 || error.status === 404){navigate('/')}
    }
    const formatDate = (dateString, locale = "en-GB") => {
      if (!dateString) return "N/A"; // Handle cases where date is missing or undefined
      return new Date(dateString).toLocaleDateString(locale);
    };
    useEffect(() => {
        getAdminDetails();
    }, []); 
  return (
    <>
    <Alert variant="primary" style={{height:'40px'}}>
 Administrative Sanction
    </Alert>
             <Table  bordered striped >
      <thead>
        <tr>
          <th>Proceeding Number</th>
          <th>Date</th>
          <th>Adminstrative Sanction Amount(in Ruppees)</th>
          <th>Sanction Authority</th>
        </tr>
      </thead>
      <tbody>
      { adminDetails &&
        <tr>
          <td>{adminDetails.referenceNumber}</td>
          <td>{formatDate(adminDetails.referenceDate)}</td>
          <td>{adminDetails.adminSanctionAmt}</td>
          <td>{adminDetails.approvedByName} </td>
        </tr>
}
      </tbody>
    </Table>
  
{  adminDetails && adminDetails.techlist.length>0 && 
  <>
      <Alert variant="primary" style={{height:'40px'}}>
 Technical Sanction
    </Alert>
    <Table  bordered striped >
      <thead>
        <tr>
          <th>Proceeding Number</th>
          <th>Date</th>
          <th>Technical Sanction Amount(in Rupees)</th>
        
        </tr>
      </thead>
      <tbody>
      {
adminDetails.techlist.map((item,index)=>(
    <tr key={index}>
    <td>{item.tsNumber}</td>
    <td>{formatDate(item.tsApprovedDate)}</td>
    <td>{item.tsApprovedAmount}</td>
   
  </tr>
  ))
}
      </tbody>
    </Table>
    </>
}
    </>
  )
}
