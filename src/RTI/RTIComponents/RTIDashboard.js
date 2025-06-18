import React, { useEffect, useState } from "react";
import { Card, Row, Container } from "react-bootstrap";
import "./RtiDashboard.css";
import { useNavigate } from "react-router-dom";
import RTIPrfmCService from "../../services/RTIPrfmCService";
import { useUserDetails } from "../../components/UserDetailsContext";

export default function RTIDashboard() {
  const [rtiLists, setRtiLists] = useState([]);
  const [reload, setReload] = useState(false); // State to trigger re-fetching
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState();
  const [error, setError] = useState(null);
  const { user } = useUserDetails();
  //console.log("userDetails", user);

  useEffect(() => {
    setLoading(true);
    const requestData = {
      year: 2024,
      quarter: 1,
      user: user, // Include userDetails in the request
    };
    RTIPrfmCService.fetchRtiCYrQtrDashboardReport(
      requestData,
      (data) => {
        setRtiLists(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching data:", error);
        setError(error);
        setLoading(false);
      },
    );
  }, [reload]);

  const totPrevPending = rtiLists.length > 0 ? (rtiLists[0].qpending ?? 0) : 0;
  const totalApplicationsRecieved = rtiLists.length > 0 ? (rtiLists[0].totapp ?? 0) : 0;
  const totalApplications = rtiLists.length > 0 ? (rtiLists[0].qpending ?? 0) + (rtiLists[0].totapp ?? 0) : 0;
  const totalPending = rtiLists.length > 0 ? (rtiLists[0].totPending ?? 0) : 0;
  const totalClosed = rtiLists.length > 0 ? (rtiLists[0].totdispo ?? 0) : 0;

  return (
    <Container fluid style={{ fontFamily: "Montserrat, sans-serif !important" }}>
      <Row className="justify-content-center mt-4">
        <div className="col-12 col-md-10 col-lg-8">
          <br />
          <Card className="mb-2">
            <Card.Header style={{ backgroundImage: "linear-gradient(to right,purple,#191970 )", color: "white" }}>
              <div className="text-center">
                <h2 className="card-header-text" style={{ fontSize: "18px" }}>
                  RTI Applications / Appeals
                </h2>
              </div>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                <div className="dashboard-container">
                  <div className="q1-status text-danger text-center mb-3 fw-bold">⚠️ Entry for Q1 is closed. No further input allowed.</div>
                  <h5>
                    <u>Quarterly Entry Status For the Year 2025</u>
                  </h5>{" "}
                  <br />
                  <div className="quarter-status mb-3 d-flex gap-3" style={{ justifyContent: "center" }}>
                    <div className="quarter-card closed">Q1: Closed</div>
                    <div className="quarter-card open">Q2: Open</div>
                  </div>
                  <div className="summary-cards d-flex gap-3 mb-3" style={{ justifyContent: "center" }}>
                    <div className="card bg-light p-2">Total Applications: {totalApplications}</div>
                    <div className="card bg-warning p-2">Pending: {totalPending}</div>
                    <div className="card bg-success text-white p-2">Closed: {totalClosed}</div>
                  </div>
                  <br />
                  <h5>
                    <u>Important instructions before proceeding to fill the RTI application/ RTI Appeal</u>
                  </h5>
                  <div style={{ textAlign: "left" }}>
                    <ul>
                      <li>Please fill Columns 1 to 7 for RTI applications received before the closing of the quarter, even if they are not yet disposed of.</li>
                      <li>Please enter data of all Applications & Appeals received from 01.04.2025 to 30.06.2025.</li>
                      <li>In case of amount fields, don't enter "/-".</li>
                      <li>"Deemed PIO" is from whom the PIO is taking information for an application.</li>
                      <li>In case of Application Edit—please check the checkbox for the row for which data has to be edited.</li>
                    </ul>
                  </div>
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </Row>
    </Container>
  );
}
