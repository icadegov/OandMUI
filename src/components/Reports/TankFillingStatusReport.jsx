import React from 'react'
import { Row, Col, Alert, Card } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { useState, useEffect} from 'react';
import TankFillingService from '../../services/TankFillingService';
import Form from 'react-bootstrap/Form';
export const TankFillingStatusReport = () => {

  const [reportData, setReportData] = useState();
  const [errorData, seterrorData] = useState(null);
  const [selDate, setSelDate] = useState(0);

  

  const tankFillingStatusReport = () => {
    TankFillingService.fetchTankFillingStatusReport({
      params: {
        statusDate : selDate,
      }
    }, (response) => {
     console.log(JSON.stringify(response.data.data));
      setReportData(response.data.data);
      seterrorData(null);
    }, (error) => {
      seterrorData("Error fetching data");
      console.log(error);
    })
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
  
    if (name === 'statusDate') {
      setSelDate(value);
    } 
  };

  
  useEffect(() => {
    console.log("selFromDate:"+ selDate);
    if (selDate ) {
        tankFillingStatusReport();
    }
  }, [selDate]);


 
  return (
    <div className='d-flex justify-content-center m-3'>
      <Card className="mb-3" style={{ width: '80%' }}>
        <Card.Header style={{backgroundImage:'linear-gradient(to right,purple,#191970 )',fontSize:'medium', color: 'white' }} text="white" as="h5">TANK FILLING STATUS</Card.Header>
        <Card.Body >

          <Card.Text>
    
      <Row className="mb-3">
             
              <Form.Group as={Col} controlId="formGridworkId">
                <Form.Label>Select Date : </Form.Label>
                <Form.Control  type="date" name="statusDate"  value={selDate}  onChange={handleInputChange} required />
                              
              </Form.Group>

              
            </Row> 
        
        {/* )} */}
        
   

          {errorData && <Alert variant="danger">{errorData}</Alert>}
            <Table  bordered hover size="sm" responsive="sm" className='custom-table'>
              <thead>
                <tr>
                  <th rowSpan="2" >Sl.No</th>
                  <th rowSpan="2">Unit</th>
                  <th rowSpan="2">Total No. of Tanks </th>
                  <th colSpan="6" rowSpan="1">Tank Filling Status</th>
                </tr>
                <tr>
                  <th>0-25%</th>
                  <th>25-50%</th>
                  <th>50-75%</th>
                  <th>75-100%</th>
                  <th>Surplus Tanks</th>
                  <th>Remarks Fed by Major/Medium/LI Projects/ Rain</th>
                </tr>
              </thead>
              <tbody>
                {
                  reportData && reportData.map((item, index) => (
                    <tr key={index}>
                      <td >{index + 1}</td>
                      <td >{item.unitName}</td>
                      <td >{item.totalTanksCount}</td>
                      <td >{item.lessThanTwentyFivePercent}</td>
                      <td >{item.lessThanFiftyPercent}</td>
                      <td >{item.lessThanSeventyFivePercent}</td>
                      <td >{item.greaterThanSeventyFivePercent}</td>
                      <td >{item.surplusTanks}</td>
                      <td >{item.remarks}</td>
                    </tr>
                  ))
                }{
                  reportData && reportData.length === 0 && <tr><td colSpan="9" align="center">No Data Found</td></tr>
                }
              </tbody>
             
                   </Table>
          </Card.Text>
        </Card.Body>
      </Card>

    </div>
  )
}
