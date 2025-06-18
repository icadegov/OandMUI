import React from 'react'
import { Card, Alert } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import ReportsService from '../../services/ReportsService';
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { FinancialYearOptions } from '../Entry/FinancialYearOptions';
import Button from 'react-bootstrap/Button';
import { useNavigate  } from 'react-router-dom'; 

 const AdminSanctionEdit = () => {

  const [selectedYear, setSelectedYear] = useState(null);
  const [approvedById, setApprovedById] = useState('');
  const [reportData, setReportData] = useState();
  const [errorData, seterrorData] = useState(null); 
  const [selectedWorkData, setSelectedWorkData] = useState(null);   


  const getSelectedYear = (data) => {
    setSelectedYear(data);
    setApprovedById('')
  }

  const navigate = useNavigate();
  const handleEditScreen = (workId) => {
    //alert("workId :" +workId);
    // Fetch data from the backend before navigating
    ReportsService.fetchDataByWorkId({params: {
      workId: workId,
    }},
      (response) => {
        setSelectedWorkData(response.data); // Store the fetched data
        navigate('/submitASEdit', { state: { workData: response.data } }); // Pass the data to the next page
      }, 
      (error) => {
        seterrorData("Error fetching work data");
        console.log(error);
      }
    );
  }


  const getApprovedById = (data) => {
    setApprovedById(data);
  }

  const handleSanctionChange=(event)=>{                                                                         
    setApprovedById(event.target.value)
  }

  const sanctionAuthorityWise = () => {
    ReportsService.fetchSanctionAuthorityAndOfficeWise({
      params: {
        unitId: 9813,
        circleId:0,
        divisionId:0,   
        subDivisionId:0,
        financialYear: selectedYear,
        approvedById: approvedById
      }
    }, 
    (response) => {
      //console.log(JSON.stringify(response.data.data));
      setReportData(response.data.data);
      //console.log(response.data.data);
      seterrorData(null);
    }, (error) => {
      seterrorData("Error fetching data");
      console.log(error);
    })
  };


  useEffect(() => {
    if (!approvedById) {
      return;
    } else {
      sanctionAuthorityWise();
    }
  }, [approvedById])

 
  return (
    <div className='d-flex justify-content-center m-3'>
      <Card className="mb-3" style={{ width: '80%' }}>
        <Card.Header className='Card-header'>Edit Administrative Sanctions</Card.Header>
        <Card.Body >

          <Card.Text>

            <Row className="mb-3" >
              <Form.Group as={Row} controlId="formGridFinYear" >
              <div className="d-flex justify-content-center m-3">
  {/* Financial Year */}
  <div className="d-flex align-items-center mx-3">
    <Form.Label className="mb-0 me-2">Select Financial Year:</Form.Label>
    <FinancialYearOptions  selectedYearFromChild={getSelectedYear} />
  </div>

  {/* Sanction Authority */}
  <div className="d-flex align-items-center mx-3">
    <Form.Label className="mb-0 me-2">Sanction Authority:</Form.Label>
    <Form.Control
      as="select"
      value={approvedById}
      id="approvedById"
      onChange={handleSanctionChange}
    >
      <option value="">--Select--</option>
      <option value="1">Government Sanctions</option>
      <option value="2">O & M Committee</option>
      <option value="3">Chief Engineer</option>
      <option value="4">Superintending Engineer</option>
      <option value="5">Executive Engineer</option>
      <option value="6">Deputy Executive Engineer</option>
    </Form.Control>
  </div>
</div>
              </Form.Group>
            </Row>


            {errorData && <Alert variant="danger">{errorData}</Alert>}
            <Table striped bordered hover size="sm" responsive="sm" className='custom-table'>
              <thead>
                <tr >
                  <th>Sl.No</th>
                  <th>Work Type</th>
                  <th>Name of the Work</th>
                  <th>Proceeding Number</th>
                  <th>Administrative Amount </th>
                  <th>Head of account</th>
                  <th>Sanctioned Authority</th>
                  {/* <th>Submitted by</th> */}
                  <th>Financial Year</th>
                  <th>Update</th>
                  <th>Delete</th>
                </tr>
                
              </thead>
              <tbody>
                {
                  reportData && reportData.map((item, index) => (
                    <tr key={index}>
                      <td align="center">{index + 1}</td>
                      <td align="center">{item.workTypeName}</td>
                      <td align="center">{item.workName}</td>
                      <td align="center">{item.referenceNumber}</td>
                      <td align="center">{item.adminSanctionAmt}</td>
                      <td align="center">{item.headOfAccount}</td>
                      <td align="center">{item.approvedByName}</td>
                      {/* <td align="center">{item.finyear}</td> */}
                      <td align="center">{item.financialYear}</td>
                      <td align="center"><Button variant="primary" type="submit" onClick={() => handleEditScreen(item.workId)}>
                    Update
                  </Button></td>
                      <td align="center"><Button variant="danger" type="submit">
                    Delete
                  </Button></td>
                 
                    </tr>
                  ))
                }{
                  reportData && reportData.length === 0 && <tr><td colSpan="17" align="center">No Data Found</td></tr>
                }
              </tbody></Table>
          </Card.Text>
        </Card.Body>
      </Card>

    </div>
  )
}

export default AdminSanctionEdit;
