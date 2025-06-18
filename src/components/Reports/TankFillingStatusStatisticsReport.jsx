import React from 'react'
import { Row, Col, Alert, Card, Button } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { useState, useEffect} from 'react';
import TankFillingService from '../../services/TankFillingService';
import UserService from '../../services/UserService';
import Form from 'react-bootstrap/Form';
export const TankFillingStatusStatisticsReport = () => {

  const [reportData, setReportData] = useState();
  const [errorData, seterrorData] = useState(null);
  const [unitsList, setUnitsList] = useState([]);
  const [selUnitId, setselUnitId] = useState(0);
  const [selFromDate, setselFromDate] = useState(0);
  const [selToDate, setselToDate] = useState(0);

  
   useEffect(() => {
    UserService.getUnits( (response) => {
       // console.log(response.data.data)
        const dataArray = Object.values(response.data.data); 
              setUnitsList(dataArray);
            },
            (error) => {
              console.error("Error fetching project list:", error);
            }
          );
        }, []);

  const tankFillingStatisticsReport = () => {
    TankFillingService.fetchTankFillingStatisticsReport({
      params: {
        unitId : selUnitId,
        fromDate : selFromDate,
        toDate : selToDate,
      }
    }, (response) => {
     
      setReportData(response.data.data);
      alert(response.data.data);
      seterrorData(null);
    }, (error) => {
      seterrorData("Error fetching data");
      console.log(error);
    })
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
  
    if (name === 'unitId') {
      setselUnitId(value);
    } else if (name === 'fromDate') {
      setselFromDate(value);
    } else if (name === 'toDate') {
      setselToDate(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("selFromDate:"+ selFromDate+ "selToDate"+selToDate +"selUnitId:", selUnitId);
    if (selFromDate && selToDate && selUnitId) {
        tankFillingStatisticsReport();
    }else{
      console.warn("Please fill in all fields.");
    }
  };

  const formatDate = (dateString, locale = "en-GB") => {
    if (!dateString) return "N/A"; // Handle cases where date is missing or undefined
    return new Date(dateString).toLocaleDateString(locale);
  };
  
  // useEffect(() => {
  //   console.log("selFromDate:"+ selFromDate+ "selToDate"+selToDate +"selUnitId:", selUnitId);
  //   if (selFromDate && selToDate && selUnitId) {
  //       tankFillingStatisticsReport();
  //   }
  // }, [selFromDate, selToDate, selUnitId]);


 
  return (
    <div className='d-flex justify-content-center m-3'>
      <Card className="mb-3" style={{ width: '80%' }}>
        <Card.Header style={{backgroundImage:'linear-gradient(to right,purple,#191970 )',fontSize:'medium', color: 'white' }} text="white" as="h5">TANK FILLING STATUS</Card.Header>
        <Card.Body >

          <Card.Text>
          <form onSubmit={handleSubmit}>
      <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridFinYear" >
                <Form.Label>Select Unit</Form.Label>
                <select  className="form-control"  id="unitId" name="unitId" value={selUnitId}  onChange={handleInputChange} required  >
                <option value="">Select</option>
                {unitsList.map((f) => ( <option key={f.unitId} value={f.unitId}>  {f.unitName}  </option>   ))} </select>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridworkId">
                <Form.Label>From Date : </Form.Label>
                <Form.Control  type="date" name="fromDate"  value={selFromDate}  onChange={handleInputChange} required />
                              
              </Form.Group>

              <Form.Group as={Col} controlId="formGridworkId">
                <Form.Label>To Date : </Form.Label>
                <Form.Control  type="date" name="toDate"  value={selToDate}  onChange={handleInputChange} required />
              </Form.Group>
            </Row>


            <Button type="submit" variant="primary">  Submit </Button> 
        
        {/* )} */}
        
    </form>

          {errorData && <Alert variant="danger">{errorData}</Alert>}
            <Table  bordered hover size="sm" responsive="sm" className='custom-table'>
              <thead>
                <tr>
                  <th rowSpan="2" >Sl.No</th>
                  <th rowSpan="2">Date</th>
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
                      <td >{formatDate(item.statusDate)}</td>
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
