import React from 'react'
import { Card, Alert } from 'react-bootstrap';

import Table from 'react-bootstrap/Table';
import ReportsService from '../../services/ReportsService';
import { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { FinancialYearOptions } from '../Entry/FinancialYearOptions';
import DetailedTSAgmtBillsReport from './DetailedTSAgmtBillsReport';
import DetailedAAReport from './DetailedAAReport';

export const WorkTypeWise = () => {

  const [selectedYear, setSelectedYear] = useState(null);
  const [reportData, setReportData] = useState();
  const [errorData, seterrorData] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
const [modalData, setModalData] = useState({ component: null, params: {} });

  const getSelectedYear = (data) => {
       setSelectedYear(data);
  }
  const WorkTypeWise = () => {
    ReportsService.fetchWorkTypeWise({
      params: {
        finyear: selectedYear
      }
    }, (response) => {
     
      setReportData(response.data.data);
      seterrorData(null);
    }, (error) => {
      seterrorData("Error fetching data");
      console.log(error);
    })
  };

  useEffect(() => {
    if (!selectedYear) {
      return;
    } else {
        WorkTypeWise();
    }

  }, [selectedYear])


  const calculateColumnTotal = (key) => {
    if(!reportData){
      return 0;
    }
    return reportData.reduce((total, item) => total + (item[key] || 0), 0);
  };

  const openModal = (component, params) => {
    setModalData({ component, params });
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setModalData({ component: null, params: {} });
  };

  return (
    <div className='d-flex justify-content-center m-3'>
      <Card className="mb-3" style={{ width: '80%' }}>
        <Card.Header  className='Card-header'  as="h5">WORK CATEGORY WISE - ABSTRACT REPORT</Card.Header>
        <Card.Body >

          <Card.Text>
          <Row>
          {/* <div className='d-flex justify-content-end'>
                <p style={{color:"red"}} >* Only Assigned Works will be reflected in this Report. Please Assign the Works after submission of Administrative Sanction.</p>
                </div> */}
                <div className='d-flex justify-content-end'><p style={{color:"red"}} >* Amount in Lakhs.</p></div>
                </Row>
            <Row className="mb-3" >
              <Form.Group as={Row} controlId="formGridFinYear" >
                <div className="d-flex justify-content-center m-3">
                  <Form.Label className="mx-3" >Select Financial Year</Form.Label>
                  <FinancialYearOptions selectedYearFromChild={getSelectedYear}></FinancialYearOptions>
                  
                </div>
               
              </Form.Group>
            </Row>
          
            {errorData && <Alert variant="danger">{errorData}</Alert>}
            <Table bordered hover size="sm" responsive="sm" className='custom-table' >
              <thead>
                <tr>
                  <th rowSpan="2" >Sl.No</th>
                  <th rowSpan="2">Work Category</th>
                 <th colSpan="2" >Admin Sanctions</th>
                  <th colSpan="2" >Technical Sanction</th>
                  <th colSpan="2" >Tender Called for</th>
                  <th colSpan="2">Agreement Done</th>
                  <th colSpan="2">Action to be taken</th>
                  <th colSpan="2">Bill Status</th>
                </tr>
                
                <tr>
                  <th  >Nos</th>
                  <th  >Amount</th>
                  <th  >Nos</th>
                  <th  >Amount</th>
                  <th  >Nos</th>
                  <th  >Amount</th>
                  <th  >Nos</th>
                  <th  >Amount</th>
                  <th >Nos</th>
                  <th  >Amount</th>
                  <th  >paid</th>
                  <th  >pending</th>
                </tr>
              </thead>
              <tbody>
                {
                  reportData && reportData.map((item, index) => (
                    <tr key={index}>
                      <td >{index + 1}</td>
                      <td >{item.workTypeName}</td>    
                      <td ><Link to="#"  onClick={(e) => { e.preventDefault();  openModal('AADetail', {  unitId: 0, approvedById: 0, financialYear: selectedYear,  projectId: 0, hoaId: 0, workTypeId: item.workTypeId, ProjSubType: 0, scstFunds: 0,  type: 1,  });  }} >
                      {item.adminCount} </Link> </td>
                        {/* <Link to="#" onClick={(e) => {  e.preventDefault();  window.open(  `/O&MWorksAADetailedReport?unitId=0&approvedById=0&financialYear=${selectedYear}&projectId=0&hoaId=0&workTypeId=${item.workTypeId}&ProjSubType=0&scstFunds=0&type=1`,
                           '_blank'  );  }} >{item.adminCount}</Link> */}
                      <td>{item.adminAmt.toFixed(4)}</td>
                      <td ><Link to="#"  onClick={(e) => { e.preventDefault();  openModal('TSDetail', {  unitId: 0, approvedById: 0, financialYear: selectedYear,  projectId: 0, hoaId: 0, workTypeId: item.workTypeId, ProjSubType: 0, scstFunds: 0,  type: 2,  });  }} >
                      {item.techCount} </Link> </td>
                        {/* <Link to="#" onClick={(e) => {  e.preventDefault();  window.open(  `/O&MWorksTSDetailedReport?unitId=0&approvedById=0&financialYear=${selectedYear}&projectId=0&hoaId=0&workTypeId=${item.workTypeId}&ProjSubType=0&scstFunds=0&type=2`,
                           '_blank'  );  }} >{item.techCount}</Link> */}
                      <td >{item.techAmt.toFixed(4)}</td>
                      <td ><Link to="#"  onClick={(e) => { e.preventDefault();  openModal('TSDetail', {  unitId: 0, approvedById: 0, financialYear: selectedYear,  projectId: 0, hoaId: 0, workTypeId: item.workTypeId, ProjSubType: 0, scstFunds: 0,  type: 3,  });  }} >
                      {item.agreementCount} </Link> </td>
                      <td >{item.agreementAmt.toFixed(4)}</td>
                      <td ><Link to="#"  onClick={(e) => { e.preventDefault();  openModal('TSDetail', {  unitId: 0, approvedById: 0, financialYear: selectedYear,  projectId: 0, hoaId: 0, workTypeId: item.workTypeId, ProjSubType: 0, scstFunds: 0,  type: 3,  });  }} >
                           {item.agreementCount} </Link> </td>
                      <td >{item.agreementAmt.toFixed(4)}</td>
                      <td ><Link to="#"  onClick={(e) => { e.preventDefault();  openModal('AADetail', {  unitId: 0, approvedById: 0, financialYear: selectedYear,  projectId: 0, hoaId: 0, workTypeId: item.workTypeId, ProjSubType: 0, scstFunds: 0,  type: 4,  });  }} >
                      {item.actionToBeTakenCount} </Link> </td>
                      <td>{item.actionToBeTakenAmt}</td>
                      <td><Link to="#"  onClick={(e) => { e.preventDefault();  openModal('TSDetail', {  unitId: 0, approvedById: 0, financialYear: selectedYear,  projectId: 0, hoaId: 0, workTypeId: item.workTypeId, ProjSubType: 0, scstFunds: 0,  type: 5,  });  }} >
                      {item.billsPaid} </Link></td>
                      <td><Link to="#"  onClick={(e) => { e.preventDefault();  openModal('TSDetail', {  unitId: 0, approvedById: 0, financialYear: selectedYear,  projectId: 0, hoaId: 0, workTypeId: item.workTypeId, ProjSubType: 0, scstFunds: 0,  type: 6,  });  }} >
                      {item.billsPending} </Link></td>
                    </tr>
                  ))
                }{
                  reportData && reportData.length === 0 && <tr><td colSpan="17" align="center">No Data Found</td></tr>
                }
              </tbody>
              <tfoot>
        <tr>
          <td colSpan="2"><strong>Totals</strong></td>
          <td>{calculateColumnTotal("adminCount")}</td>
          <td >{calculateColumnTotal("adminAmt").toFixed(4)}</td>
          <td >{calculateColumnTotal("techCount")}</td>
          <td>{calculateColumnTotal("techAmt").toFixed(4)}</td>
          <td>{calculateColumnTotal("agreementCount")}</td>
          <td>{calculateColumnTotal("agreementAmt").toFixed(4)}</td>
          <td>{calculateColumnTotal("agreementCount")}</td>
          <td>{calculateColumnTotal("agreementAmt").toFixed(4)}</td> 
          <td>{calculateColumnTotal("actionToBeTakenCount")}</td>
          <td>{calculateColumnTotal("actionToBeTakenAmt").toFixed(4)}</td> 
          <td>{calculateColumnTotal("billsPaid")}</td>
          <td>{calculateColumnTotal("billsPending")}</td>          
        </tr>
      </tfoot>

      {isModalOpen && (
  <div className="modal-backdrop" onClick={closeModal}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
           <button onClick={closeModal} className="modal-close-button"aria-label="Close">&times; Close</button>
      {modalData.component === 'AADetail' && (
        <DetailedAAReport {...modalData.params} />
      )}
      {modalData.component === 'TSDetail' && (
        <DetailedTSAgmtBillsReport {...modalData.params} />
      )}
    </div>
  </div>
)}
              </Table>
          </Card.Text>
        </Card.Body>
      </Card>

    </div>
  )
}
