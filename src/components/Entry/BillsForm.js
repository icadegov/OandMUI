import React from 'react'
import { useState } from 'react';

import { Card, Alert } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { FinancialYearOptions } from './FinancialYearOptions';
import { WorkDetails } from './WorkDetails';
import { AgreementDetails } from './AgreementDetails.jsx';
import  {AgmtAndBillDetails} from './AgmtAndBillDetails';
import BillService from '../../services/BillService.js';


const BillsForm = () => {
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedWorkId, setselectedWorkId] = useState();
    const [selectedWorkName , setSelectedWorkName] = useState();
    const [selectedAgreementId, setSelectedAgreementId] = useState();
    const [agmtexists, setAgmtExists] = useState();
    const [message, setMessage] = useState();
      const [errormsg, setErrormsg] = useState();
  
    const getSelectedYear = (data) => {
      setSelectedYear(data);
      setselectedWorkId(null);
    }
  
    const getSelectedWorkId = (data) => {
      //console.log("data" +data);
      setselectedWorkId(data.value);
      setSelectedWorkName(data.label);
      setSelectedAgreementId(null);
    }

    
    const getSelectedAgreementId = (data) => {
        setSelectedAgreementId(data);
        setAgmtExists(null);
      }

    const isAgmtExists = (data) => {
     setAgmtExists(data);
     // console.log("in Bills exists", { agmtexists });
    }

     const [workBills, setWorkBills] = useState(
      {
        billNo:"",
        billType: "",
        workDoneAmount: "",
        cumWorkDoneAmount: "",
        statusId: "",
       
      },
  );


  const submitForm = async (e) => {
    e.preventDefault();
   // console.log("BillsEntry :"+workBills);
    const updatedBills = { ...workBills, agreementId: selectedAgreementId, workId:selectedWorkId };
 
 // console.log("selectedAgreementId" +selectedAgreementId +" selectedWorkId" +selectedWorkId);
  try {

    if (workBills) {
        // Update Bills (PUT request)
       // await Axios.post('http://localhost:8098/OandMWorks/submitBillDetails', updatedBills);
        BillService.submitBillDetails(updatedBills, (response) => handleResponse(response), (error) => handleerror(error));
    } 
    
    // else {
    //     // Add New Student (POST request)
    //     await axios.post('http://localhost:5000/students', formData);
    // }
    // navigate('/', { state: { reload: true } }); // Navigate back with reload flag
  } catch (error) {
    console.error('Error submitting form:', error);
  }
  };

  const handleResponse = (response) => {
    setMessage(response.data.message)
  }
  const handleerror = (error) => {
console.error(error.message)
    setErrormsg(error.message);
  }

  const handleworkBillsChange=(field,value)=>{
    
    // const updatedSanctions = [...agreements];
    // updatedSanctions[field] = value;
    // setAgreements(updatedSanctions);
    
    setWorkBills({ ...workBills, [field]: value});                                                            
  }
  
   
    
  return (


    <div className='d-flex justify-content-center m-3'>
<Card className="mb-3" style={{ width: '80%' }}>
{message && <Alert variant="success" className='m-3'>{message}</Alert>}
        {errormsg && <Alert variant="danger">{errormsg}</Alert>}
      <Card.Header  className='Card-header'  as="h5">Bill Details Details</Card.Header>
      {(!message && !errormsg) &&
      <Card.Body >
        <Card.Text>

          <Row className="mb-2">
            <Form.Group as={Col} controlId="formGridFinYear" >
              <Form.Label>Select Financial Year</Form.Label>
              <FinancialYearOptions  selectedYearFromChild={getSelectedYear}></FinancialYearOptions>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridworkId">
              <Form.Label>Select Work</Form.Label>
              <WorkDetails key={selectedYear} finyear={selectedYear} selectedWorkIdFromChild={getSelectedWorkId}  handleerrorFromChild={handleerror}></WorkDetails>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridworkId">
              <Form.Label>Select Agreement</Form.Label>
              <AgreementDetails key={selectedWorkId} workId={selectedWorkId} selectagmtIdFromChild={getSelectedAgreementId} ></AgreementDetails>
            </Form.Group>
          </Row>

          <Alert variant="secondary"> <strong> Work Name : {selectedWorkName}</strong></Alert>
        

          {selectedAgreementId && <AgmtAndBillDetails key={selectedWorkId} changeWorkId={selectedWorkId} changeAgmtId={selectedAgreementId} datafromChild={isAgmtExists}></AgmtAndBillDetails>}



          {(selectedAgreementId) &&
              <>
                <Alert variant="info" style={{height:'40px'}}> Enter Work Bill Details </Alert>
             
                  <Row className="mb-3">
                    <Table bordered striped >
                      <thead>
                        <tr>
                          <th>Bill No.</th>
                          <th>Bill Type</th>
                          <th>Gross Amount</th>
                          <th>Cumulative Value of Workdone</th>
                          <th>Status of Bill</th>
                           </tr>
                      </thead>
                      <tbody>
                      

                            <tr>
                            
                              {workBills && 
        <>

                <td><Form.Control
                                type="number"
                                placeholder="Bill No"
                                id="billNo"
                                value={workBills.billNo}
                                onChange={(e) => handleworkBillsChange( "billNo", e.target.value)}
                                required
                            />
                           </td>

          <td> <Form.Control  as="select"  value={workBills.billType}  id="billType"
          onChange={(e) => handleworkBillsChange("billType", e.target.value)} required
           // Bootstrap validation styling
        >
          <option value="">--Select Bill Type--</option>
          <option value="part">Part</option>
          <option value="final">Final</option>
        </Form.Control>
                </td>

            <td> <Form.Control
                                type="number"
                                placeholder="Enter Present Gross Amount"
                                id="workDoneAmount"  value={workBills.workDoneAmount}
                                onChange={(e) => handleworkBillsChange( "workDoneAmount", e.target.value)}
                                required
                            />
                        </td>
          <td><Form.Control
                                type="number"
                                placeholder="Enter Cumulative Work Value"
                                id="cumWorkDoneAmount"
                                value={workBills.cumWorkDoneAmount}
                                onChange={(e) => handleworkBillsChange( "cumWorkDoneAmount", e.target.value)}
                                required
                            />
                           </td>
          
                           <td><Form.Control  as="select"  value={workBills.statusId}  id="statusId"
          onChange={(e) => handleworkBillsChange("statusId", e.target.value)} required
           // Bootstrap validation styling
        >
          <option value="">--Select Bill Type--</option>
          <option value="1">Bill not raised</option>
          <option value="2">Bill Submitted</option>
          <option value="3">LOC Requested</option>
          <option value="4">LOC Released</option>
          <option value="5">Bill pending for Authorization</option>
          <option value="6">Bill paid</option>
        </Form.Control>
                           </td>

        </>


  }  
 </tr> 
  </tbody>
                </Table>

                  </Row>
            <Button variant="primary" type="submit" onClick={submitForm}>
                    Submit
                  </Button>
               
              </>

            }


          </Card.Text>
</Card.Body>
}
 </Card>
</div>
  )
}

export default BillsForm