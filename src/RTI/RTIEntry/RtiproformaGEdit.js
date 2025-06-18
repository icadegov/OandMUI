import React, { useEffect, useState } from "react";
import { Button, Card, Alert } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { useNavigate, useLocation } from "react-router-dom";
import RTIPrfmGService from "../../services/RTIPrfmGService";
import { useUserDetails } from "../../components/UserDetailsContext";

export default function RtiproformaGEdit() {
  const [rtiLists, setRtiLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false); // State to trigger re-fetching
  const location = useLocation();
  const [message, setMessage] = useState(location.state?.message || "");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize the navigate hook
  const { user } = useUserDetails();

  useEffect(() => {
    setLoading(true);
    if (user && Object.keys(user).length > 0) {
      // Ensure userDetails is not empty
      setLoading(true);
      RTIPrfmGService.getRtiGEditList(
        user,
        (response) => {
          setRtiLists(response); // Assuming the response data is directly usable
          setLoading(false); // Stop loading when data is received
        },
        (error) => {
          console.error("Error fetching  RTI G Edit data list:", error);
          setLoading(false); // Stop loading on error
        },
      );
    } else {
      console.warn("User details are missing or invalid.");
      setLoading(false); // Stop loading if user details are not found
    }
  }, [reload]);

  const cellStyle = {
    border: "2px solid #D3D3D3",
    textAlign: "center",
    wordWrap: "break-word",
  };

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>Error fetching data: {error.message}</p>;
  }

  const handleDelete = (id) => {
    //console.log("RTI going for delete: ", id);
    const confirmDelete = window.confirm("Do you really want to delete this?");
    //const username = window.localStorage.getItem('username') || "Unknown"; // Default if username is missing
    const username = user.username;
    // console.log("Deleted by: ", username);

    if (!confirmDelete) return;

    RTIPrfmGService.deleteRtiG(
      id,
      username,
      (response) => {
        //
        // console.log("Delete Response:", response); // Debugging
        if (response.status === 200 && response.data.success) {
          //alert(response.data.message); // Success feedback
          setMessage(response.data.message);
          setReload(!reload); // Trigger UI refresh
        }
      },
      (error) => {
        console.error("Delete Error:", error); // Debuggingc
        if (error.response && error.response.status === 404) {
          alert("Application not found.");
        } else {
          alert("An error occurred while deleting the application.");
        }
      },
    );
  };

  const handleEditRtiPrfmG = (rtiG) => {
    console.log("rti going for Edit: ", rtiG);
    navigate(`/rtiproformaGentry`, { state: { rtiG } }); // Use navigate instead of Navigate component
  };

  return (
    <div className="d-flex justify-content-center m-3">
      <Card className="mb-3" style={{ width: "100%" }}>
        {message && (
          <Alert variant="success" className="m-3" style={{ height: "40px", textAlign: "left" }}>
            {message}{" "}
          </Alert>
        )}

        {error?.message && (
          <Alert variant="danger" style={{ height: "40px" }}>
            {error.message}{" "}
          </Alert>
        )}
        <Card.Header style={{ backgroundColor: "#00458b", color: "white" }}>
          {" "}
          <div className="text-center">
            <h5>Register-II Edit/Delete</h5>
            <h3 className="card-header-text">Register of First Appeals maintained by the 1st Appealate Authority</h3>
          </div>
        </Card.Header>
        <Card.Body style={{ overflowX: "auto" }}>
          <Card.Text>
            <div style={{ width: "100%", overflowX: "auto" }}>
              <Table bordered style={{ width: "100%", tableLayout: "fixed" }} size="sm" className="rti-table">
                {/* <thead className="custom-Tableheader"> */}
                <thead>
                  <tr>
                    <th rowSpan="2" style={cellStyle} align="center" width="3%">
                      Sl No.
                    </th>
                    <th rowSpan="2" style={cellStyle} align="center" width="5%">
                      Appeal No & Date
                    </th>
                    <th rowSpan="2" style={cellStyle} align="center" width="10%">
                      Name of Appellant & Address
                    </th>
                    <th rowSpan="2" style={cellStyle} align="center" width="8%">
                      Date of Receipt of Appeal by Appellate Authority
                    </th>
                    <th rowSpan="2" style={cellStyle} align="center" width="10%">
                      Name & Designation of PIO against whose decision Appeal No. & Date
                    </th>
                    <th rowSpan="2" style={cellStyle} align="center" width="10%">
                      Name & Designation of Appellate Authority
                    </th>
                    <th colSpan="3" style={cellStyle} align="center" width="15%">
                      Decision by 1st Appellate Authority
                    </th>
                    <th rowSpan="2" style={cellStyle} align="center" width="5%">
                      Whether 2nd Appeal made u/s 19 (3)
                    </th>
                    <th rowSpan="2" style={cellStyle} align="center" width="5%">
                      Charges collected for furnishing information
                    </th>
                    <th rowSpan="2" style={cellStyle} align="center" width="10%">
                      Any other information
                    </th>
                    <th rowSpan="2" style={cellStyle} align="center" width="3%">
                      Office Address
                    </th>
                    <th rowSpan="2" style={cellStyle} align="center" width="4%">
                      Edit
                    </th>
                    <th rowSpan="2" style={cellStyle} align="center" width="4%">
                      Delete
                    </th>
                  </tr>
                  <tr>
                    <th style={cellStyle} align="center" width="20%">
                      Date
                    </th>
                    <th style={cellStyle} align="center" width="40%">
                      Allowed
                    </th>
                    <th style={cellStyle} align="center" width="40%">
                      Rejected u/s 8,9,11 & 24
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rtiLists.map((r, index) => (
                    <tr key={index}>
                      <td style={cellStyle}>{index + 1}</td>
                      <td style={{ display: "none" }}>{r.proGId}</td>
                      <td style={cellStyle}>
                        {r.appealNum} & {new Date(r.appealDate).toLocaleDateString("en-GB")}{" "}
                      </td>
                      <td style={cellStyle}>
                        {r.nameOfAppellant} - {r.appellantAddress}
                      </td>
                      <td style={cellStyle}>{new Date(r.appealReceiptDate).toLocaleDateString("en-GB")} </td>
                      <td style={cellStyle}>
                        {r.pioName} & {r.pioDesignation} - {r.appnNum} & {new Date(r.appnDate).toLocaleDateString("en-GB")}{" "}
                      </td>
                      <td style={cellStyle}>
                        {r.appellateAuthorityName} & {r.appellateAuthorityAddre}
                      </td>
                      <td style={cellStyle}>
                        {r.appellateFirstDecisionDate && !isNaN(new Date(r.appellateFirstDecisionDate)) ? new Date(r.appellateFirstDecisionDate).toLocaleDateString("en-GB") : "-"}
                      </td>
                      <td style={cellStyle}>{r.appellateFirstDecisionAllowRejec === 1 ? "Allowed" : r.appellateFirstDecisionAllowRejec === 2 ? "Rejected" : "N/A"}</td>
                      {/* <td style={cellStyle}>{r.rtiRejSecName}</td> */}
                      <td style={cellStyle}>{r.rtiRejectionSection}</td>
                      <td style={cellStyle}>{r.secondAppealMade}</td>
                      <td style={cellStyle}>{r.chargeForInfo}</td>
                      <td style={cellStyle}>{r.remarks}</td>
                      <td style={cellStyle}>{r.unit_id}</td>
                      <td style={cellStyle}>
                        <Button onClick={() => handleEditRtiPrfmG(r)}>Edit</Button>
                      </td>
                      <td style={cellStyle}>
                        <Button variant="danger" onClick={() => handleDelete(r.proGId)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}
