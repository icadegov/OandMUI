import React from 'react'
import { useState } from 'react';
import { Card, Alert } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import { useFormik } from "formik";
import * as yup from "yup";
import { FinancialYearOptions } from './FinancialYearOptions';
import { AdminSanctionDetails } from './AdminSanctionDetails';
import { WorkDetails } from './WorkDetails';

import { TechnicalSanctionDetails } from './TechnicalSanctionDetails';
import AgreementService from '../../services/AgreementService';

export default function AgreementsForm() {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedWorkId, setselectedWorkId] = useState();
  const [selectedWorkName, setSelectedWorkName] = useState();
  const [selectedTechId, setSelectedTechId] = useState();
  const [techexists, setTechExists] = useState();
  const [message, setMessage] = useState();
  const [errormsg, setErrormsg] = useState();

  const getSelectedYear = (data) => {
    setSelectedYear(data);
    setselectedWorkId(null);
    setSelectedWorkName(null);
  }

  const getSelectedWorkId = (data) => {
    //console.log("data" + data);
    setselectedWorkId(data.value);
    setSelectedWorkName(data.label);
    setSelectedTechId(null);
  }

  const getSelectedTechId = (data) => {
    setSelectedTechId(data);
    setTechExists(null);
  }

  const isTechExists = (data) => {
    setTechExists(data.techlist.length);
   // console.log("in tech exists", { techexists });
  }

  const validationSchema = yup.object({
     typeId: yup.string().required('Work called by is required'),
     tenderPercentage: yup.string().matches(/^[+-]?\d+(\.\d+)?$/, 'Invalid number format').required('Tender Percentage is required'),
     agreementNumber: yup.string().required('Agreement Number is required'),
     agencyName: yup.string().required('Agreement Number is required'),
    agreementAmount: yup.string().matches(/^\d+$/, 'Please Enter Amount' ).required('Agreement Amount is required'),
     agreementDate: yup.date().required('Agreement Date is required').typeError('Invalid date format'),
     tenderDate: yup.date().required('Tender Date is required').typeError('Invalid date format'),
  });

  //const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      typeId: '',
      tenderDate: '',
      agencyName: '',
      tenderPercentage: '',
      agreementNumber: '',
      agreementDate: '',
      agreementAmount: '',
      techId: '',
      workId: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert(values);
      formik.setFieldValue("workId", selectedWorkId);
      formik.setFieldValue("techId", selectedTechId);
      const updatedAgmts = { ...values, techId: selectedTechId, workId:selectedWorkId };
      console.log("strinify", JSON.stringify(updatedAgmts));
      AgreementService.saveAllAgreements(updatedAgmts, (response) => handleResponse(response), (error) => handleerror(error));
      // navigate('/');
    },
  });
  const handleResponse = (response) => {
    setMessage(response.data.message)
  }
  const handleerror = (error) => {
console.error(error.message)
    setErrormsg(error.message);
  }
  return (

    <div className='d-flex justify-content-center m-3'>
      <Card className="mb-3" style={{ width: '80%' }}>
        {message && <Alert variant="success" className='m-3' style={{ height: '40px', textAlign: 'left' }}>
          {message}     </Alert>}

        {errormsg && <Alert variant="danger" style={{ height: '40px' }}>
          {errormsg}     </Alert>}
        <Card.Header  className='Card-header' as="h5">Agreement Details</Card.Header>
        {(!message && !errormsg) &&
        <Card.Body >
          <Card.Text>

            <Row className="mb-2">
              <Form.Group as={Col} controlId="formGridFinYear" >
                <Form.Label>Select Financial Year</Form.Label>
                <FinancialYearOptions  selectedYearFromChild={getSelectedYear}></FinancialYearOptions>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridworkId">
                <Form.Label>Select WorkId</Form.Label>
                <WorkDetails key={selectedYear} finyear={selectedYear} selectedWorkIdFromChild={getSelectedWorkId} handleerrorFromChild={handleerror}></WorkDetails>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridworkId">
                <Form.Label>Select Technical Sanction</Form.Label>
                {selectedWorkId && <TechnicalSanctionDetails key={selectedWorkId} workId={selectedWorkId} selectTechIdFromChild={getSelectedTechId}></TechnicalSanctionDetails>}
              </Form.Group>
            </Row>
            <Alert variant="secondary"> <strong> Work Name : {selectedWorkName}</strong></Alert>
            {selectedTechId && <AdminSanctionDetails key={selectedWorkId} changeWorkId={selectedWorkId} datafromChild={isTechExists}></AdminSanctionDetails>}
            <form onSubmit={formik.handleSubmit}>
              {(selectedTechId) &&
                <>
                  <Alert variant="info" style={{height:'40px'}}>  Enter Tender Details   </Alert>

                  <Row className="mb-3">
                    <Table bordered striped >
                      <thead>
                        <tr>
                          <th>Work called by</th>
                          <th>Work Called Date</th>
                          <th> Agency Name</th>
                          <th>Tender %(Please include + or - )</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>

                          {/* {formik.values.agreements && */}
                            <>
                              <td> <Form.Control as="select"  id="typeId"
                                //   onChange={(e) => handleAgreementsChange("typeId", e.target.value)} required
                                onChange={formik.handleChange}
                              // Bootstrap validation styling
                              >
                                <option value="">--Select a category--</option>
                                <option value="1">Tender</option>
                                <option value="2">Nomination</option>
                                <option value="3">work Order</option>
                                <option value="4">Others</option>
                              </Form.Control>

                              </td>
                              <td> <Form.Control
                                type="date"
                                placeholder="Enter Tender Date."
                                id="tenderDate"
                                //value={agreements.tenderDate}
                                // onChange={(e) => handleAgreementsChange( "tenderDate", e.target.value)}
                                onChange={formik.handleChange}
                                required
                                value={formik.values.tenderDate}
                                onBlur={formik.handleBlur}
                                isInvalid={formik.touched.username && !!(formik.errors.username)}
                              />
                              </td>
                              <td><Form.Control
                                type="text"
                                placeholder="Enter Agency Name"
                                id="agencyName"
                                
                                //onChange={(e) => handleAgreementsChange( "agencyName", e.target.value)}
                                onChange={formik.handleChange}
                                required
                              />
                              </td>

                              <td><Form.Control
                                type="number"
                                placeholder="Enter Tender Percentage"
                                id="tenderPercentage"
                            
                                // onChange={(e) => handleAgreementsChange( "tenderPercentage", e.target.value)}
                                onChange={formik.handleChange}
                                required
                              />
                              </td>

                            </>

                          {/* } */}
                        </tr>


                      </tbody>
                    </Table>

                  </Row>

                  <Alert variant="info" style={{height:'40px'}}> Enter Agreement Details </Alert>
                  <Row className="mb-3"> 
                    <Table bordered striped >
                      <thead>
                        <tr>
                          <th>Agreement No.</th>
                          <th>Date</th>
                          <th>Agreement Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {/* {formik.values.agreements && */}
                            <>
                              <td><Form.Control
                                type="text"
                                placeholder="Enter Agreement No."
                                id="agreementNumber" 
                                //onChange={(e) => handleAgreementsChange( "agreementNumber", e.target.value)}
                                onChange={formik.handleChange}
                                required />

                              </td>
                              <td> <Form.Control
                                type="date"
                                placeholder="dd/MM/yyyy"
                                id="agreementDate" 
                                // onChange={(e) => handleAgreementsChange("agreementDate", e.target.value)}
                                onChange={formik.handleChange}
                                required
                              />
                              </td>
                              <td><Form.Control
                                type="number"
                                placeholder="Enter Agreement Amount"
                                id="agreementAmount"
                                name="agreementAmount"
                                // onChange={(e) => handleAgreementsChange( "agreementAmount", e.target.value)}
                                onChange={formik.handleChange}
                                required
                              />
                              {formik.values.agreementAmount && (
                      <Form.Text className="text-muted">
                        <div style={{ color: "green", marginTop: "5px" }}>
                          Entered amount: {formik.values.agreementAmount / 100000} Lakh
                        </div>
                      </Form.Text>
                    )}
                              </td>
                            </>
                          {/* } */}
                        </tr>
                      </tbody>
                    </Table>
                  </Row>
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                </>
                  
              }
</form>
          </Card.Text>
        </Card.Body>
}
      </Card>
    </div>
  )
}

