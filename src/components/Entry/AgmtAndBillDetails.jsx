import React from 'react'
import { useState,useEffect} from 'react';
import {Alert} from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import AgreementService from '../../services/AgreementService';



export const AgmtAndBillDetails = ({changeWorkId,changeAgmtId,datafromChild}) => {

const [agmtDetails,setAgmtDetails]=useState(null);
//const [workId,setworkId] =useState(null);
const [agreementId,setagreementId] =useState(null);
//const [errorData, seterrorData] = useState(null);

const getAgmtDetails = () => {
    AgreementService.fetchAgmtAndBillDetailsByworkId({
      params: {
        workId: changeWorkId,
        agreementId : changeAgmtId
      }
    }, (response) => {
     
      setAgmtDetails(response.data.data);
      datafromChild(response.data.data);
     // seterrorData(null);
    }, (error) => {
      //seterrorData("Error fetching data");
      console.log(error);
    })
  };

    
    const formatDate = (dateString, locale = "en-GB") => {
      if (!dateString) return "N/A"; // Handle cases where date is missing or undefined
      return new Date(dateString).toLocaleDateString(locale);
    };

    useEffect(() => {
        getAgmtDetails();
      
    }, [agreementId]); 
  return (
    <>

    <Alert variant="primary" style={{height:'40px'}}>
 Agreement Details
    </Alert>
            
      <Table  bordered striped >
      <thead>
        <tr>
          <th>Agreement Number</th>
          <th>Date</th>
          <th>Agreement Amount</th>
       </tr>
      </thead>
      <tbody>
      { agmtDetails &&
        <tr>
          <td>{agmtDetails.agreementNumber}</td>
          <td>{formatDate(agmtDetails.agreementDate)}</td>
          <td>{agmtDetails.agreementAmount}</td>
        </tr>
}
      </tbody>
    </Table>

      <Alert variant="primary" style={{height:'40px'}}>
      Submitted Work Bill Details
    </Alert>
            
      
    <Table  bordered striped >
      <thead>
        <tr>
          <th>Sl.No</th>
          <th>Bill No</th>
          <th>Bill Type</th>
          <th>Gross Amount</th>
          <th>Cum. Value of Work done</th>
          <th>Status of Bill</th>
          <th>LOC File</th>
        
        </tr>
      </thead>
      <tbody>
      {
  agmtDetails && agmtDetails.billsList && agmtDetails.billsList.map((item,index)=>(
    <tr key={index}>
    <td>{index+1}</td>
    <td>{item.billNo}</td>
    <td>{item.billType}</td>
    <td>{item.workDoneAmount}</td>
    <td>{item.cumWorkDoneAmount}</td>
    <td>{item.statusId}</td>
    <td>{item.locFileUrl}</td>
   
  </tr>
  ))
}


       

      </tbody>
    </Table>

    </>
  )
}
