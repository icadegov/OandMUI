import React from 'react'
import { Card, Alert } from 'react-bootstrap';

import Table from 'react-bootstrap/Table';
import ReportsService from '../../services/ReportsService';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { FinancialYearOptions } from '../Entry/FinancialYearOptions';
import PrintableComponents from '../PrintableComponents';
import DetailedTSAgmtBillsReport from './DetailedTSAgmtBillsReport';
import DetailedAAReport from './DetailedAAReport';

export const HOAWise = () => {

  const [selectedYear, setSelectedYear] = useState(null);
  const [reportData, setReportData] = useState();
  const [errorData, seterrorData] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ component: null, params: {} });

  const getSelectedYear = (data) => {
    setSelectedYear(data);
  }
  const hoaWise = () => {
    ReportsService.fetchhoaWise({
      params: {
        financialYear: selectedYear
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
      hoaWise();
    }

  }, [selectedYear])


  const calculateColumnTotal = (key) => {
    if (!reportData) {
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
        <Card.Header  className='Card-header' as="h5">HEAD OF ACCOUNT WISE - ABSTRACT REPORT</Card.Header>
        <Card.Body >

          <Card.Text>
            <Row>
              <div className='d-flex justify-content-end'>
                <p style={{ color: "red", margin:"0px",fontSize:'14px' }} >* Only Assigned Works will be reflected in this Report. Please Assign the Works after submission of Administrative Sanction.</p>
              </div>
              <div className='d-flex justify-content-end'><p style={{ color: "red" , margin:"0px",fontSize:'14px' }} >* Amount in Lakhs.</p></div>
            </Row>
            <Row className="mb-3" >
 <div className="d-flex justify-content-end">
                {/* to print json data */}
                {/* <div><PrintableComponents data={reportList} columns={reportList.length > 0 ? Object.keys(reportList[0]) : []} type={"json"} header={`SanctionAuthority Wise` +  selectedYear}></PrintableComponents></div> */}
                
                <div><PrintableComponents data="printTable" type="html" header={`HOA WISE-ABSTRACT REPORT ${selectedYear ? (parseInt(selectedYear) + -1) +  "-" + selectedYear   :""}`} ></PrintableComponents></div>
                {/* <div> <ExporttoExcel tableData={reportList}
                  fileName="SanctionAuthorityWise" ></ExporttoExcel></div> */}
              </div>

              <Form.Group as={Row} controlId="formGridFinYear" >
                <div className="d-flex justify-content-center">
                  <Form.Label className="mx-3" >Select Financial Year</Form.Label>
                  <FinancialYearOptions  selectedYearFromChild={getSelectedYear}></FinancialYearOptions>

                </div>

              </Form.Group>
            </Row>

            {errorData && <Alert variant="danger">{errorData}</Alert>}
            <div id="printTable"  className='table-responsive'>
              <Table  bordered hover size="sm" responsive="sm" className='custom-table'>
                <thead>
                  <tr>
                    <th rowSpan="3" >Sl.No</th>
                    <th rowSpan="3">Head of Account</th>
                    <th colSpan="2" rowSpan="2">Govt Sanctions</th>
                    <th colSpan="2" rowSpan="2">O&M Commttee Approval</th>
                    <th colSpan="8" rowSpan="1">Works Approved as per G.O.45</th>
                    <th colSpan="2" rowSpan="2">Total</th>
                  </tr>
                  <tr>
                    <th colSpan="2" rowSpan="1">CE</th>
                    <th colSpan="2" rowSpan="1">SE</th>
                    <th colSpan="2" rowSpan="1">EE</th>
                    <th colSpan="2" rowSpan="1">DEE</th>

                  </tr>
                  <tr>
                    <th  >No. of Works</th>
                    <th  >Amount</th>
                    <th  >No. of Works</th>
                    <th  >Amount</th>
                    <th  >No. of Works</th>
                    <th  >Amount</th>
                    <th  >No. of Works</th>
                    <th  >Amount</th>
                    <th >No. of Works</th>
                    <th  >Amount</th>
                    <th  >No. of Works</th>
                    <th  >Amount</th>
                    <th >No. of Works</th>
                    <th  >Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    reportData && reportData.map((item, index) => (
                      <tr key={index}>
                        <td >{index + 1}</td>
                        <td >{item.headOfAccount}</td>
                        <td ><Link to="#"  onClick={(e) => { e.preventDefault();  openModal('AADetail', {  unitId: 0, approvedById: 1, financialYear: selectedYear,  projectId: 0, hoaId: item.hoaId, workTypeId: 0, ProjSubType: 0, scstFunds: 0,  type: 1,  });  }} >
                                                                    {item.govtSanction} </Link></td>
                        <td >{item.govtSancAmount.toFixed(4)}</td>
                        <td ><Link to="#"  onClick={(e) => { e.preventDefault();  openModal('AADetail', {  unitId: 0, approvedById: 2, financialYear: selectedYear,  projectId: 0, hoaId: item.hoaId, workTypeId: 0, ProjSubType: 0, scstFunds: 0,  type: 1,  });  }} >
                                                                     {item.omCommiteeSanction} </Link></td>
                        <td >{item.committeeSancAmount.toFixed(4)}</td>
                        <td ><Link to="#"  onClick={(e) => { e.preventDefault();  openModal('AADetail', {  unitId: 0, approvedById: 3, financialYear: selectedYear,  projectId: 0, hoaId: item.hoaId, workTypeId: 0, ProjSubType: 0, scstFunds: 0,  type: 1,  });  }} >
                                                                     {item.go45SanctionCe} </Link></td>
                        <td>{item.go45SancAmountCe.toFixed(4)}</td>
                        <td ><Link to="#"  onClick={(e) => { e.preventDefault();  openModal('AADetail', {  unitId: 0, approvedById: 4, financialYear: selectedYear,  projectId: 0, hoaId: item.hoaId, workTypeId: 0, ProjSubType: 0, scstFunds: 0,  type: 1,  });  }} >
                                                                      {item.go45SanctionSe} </Link></td>
                        <td >{item.go45SancAmountSe.toFixed(4)}</td>
                        <td ><Link to="#"  onClick={(e) => { e.preventDefault();  openModal('AADetail', {  unitId: 0, approvedById: 5, financialYear: selectedYear,  projectId: 0, hoaId: item.hoaId, workTypeId: 0, ProjSubType: 0, scstFunds: 0,  type: 1,  });  }} >
                                                                     {item.go45SanctionEe} </Link></td>
                        <td >{item.go45SancAmountEe.toFixed(4)}</td>
                        <td ><Link to="#"  onClick={(e) => { e.preventDefault();  openModal('AADetail', {  unitId: 0, approvedById: 6, financialYear: selectedYear,  projectId: 0, hoaId: item.hoaId, workTypeId: 0, ProjSubType: 0, scstFunds: 0,  type: 1,  });  }} >
                        {item.go45SanctionDee} </Link></td>

                        <td>{item.go45SancAmountDee.toFixed(4)}</td>
                        <td><Link to="#"  onClick={(e) => { e.preventDefault();  openModal('AADetail', {  unitId: 0, approvedById: 0, financialYear: selectedYear,  projectId: 0, hoaId: item.hoaId, workTypeId: 0, ProjSubType: 0, scstFunds: 0,  type: 1,  });  }} >
                        {item.longWorkId} </Link></td>
                        <td>{item.adminSanctionAmt.toFixed(4)}</td>
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
                    <td>{calculateColumnTotal("go45SanctionCe")}</td>
                    <td>{calculateColumnTotal("go45SancAmountCe").toFixed(4)}</td>
                    <td>{calculateColumnTotal("go45SanctionSe")}</td>
                    <td >{calculateColumnTotal("go45SancAmountSe").toFixed(4)}</td>


                    <td >{calculateColumnTotal("go45SanctionEe")}</td>
                    <td>{calculateColumnTotal("go45SancAmountEe").toFixed(4)}</td>

                    <td>{calculateColumnTotal("go45SanctionDee")}</td>
                    <td>{calculateColumnTotal("go45SancAmountDee").toFixed(4)}</td>
                    <td>{calculateColumnTotal("longWorkId")}</td>
                    <td>{calculateColumnTotal("adminSanctionAmt").toFixed(4)}</td>


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
            </div>

          </Card.Text>
        </Card.Body>
      </Card>

    </div>
  )
}
