import React, { useEffect, useState } from "react";
import { Alert, Card } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import RTIPrfmGService from "../../services/RTIPrfmGService";
import RTIYearQuarterComponent from "../RTIComponents/RTIYearQuarterComponent";
import { useUserDetails } from "../../components/UserDetailsContext";
import PrintableComponents from "../../components/PrintableComponents";
import ExportToExcel from "../RTIComponents/ExportToExcel";

export default function RtiproformaGDataReport() {
  const [rtiLists, setRtiLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false); // State to trigger re-fetching
  const [error, setError] = useState(null);
  const [message, setMessage] = useState();
  const navigate = useNavigate(); // Initialize the navigate hook
  const [year, setYear] = useState(null);
  const [quarter, setQuarter] = useState(null);
  const [formId, setFormId] = useState(null);
  const { user } = useUserDetails();
  //console.log("userDetails", user);

  useEffect(() => {
    const requestData = {
      year,
      quarter,
      user: user, // Include userDetails in the request
    };
    // console.log("Fetching data with request:", requestData);
    RTIPrfmGService.fetchRtiGYrQtrEEReport(
      requestData,
      (data) => {
        //  console.log("Data received:", data);
        setRtiLists(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching data:", error);
        setError(error);
        setLoading(false);
      },
    );
  }, [reload, formId]);
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

  const handleFormSubmit = (year, quarter, formId) => {
    setYear(year);
    setQuarter(quarter);
    setFormId(formId);
    setReload((prev) => !prev); // Toggle reload to trigger useEffect
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

        <Card.Header style={{ backgroundColor: "#00458b", color: "white" }} as="h5">
          Annexure-II Register-I Register of Applications received and disposed of under RTI Act by the public Information Officer (Maintained by P.I.O)
        </Card.Header>
        <Card.Body>
          <RTIYearQuarterComponent
            actionUrl="/submitForm"
            onSubmit={handleFormSubmit} // Call the function that sets state and triggers reload
            formId="getRtiEEReportG"
            includeAllOption={true}
          />
          <Card.Text>
            <div className="col-md-12 d-flex justify-content-center">
              <div className="me-2">
                <PrintableComponents data="printTable" type="html" header={`RTI Proforma G ${year ? parseInt(year) : ""}${quarter ? "-" + parseInt(quarter) : ""}`}></PrintableComponents>
              </div>
              <div>
                <ExportToExcel tableId="printTable" filename="RTI Appeal Data Report.xlsx" sheetName="RTI Appeal Data Report" buttonLabel="Download Excel" />
              </div>
            </div>

            <div style={{ width: "100%", overflowX: "auto" }} id="printTable">
              {/* <Table bordered className="custom-table" > */}
              <Table striped bordered hover className="rti-table">
                <thead>
                  <tr>
                    <th rowSpan="2" style={cellStyle} align="center" width="3%">
                      Sl No.
                    </th>
                    <th rowSpan="2" style={cellStyle} align="center" width="5%">
                      Appeal No & Date
                    </th>
                    <th rowSpan="2" style={cellStyle} align="center" width="13%">
                      Name of Appellant & Address
                    </th>
                    <th rowSpan="2" style={cellStyle} align="center" width="10%">
                      Date of Receipt of Appeal by Appellate Authority
                    </th>
                    <th rowSpan="2" style={cellStyle} align="center" width="10%">
                      Name & Designation of PIO against whose decision Appeal No. & Date
                    </th>
                    <th rowSpan="2" style={cellStyle} align="center" width="10%">
                      Name & Designation of Appellate Authority
                    </th>
                    <th colSpan="3" style={cellStyle} align="center" width="25%">
                      Decision by 1st Appellate Authority
                    </th>
                    <th rowSpan="2" style={cellStyle} align="center" width="8%">
                      Whether 2nd Appeal made u/s 19 (3)
                    </th>
                    <th rowSpan="2" style={cellStyle} align="center" width="8%">
                      Charges collected for furnishing information
                    </th>
                    <th rowSpan="2" style={cellStyle} align="center" width="13%">
                      Any other information
                    </th>
                    <th rowSpan="2" style={cellStyle} align="center" width="13%">
                      Office Address
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
                      <td style={cellStyle}>
                        {r.appellateFirstDecisionAllowRejec !== null ? (r.appellateFirstDecisionAllowRejec === 1 ? "Allowed" : "Rejected") : r.appellateFirstDecisionAllowOrRejec || "N/A"}
                      </td>
                      {/* <td style={cellStyle}>{r.rtiRejSecName}</td> */}
                      <td style={cellStyle}>{r.rtiRejectionSection}</td>
                      <td style={cellStyle}>{r.secondAppealMade}</td>
                      <td style={cellStyle}>{r.chargeForInfo}</td>
                      <td style={cellStyle}>{r.remarks}</td>
                      <td style={cellStyle}>{r.unitName}</td>
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
