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

export const UnitWise = () => {

  const [selectedYear, setSelectedYear] = useState(null);
  const [reportData, setReportData] = useState();
  const [errorData, seterrorData] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ component: null, params: {} });

  const getSelectedYear = (data) => {
    setSelectedYear(data);
  }
  const unitWise = () => {
    ReportsService.fetchUnitWise({
      params: {
        finyear: selectedYear
      }
    }, (response) => {
     
      setReportData(response.data.data);
    //  alert(response.data.data);
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
        unitWise();
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
        <Card.Header  className='Card-header'  as="h5">UNIT WISE - ABSTRACT REPORT</Card.Header>
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
                  <FinancialYearOptions  selectedYearFromChild={getSelectedYear}></FinancialYearOptions>
                  
                </div>
               
              </Form.Group>
            </Row>
          
            {errorData && <Alert variant="danger">{errorData}</Alert>}
            <Table  bordered hover size="sm" responsive="sm" className='custom-table'>
              <thead>
                <tr>
                  <th rowSpan="2" >Sl.No</th>
                  <th rowSpan="2">Unit</th>
                  <th colSpan="2" rowSpan="1">Govt Sanctions</th>
                  <th colSpan="2" rowSpan="1">O&M Commttee Approval</th>
                  <th colSpan="2" rowSpan="1">G.O.45</th>
                  <th colSpan="2" rowSpan="1">Total</th>
                  <th colSpan="2" rowSpan="1">Technical Sanction</th>
                  <th colSpan="2" rowSpan="1">Tender Called for</th>
                  <th colSpan="2" rowSpan="1">Agreement Done</th>
                  <th colSpan="2" rowSpan="1">Action to be taken</th>
                  <th colSpan="2" rowSpan="1">Bill Status</th>

                </tr>
                <tr>
                  <th>Nos</th>
                  <th>Amount</th>
                  <th>Nos</th>
                  <th>Amount</th>
                  <th>Nos</th>
                  <th>Amount</th>
                  <th>Nos</th>
                  <th>Amount</th>
                  <th>Nos</th>
                  <th>Amount</th>
                  <th>Nos</th>
                  <th>Amount</th>
                  <th>Nos</th>
                  <th>Amount</th>
                  <th>Nos</th>
                  <th>Amount</th>
                  <th>Paid</th>
                  <th>Pending</th>
                </tr>
              </thead>
              <tbody>
                {
                  reportData && reportData.map((item, index) => (
                    <tr key={index}>
                      <td >{index + 1}</td>
                      <td >{item.unitName}</td>
                      <td>  <Link to="#"  onClick={(e) => { e.preventDefault();  openModal('AADetail', {  unitId: item.unitId, approvedById: 1, financialYear: selectedYear,  projectId: 0, hoaId: 0, workTypeId: 0, ProjSubType: 0, scstFunds: 0,  type: 1,  });  }} >
                                                                  {item.govtSanction} </Link> </td>
                      <td >{item.govtSancAmount.toFixed(4)}</td>
                      <td> <Link to="#"  onClick={(e) => { e.preventDefault();  openModal('AADetail', {  unitId: item.unitId, approvedById: 2, financialYear: selectedYear,  projectId: 0, hoaId: 0, workTypeId: 0, ProjSubType: 0, scstFunds: 0,  type: 1,  });  }} >
                      {item.omCommiteeSanction} </Link>  </td>
                     <td >{item.committeeSancAmount.toFixed(4)}</td>
                     <td> <Link to="#"  onClick={(e) => { e.preventDefault();  openModal('AADetail', {  unitId: item.unitId, approvedById: 3, financialYear: selectedYear,  projectId: 0, hoaId: 0, workTypeId: 0, ProjSubType: 0, scstFunds: 0,  type: 1,  });  }} >
                     {item.go45Sanction} </Link> </td>
                      <td>{item.go45SancAmount.toFixed(4)}</td>
                      <td>  <Link to="#"  onClick={(e) => { e.preventDefault();  openModal('AADetail', {  unitId: item.unitId, approvedById: 0, financialYear: selectedYear,  projectId: 0, hoaId: 0, workTypeId: 0, ProjSubType: 0, scstFunds: 0,  type: 1,  });  }} >
                      {item.adminCount} </Link> </td>
                      <td>{item.adminAmt.toFixed(4)}</td>
                      <td ><Link to="#"  onClick={(e) => { e.preventDefault();  openModal('TSDetail', {  unitId: item.unitId, approvedById: 0, financialYear: selectedYear,  projectId: 0, hoaId: 0, workTypeId: 0, ProjSubType: 0, scstFunds: 0,  type: 2,  });  }} >
                      {item.techCount} </Link></td>
                      <td >{item.techAmt.toFixed(4)}</td>
                      <td ><Link to="#"  onClick={(e) => { e.preventDefault();  openModal('TSDetail', {  unitId: item.unitId, approvedById: 0, financialYear: selectedYear,  projectId: 0, hoaId: 0, workTypeId: 0, ProjSubType: 0, scstFunds: 0,  type: 3,  });  }} >
                      {item.agreementCount} </Link></td>
                      <td >{item.agreementAmt.toFixed(4)}</td>
                      <td ><Link to="#"  onClick={(e) => { e.preventDefault();  openModal('TSDetail', {  unitId: item.unitId, approvedById: 0, financialYear: selectedYear,  projectId: 0, hoaId: 0, workTypeId: 0, ProjSubType: 0, scstFunds: 0,  type: 3,  });  }} >
                      {item.agreementCount} </Link></td>
                      <td >{item.agreementAmt.toFixed(4)}</td>
                      <td ><Link to="#"  onClick={(e) => { e.preventDefault();  openModal('AADetail', {  unitId: item.unitId, approvedById: 0, financialYear: selectedYear,  projectId: 0, hoaId: 0, workTypeId: 0, ProjSubType: 0, scstFunds: 0,  type: 4,  });  }} >
                      {item.actionToBeTakenCount} </Link></td>
                      <td>{item.actionToBeTakenAmt}</td>
                      <td><Link to="#"  onClick={(e) => { e.preventDefault();  openModal('TSDetail', {  unitId: item.unitId, approvedById: 0, financialYear: selectedYear,  projectId: 0, hoaId: 0, workTypeId: 0, ProjSubType: 0, scstFunds: 0,  type: 5,  });  }} >
                      {item.billsPaid} </Link></td>
                      <td><Link to="#"  onClick={(e) => { e.preventDefault();  openModal('TSDetail', {  unitId: item.unitId, approvedById: 0, financialYear: selectedYear,  projectId: 0, hoaId: 0, workTypeId: 0, ProjSubType: 0, scstFunds: 0,  type: 6,  });  }} >
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
          <td>{calculateColumnTotal("govtSanction")}</td>
          <td>{calculateColumnTotal("govtSancAmount").toFixed(4)}</td>
          <td>{calculateColumnTotal("omCommiteeSanction")}</td>
          <td>{calculateColumnTotal("committeeSancAmount").toFixed(4)}</td>
          <td>{calculateColumnTotal("go45Sanction")}</td>
          <td>{calculateColumnTotal("go45SancAmount").toFixed(4)}</td>
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
