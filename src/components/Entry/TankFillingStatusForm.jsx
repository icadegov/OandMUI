
import React, { useState, useEffect } from "react";
import { useUserDetails } from "../UserDetailsContext";
import "bootstrap/dist/css/bootstrap.min.css";
import TankFillingService from "../../services/TankFillingService";
import { Row, Col, Alert, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const TankFillingStatusForm = () => {
  const [statusDate, setStatusDate] = useState("");
  const [lessThanTwentyFivePercent, setLessThanTwentyFivePercent] = useState("");
  const [lessThanFiftyPercent, setLessThanFiftyPercent] = useState("");
  const [lessThanSeventyFivePercent, setLessThanSeventyFivePercent] = useState("");
  const [greaterThanSeventyFivePercent, setGreaterThanSeventyFivePercent] = useState("");
  const [surplusTanks, setSurplusTanks] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [totalTankCount, setTotalTankCount] = useState(0);
  const [message, setMessage] = useState("");
  const [errormsg, setErrormsg] = useState("");
  const [errorData, seterrorData] = useState(null);
  const [unitwiseTankData, setUnitWiseTankData] = useState(null);

  const { user } = useUserDetails();
  const unitId = user.unitId;
  const insertedBy = user.username;
  const formatDateForBackend = (date) => {
    return date.toISOString().split("T")[0];
  };

  const validateForm = () => {
    const enteredTotal = parseInt(lessThanTwentyFivePercent) + parseInt(lessThanFiftyPercent) + parseInt(lessThanSeventyFivePercent) + parseInt(greaterThanSeventyFivePercent) + parseInt(surplusTanks);
    if (enteredTotal === parseInt(totalTankCount)) {
      return true;
    } else {
      alert("Please check the Entered Values. Total must be equal to total tanks count");
      resetForm();
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const formData = new FormData();
    formData.append("unitId", unitId);
    formData.append("totalTanksCount", totalTankCount);
    formData.append("statusDate", statusDate);
    formData.append("lessThanTwentyFivePercent", lessThanTwentyFivePercent);
    formData.append("lessThanFiftyPercent", lessThanFiftyPercent);
    formData.append("lessThanSeventyFivePercent", lessThanSeventyFivePercent);
    formData.append("greaterThanSeventyFivePercent", greaterThanSeventyFivePercent);
    formData.append("surplusTanks", surplusTanks);
    formData.append("remarks", remarks);
    formData.append("insertedBy", insertedBy);
    TankFillingService.saveTankFillingStatus(formData, handleResponse, handleError);
  };

  const handleResponse = (response) => {
    setMessage(response.data.message);
    setErrormsg("");
    resetForm();
  };

  const handleError = (error) => {
    setErrormsg("Error: " + error.response?.data?.message || "Something went wrong");
    setMessage("");
  };

  const resetForm = () => {
    setLessThanTwentyFivePercent("");
    setLessThanFiftyPercent("");
    setLessThanSeventyFivePercent("");
    setGreaterThanSeventyFivePercent("");
    setSurplusTanks("");
    setRemarks("");
  };

  const getExistingDataForDateAndUnit = () => {
    TankFillingService.getExistingDataForDateAndUnit(
      {
        params: {
          unitId: unitId,
        },
      },
      (response) => {
        setTotalTankCount(response.data.data);
        setStatusDate(formatDateForBackend(new Date()));
        seterrorData(null);
      },
      (error) => {
        seterrorData("Error fetching data");
        console.log(error);
      },
    );
  };

  useEffect(() => {
    if (unitId) {
      getExistingDataForDateAndUnit(unitId);
    }
  }, [unitId]);

  const navigate = useNavigate();
  const getTankDetails = () => {
    const userData = {
      unitId: user.unitId,
      circleId: user.circleId,
      divisionId: user.divisionId,
      subDivisionId: user.subDivisionId,
    };
    TankFillingService.fetchTankDataByunitId(
      userData,
      (response) => {
        setUnitWiseTankData(response.data.data); // Store the fetched data
        navigate("/totalTanksListForTankFilling", { state: { unitwiseTankData: response.data.data } }); // Pass the data to the next page
      },
      (error) => {
        seterrorData("Error fetching work data");
        console.log(error);
      },
    );
  };

  return (
    <div className="d-flex justify-content-center m-3">
      <Card className="mb-3" style={{ width: "80%" }}>
        {message && (
          <Alert variant="success" className="m-3">
            {message}
          </Alert>
        )}
        {errormsg && <Alert variant="danger">{errormsg}</Alert>}

        <Card.Header className="Card-header">Tank Filling Status Entry</Card.Header>

        <p className="text-end text-danger">
          <b> *Total Number of tanks excludes Check Dams, Forest Tanks, Percolation Tanks and Private Tanks </b>
        </p>

        <Card.Body>
          {message && <div style={{ color: "red" }}>{message}</div>}
          <form onSubmit={handleSubmit}>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th>Territorial ENC / CE</th>
                  <td>
                    {" "}
                    {user.unitName} <input type="hidden" name="unitId" value={user.unitId} />{" "}
                  </td>
                </tr>
                <tr>
                  <th>Total No. of Tanks</th>
                  {/* <td>  <a href="#" onClick={() => handleEditScreen()}>  {totalTankCount}  </a> */}

                  <td>
                    <Button variant="link" onClick={() => getTankDetails()}>
                      {" "}
                      {totalTankCount}{" "}
                    </Button>
                    <input type="hidden" name="totalTankCount" value={totalTankCount} />
                  </td>
                </tr>
                <tr>
                  <th>Date</th>
                  <td>
                    {" "}
                    {new Date().toLocaleDateString()} <input type="hidden" name="statusDate" value={statusDate} />{" "}
                  </td>
                </tr>
                <tr>
                  <th>0-25%</th>
                  <td>
                    <input type="number" name="lessThanTwentyFivePercent" value={lessThanTwentyFivePercent} onChange={(e) => setLessThanTwentyFivePercent(e.target.value)} required />{" "}
                  </td>
                </tr>
                <tr>
                  <th>25-50%</th>
                  <td>
                    {" "}
                    <input type="number" name="lessThanFiftyPercent" value={lessThanFiftyPercent} onChange={(e) => setLessThanFiftyPercent(e.target.value)} required />{" "}
                  </td>
                </tr>
                <tr>
                  <th>50-75%</th>
                  <td>
                    {" "}
                    <input type="number" name="lessThanSeventyFivePercent" value={lessThanSeventyFivePercent} onChange={(e) => setLessThanSeventyFivePercent(e.target.value)} required />{" "}
                  </td>
                </tr>
                <tr>
                  <th>75-100%</th>
                  <td>
                    {" "}
                    <input type="number" name="greaterThanSeventyFivePercent" value={greaterThanSeventyFivePercent} onChange={(e) => setGreaterThanSeventyFivePercent(e.target.value)} required />{" "}
                  </td>
                </tr>
                <tr>
                  <th>Surplus Tanks</th>
                  <td>
                    {" "}
                    <input type="number" name="surplusTanks" value={surplusTanks} onChange={(e) => setSurplusTanks(e.target.value)} required />
                  </td>
                </tr>
                <tr>
                  <th>Remarks</th>
                  <td>
                    {" "}
                    <input type="text" name="remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} required />{" "}
                  </td>
                </tr>
              </tbody>
            </table>
            <Row>
              <Col xs={12} sm={12} className="text-center">
                <Button type="submit" variant="primary">
                  Submit
                </Button>
              </Col>
            </Row>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TankFillingStatusForm;
