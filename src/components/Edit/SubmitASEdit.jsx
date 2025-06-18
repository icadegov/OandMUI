import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {  Button, Form, Row, Table } from 'react-bootstrap';
import { FinancialYearOptions } from '../Entry/FinancialYearOptions';
import { Card , Col} from 'react-bootstrap';


function SubmitASEdit() {
  const location = useLocation();  // Access location object which contains state
  const { workData } = location.state || {};  // Destructure workId from location.state
  console.log(workData);
  const [selectedYear, setSelectedYear] = useState(workData.financialYear);

 

  // // Fetch the work data when the component loads or workId changes
  // useEffect(() => {
  //   if (workId) {
  //     AgreementService.fetchDataByWorkId(workId, 
  //       (response) => {
  //         setSelectedWorkData(response.data); // Store the fetched data
  //         setAgreements(response.data); // Set the agreements state
  //       },
  //       (error) => {
  //         console.log('Error fetching work data:', error);           
  //       }
  //     );
  //   }
  // }, [workId]);

  const [agreements, setAgreements] = useState({
    workId: workData.data.workId || '',
    workName: workData.data.workName || '', 
    hoaId: workData.data.hoaId || '',
    approvedById: workData.data.approvedById || '',
    referenceNo: workData.data.referenceNumber || '',
    adminAmt: workData.data.adminSanctionAmt || '',
    referenceDate: workData.data.referenceDate || '',
    adminSancUrl: workData.data.aaFileUrl || '',
    finYear: workData.data.financialYear || '',
    workTypeId: workData.data.workTypeId || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAgreements((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (workData) {
      // Handle any additional logic or setup here if needed
      //console.log('Received workData:', workData);  // Log the passed data
      //console.log('WorkId : ' +workData.data.workId);
      //console.log('agreements.agreementDate :' +workData.data.referenceDate);
    }else{
      //console.log('Error workDta');
    }
  }, [workData]);

  const handleYearChange = (data) => {
    setSelectedYear(data);
  };

  return (
    <>
       <div className='d-flex justify-content-center m-3'>
      <Card className="mb-3" style={{ width: '80%' }}>
        <Card.Header className='Card-header'>Edit Administrative Sanctions</Card.Header>
        <Card.Body >

          <Card.Text>
      <Row className="mb-3">
        <Table bordered striped>
          <thead>
            <tr>
              <th>Financial Year</th>
              <th>Work Type</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <FinancialYearOptions selectedYearFromChild={handleYearChange} value={selectedYear}/>
              </td>
              <td>
                <Form.Control 
                  as="select"
                  name="approvedById"
                  value={agreements.workTypeId || ''}
                  onChange={handleChange}
                >
                  <option value="1">Project</option>
                  <option value="2">Tanks/Minor Irrigation</option>
                  <option value="3">Lift Irrigation</option>
                  <option value="4">Small LIS</option>
                  <option value="5">Flood Banks</option>
                  <option value="6">Camps & Buildings</option>
                </Form.Control>
              </td>
            </tr>
          </tbody>
        </Table>
      </Row>

      <Row className="d-flex justify-content-center m-3">
        <Table bordered striped>
          <thead>
            <tr>
              <th>Name of the Work</th>
              <th>Head of Account</th>
              <th>Approved by</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Form.Control 
                  type="text"
                  name="workName"
                  value={agreements.workName || ''}
                  onChange={handleChange}
                  required
                />
              </td>
              <td>
                <Form.Control 
                  as="select"
                  name="hoaId"
                  value={agreements.hoaId || ''}
                  onChange={handleChange}
                >
                  <option value="1">2700-01-800-00-26-270-272</option>
                  <option value="2">2700-01-800-00-27-270-272</option>
                  <option value="3">2700-01-800-00-05-270-272</option>
                </Form.Control>
              </td>
              <td>
                <Form.Control 
                  as="select"
                  name="approvedById"
                  value={agreements.approvedById || ''}
                  onChange={handleChange}
                >
                  <option value="1">GOVERNMENT SANCTIONS</option>
                  <option value="2">O & M COMMITTEE</option>
                  <option value="3">CHIEF ENGINEER</option>
                  <option value="4">SUPERINTENDING ENGINEER</option>
                  <option value="5">EXECUTIVE ENGINEER</option>
                  <option value="6">DEPUTY EXECUTIVE ENGINEER</option>
                </Form.Control>
              </td>
            </tr>
          </tbody>
        </Table>
      </Row>

      <Row className="d-flex justify-content-center m-3">
        <Table bordered striped>
          <thead>
            <tr>
              <th>Admin Sanction Amount (In Rupees)</th>
              <th>Reference Number</th>
              <th>Date</th>
              <th>Modify Admin Sanction Copy</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Form.Control 
                  type="text"
                  name="adminAmt"
                  value={agreements.adminAmt || ''}
                  onChange={handleChange}
                  required
                />
              </td>
              <td>
                <Form.Control 
                  type="text"
                  name="referenceNo"
                  value={agreements.referenceNo || ''}
                  onChange={handleChange}
                  required
                />
              </td>
              <td>
                <Form.Control 
                  type="date"
                  name="agreementDate"
                  value={agreements.referenceDate || ''}
                  onChange={handleChange}
                  required
                />
              </td>
              <td>
              <a href={agreements.adminSancUrl} target="_blank" rel="noopener noreferrer">View Existing File  </a>
                <Form.Control 
                  type="file"
                  name="adminSancUrl"
                  required
                />
              </td>
            </tr>
          </tbody>
        </Table>
      </Row> </Card.Text>
      <Row>
                    <Col xs={12} sm={12} className="text-center">
                      <Button type="submit" variant="primary">
                        Submit
                      </Button>
                    </Col>
                  </Row>
        </Card.Body>
      </Card>

        {/* <Button variant="success" onClick={() => console.log("Form submitted")}>Submit</Button> */}

</div>
      
    
    </>
  );
}

export default SubmitASEdit;