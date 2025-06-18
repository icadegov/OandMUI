import React from "react";
import { useState } from "react";
import { Card, Alert } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import { FinancialYearOptions } from "./FinancialYearOptions";
import { AdminSanctionDetails } from "./AdminSanctionDetails";
import { WorkDetails } from "./WorkDetails";
import TechnicalSanctionService from "../../services/TechnicalSanctionService";
import { useNavigate } from "react-router-dom";
import { useUserDetails } from "../UserDetailsContext";

function TechnicalSanctionForm() {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedWorkId, setselectedWorkId] = useState();
  const [techexists, setTechExists] = useState();
  const [key, setKey] = useState(0);
  const navigate = useNavigate();
  const [getTechList, setgetTechList] = useState();
  const [message, setMessage] = useState("");
  const [errormsg, setErrormsg] = useState("");

  const { user } = useUserDetails();

  const [tstypeRadio, settsTypeRadio] = useState(2);

  const getSelectedYear = (data) => {
    setSelectedYear(data);
    setselectedWorkId(null);
  };

  const getSelectedWorkId = (data) => {
    setselectedWorkId(data.value);
    //setErrormsg(errorFromChild);
    setTechExists(null);
  };

  const isTechExists = (data) => {
    setTechExists(data.techlist.length);

    setgetTechList(data.techlist);
  };

  const initialList = [
    {
      tsType: "",
      tsNumber: "",
      tsApprovedAmount: "",
      tsDate: "",
      techSancUrl: "",
      techEstimateUrl: "",
    },
  ];

  const [techList, settechList] = useState(initialList);
  // const FILE_SIZE = 1024 * 1024 * 2; // 2MB
  // const SUPPORTED_FORMATS = ['application/pdf'];

  const handleTechSanctionChange = (index, field, value) => {
    const updatedSanctions = [...techList];
    updatedSanctions[index][field] = value;
    settechList(updatedSanctions);
  };

  const addRow = () => {
    //console.log(UserService.getUserDetailsFromHRMS());
    settechList([...techList, { techSanctionNo: "", tsDate: "", techSanctionAmt: "", techSancFile: null, techEstimateFile: null }]);
  };

  const removeRow = (index) => {
    if (index > 0) {
      const updatedList = [...techList]; // Create a copy

      updatedList.splice(index, 1); // Remove the item at the given index
      settechList(updatedList);
    }
  };
  const submitForm = async (e) => {
    e.preventDefault();
    let isValid = true;
    const maxFileSize = 10 * 1024 * 1024; // maximum file size in bytes 10MB
    const formData = new FormData();
    techList.forEach((item, index) => {
      if (!item.tsNumber) {
        isValid = false;
        //setMessage("");
        //  setErrormsg(`Tech list item ${index + 1}: TS Number is required.`);
        //setValError(`Tech list item ${index + 1}: TS Number is required.`);
        alert(`Tech list item ${index + 1}: TS Approved Amount is required.`);
        return;
      }
      if (!item.tsApprovedAmount) {
        isValid = false;
        alert(`Tech list item ${index + 1}: TS Approved Amount is required.`);
        return;
      }
      if (!item.tsDate) {
        isValid = false;
        alert(`Tech list item ${index + 1}: TS Date is required.`);
        return;
      }
      if (!item.techSancUrl) {
        isValid = false;
        alert(`Tech list item ${index + 1}: Tech Sanction URL is required.`);
        return;
      }
      if (!item.techEstimateUrl) {
        isValid = false;
        alert(`Tech list item ${index + 1}: Tech Estimate URL is required.`);
        return;
      }
      if (!tstypeRadio) {
        isValid = false;
        alert(`TS Type is required for item ${index + 1}.`);
        return;
      }
      if (!selectedWorkId) {
        isValid = false;
        alert("Selected Work ID is required.");
        return;
      }

      // Validate file size if applicable (assuming URLs point to File objects)
      if (item.techSancUrl instanceof File && item.techSancUrl.size > maxFileSize) {
        isValid = false;
        alert(`Tech Sanction file for item ${index + 1} exceeds the maximum size of 10MB.`);
        return;
      }
      if (item.techEstimateUrl instanceof File && item.techEstimateUrl.size > maxFileSize) {
        isValid = false;
        alert(`Tech Estimate file for item ${index + 1} exceeds the maximum size of 10MB.`);
        return;
      }
      formData.append(`techList[${index}].tsNumber`, item.tsNumber);
      formData.append(`techList[${index}].tsApprovedAmount`, item.tsApprovedAmount);
      formData.append(`techList[${index}].tsDate`, item.tsDate);
      formData.append(`techList[${index}].techSancUrl`, item.techSancUrl);
      formData.append(`techList[${index}].techEstimateUrl`, item.techEstimateUrl);
      formData.append(`techList[${index}].tsType`, tstypeRadio);
      formData.append(`techList[${index}].workId`, selectedWorkId);
      formData.append(`techList[${index}].updatedBy`, user.username);
    });

    if (isValid) {
      TechnicalSanctionService.saveAllTechnicalSanction(
        formData,
        (response) => handleResponse(response),
        (error) => handleerror(error),
      );
    }
  };

  const handleResponse = (response) => {
    setgetTechList([...getTechList, response.data.data[0]]);
    setMessage(response.data.message);
    settechList(initialList);
    setKey((prevKey) => prevKey + 1);
    settsTypeRadio(2);
  };
  const handleerror = (error) => {
    if (error.status === 401 || error.status === 403 || error.status === 404) {
      navigate("/");
    }

    setErrormsg(error.message);
  };

  return (
    <div className="d-flex justify-content-center m-3">
      <Card className="mb-3" style={{ width: "80%" }}>
        {message && (
          <Alert variant="success" className="m-3" style={{ height: "40px", textAlign: "left" }}>
            {message}{" "}
          </Alert>
        )}

        {errormsg && (
          <Alert variant="danger" style={{ height: "40px" }}>
            {errormsg}{" "}
          </Alert>
        )}

        <Card.Header className="Card-header" as="h5">
          Technical Sanction
        </Card.Header>
        <Card.Body>
          <Card.Text>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridFinYear">
                <Form.Label>Select Financial Year</Form.Label>
                <FinancialYearOptions selectedYearFromChild={getSelectedYear}></FinancialYearOptions>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridworkId">
                <Form.Label>Select WorkId</Form.Label>
                {selectedYear && <WorkDetails key={selectedYear} finyear={selectedYear} selectedWorkIdFromChild={getSelectedWorkId} handleerrorFromChild={handleerror}></WorkDetails>}
              </Form.Group>
            </Row>
            {selectedWorkId && <AdminSanctionDetails key={`${key}-${selectedWorkId}`} changeWorkId={selectedWorkId} datafromChild={isTechExists}></AdminSanctionDetails>}

            <Form.Group as={Row} className="m-3" id="tsType" name="tsType">
              <Form.Label column sm={6} style={{ width: "50%" }}>
                For the Selected Work Technical Sanctions Already Entered, Do u want to Enter Multiple Technical Santions
              </Form.Label>

              <Form.Check style={{ width: "10%" }} type="radio" name="techSanc" label="Yes" value="1" onChange={() => settsTypeRadio(1)} checked={tstypeRadio === 1} />
              <Form.Check style={{ width: "10%" }} type="radio" name="techSanc" label="No" value="2" onChange={() => settsTypeRadio(2)} checked={tstypeRadio === 2} />
            </Form.Group>
            {((techexists && tstypeRadio === 1) || !techexists) && (
              <>
                <Alert variant="info">Enter Technical Sanction Details</Alert>

                <Row className="mb-3">
                  <Table bordered striped>
                    <thead>
                      <tr>
                        <th>Technical Sanction No. </th>
                        <th>Technical Sanction Date</th>
                        <th>Technical Sanction Amount</th>
                        <th>Upload TS File</th>
                        <th>Upload Estimate File</th>
                        <th>Select</th>
                      </tr>
                    </thead>
                    <tbody>
                      {techList &&
                        techList.map((ts, index) => (
                          <tr key={index}>
                            <td>
                              {" "}
                              <Form.Control
                                type="text"
                                placeholder="Enter Tehnical Sanction No."
                                id="tsNumber"
                                name="tsNumber"
                                value={ts.tsNumber}
                                onChange={(e) => handleTechSanctionChange(index, "tsNumber", e.target.value)}
                                required
                              />
                            </td>
                            <td>
                              {" "}
                              <Form.Control
                                type="date"
                                placeholder="Enter Tehnical Sanction Date."
                                id="tsDate"
                                name="tsDate"
                                value={ts.tsDate}
                                onChange={(e) => handleTechSanctionChange(index, "tsDate", e.target.value)}
                                required
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="number"
                                placeholder="Enter Technical Sanction Amount"
                                id="tsApprovedAmount"
                                name="tsApprovedAmount"
                                value={ts.tsApprovedAmount}
                                onChange={(e) => handleTechSanctionChange(index, "tsApprovedAmount", e.target.value)}
                                required
                              />
                            </td>
                            <td>
                              <Form.Control
                                type="file"
                                placeholder="Upload Ts File"
                                id="techSancUrl"
                                name="techSancUrl"
                                onChange={(e) => handleTechSanctionChange(index, "techSancUrl", e.target.files[0])}
                                required
                              />
                            </td>
                            <td>
                              {" "}
                              <Form.Control
                                type="file"
                                placeholder="Upload"
                                id="techEstimateUrl"
                                name="techEstimateUrl"
                                onChange={(e) => handleTechSanctionChange(index, "techEstimateUrl", e.target.files[0])}
                                required
                              />
                            </td>
                            <td>
                              {" "}
                              <Button variant="danger" onClick={() => removeRow(index)} className="me-2">
                                Remove
                              </Button>
                              <Button variant="primary" onClick={addRow}>
                                Add
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </Row>
                <Button variant="primary" type="submit" onClick={submitForm}>
                  Submit
                </Button>
              </>
            )}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

export default TechnicalSanctionForm;
