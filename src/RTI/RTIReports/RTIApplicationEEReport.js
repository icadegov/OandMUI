import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Alert } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { Navigate, useNavigate } from "react-router-dom";
import RTIPrfmCService from "../../services/RTIPrfmCService";
import RTIYearQuarterComponent from "../RTIComponents/RTIYearQuarterComponent";
import { useUserDetails } from "../../components/UserDetailsContext";
import PrintableComponents from "../../components/PrintableComponents";
import ExportToExcel from "../RTIComponents/ExportToExcel";

export default function RTIApplicationEEReport() {
  const [rtiLists, setRtiLists] = useState([]);
  const [reload, setReload] = useState(false); // State to trigger re-fetching
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState();
  const [error, setError] = useState(null);
  const [year, setYear] = useState(null);
  const [quarter, setQuarter] = useState(null);
  const [formId, setFormId] = useState(null);
  const { user } = useUserDetails();
  //console.log("userDetails", user);

  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  const row3Ref = useRef(null);
  const [rowHeights, setRowHeights] = useState({ row1: 0, row2: 0, row3: 0 });

  useEffect(() => {
    const row1Height = row1Ref.current?.getBoundingClientRect().height || 0;
    const row2Height = row2Ref.current?.getBoundingClientRect().height || 0;
    const row3Height = row3Ref.current?.getBoundingClientRect().height || 0;
    setRowHeights({ row1: row1Height, row2: row2Height, row3: row3Height });
  }, []);

  useEffect(() => {
    if (formId === "getRtiEEReportC") {
      setLoading(true);
      const requestData = {
        year,
        quarter,
        user: user, // Include userDetails in the request
      };
      RTIPrfmCService.fetchRtiCYrQtrEEReport(
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
    }
  }, [reload]);

  const cellStyle = {
    border: "2px solid #D3D3D3",
    textAlign: "center",
    wordWrap: "break-word",
  };
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
        <Card.Header style={{ backgroundColor: "#00458b", color: "white" }}>
          {" "}
          <div className="text-center">
            <h3 className="card-header-text">Annexure-II</h3>
            <h3 className="card-header-text">Register-I : Register of Applications received and disposed of under RTI Act by the public Information Officer (Maintained by P.I.O)</h3>
          </div>
        </Card.Header>
        <Card.Body>
          <RTIYearQuarterComponent
            actionUrl="/submitForm"
            onSubmit={handleFormSubmit} // Call the function that sets state and triggers reload
            formId="getRtiEEReportC"
            includeAllOption={true}
          />
          <Card.Text>
            <div className="col-md-12 d-flex justify-content-center">
              <div className="me-2">
                <PrintableComponents data="printTable" type="html" header={`RTI Application  ${year ? parseInt(year) : ""}${quarter ? "-" + parseInt(quarter) : ""}`}></PrintableComponents>
              </div>
              <div>
                <ExportToExcel tableId="printTable" filename="RTI Application Data Report.xlsx" sheetName="RTI Application Data Report" buttonLabel="Download Excel" />
              </div>
            </div>

            <div className="scroll-container" id="printTable">
              <Table bordered striped style={{ width: "130%", tableLayout: "fixed" }} size="sm" className="rti-table">
                {/* <Table striped bordered hover  className="custom-Tableheader" id="printTable" style={{ width: '130%', tableLayout: 'fixed' }} size="sm"> */}
                <thead>
                  <tr ref={row1Ref}>
                    <th rowSpan={3} style={{ top: 0, position: "sticky" }} width="1%">
                      Sl No.
                    </th>
                    <th colSpan={2} style={{ top: 0, position: "sticky" }} width="6%">
                      Application
                    </th>
                    <th colSpan={2} style={{ top: 0, position: "sticky" }} width="10%">
                      Applicant
                    </th>
                    <th rowSpan={3} style={{ top: 0, position: "sticky" }}>
                      Date of receipt by APIO / PIO
                    </th>
                    <th rowSpan={3} style={{ top: 0, position: "sticky" }}>
                      Category of Applicant BPL / Other
                    </th>
                    <th rowSpan={3} style={{ top: 0, position: "sticky" }} width="15%">
                      Brief description of request for information
                    </th>
                    <th rowSpan={3} style={{ top: 0, position: "sticky" }}>
                      Involving Third party information or not
                    </th>
                    <th colSpan={5} style={{ top: 0, position: "sticky" }}>
                      Transmitted to other PIO under sec 6(3)
                    </th>
                    <th rowSpan={3} style={{ top: 0, position: "sticky" }}>
                      Deemed PIO name
                    </th>
                    <th rowSpan={3} style={{ top: 0, position: "sticky" }}>
                      Amount for application fees paid
                    </th>
                    <th rowSpan={3} style={{ top: 0, position: "sticky" }}>
                      Charges collected for furnishing of information
                    </th>
                    <th rowSpan={3} style={{ top: 0, position: "sticky" }}>
                      Total amount collected (Col. 8C + Col. 9)
                    </th>
                    <th colSpan={2} style={{ top: 0, position: "sticky" }}>
                      Information furnished
                    </th>
                    <th rowSpan={3} style={{ top: 0, position: "sticky" }}>
                      Date of rejection
                    </th>
                    <th rowSpan={3} style={{ top: 0, position: "sticky" }} width="4%">
                      Sections under 8, 9, 11, 24 which information Rejected
                    </th>
                    <th rowSpan={3} style={{ top: 0, position: "sticky" }} width="4%">
                      Date of Refusal
                    </th>
                    <th rowSpan={3} style={{ top: 0, position: "sticky" }} width="4%">
                      Deemed Refusal u/s 7(2) / 18(1)
                    </th>
                    <th rowSpan={3} style={{ top: 0, position: "sticky" }}>
                      Whether Appeal made against decision of PIO u/s 19 (1) & 19 (3)
                    </th>
                    <th rowSpan={3} style={{ top: 0, position: "sticky" }} width="10%">
                      Any other information
                    </th>
                  </tr>
                  <tr ref={row2Ref}>
                    <th rowSpan={2} style={{ top: rowHeights.row1, position: "sticky" }}>
                      No.
                    </th>
                    <th rowSpan={2} style={{ top: rowHeights.row1, position: "sticky" }}>
                      Date
                    </th>
                    <th rowSpan={2} style={{ top: rowHeights.row1, position: "sticky" }}>
                      Name
                    </th>
                    <th rowSpan={2} style={{ top: rowHeights.row1, position: "sticky" }} width="15%">
                      Address
                    </th>
                    <th rowSpan={2} style={{ top: rowHeights.row1, position: "sticky" }}>
                      Transmitted for
                    </th>
                    <th rowSpan={2} style={{ top: rowHeights.row1, position: "sticky" }}>
                      Date
                    </th>
                    <th rowSpan={2} style={{ top: rowHeights.row1, position: "sticky" }}>
                      PIO & Office
                    </th>
                    <th colSpan={2} style={{ top: rowHeights.row1, position: "sticky" }}>
                      Amount
                    </th>
                    <th rowSpan={2} style={{ top: rowHeights.row1, position: "sticky" }}>
                      Date
                    </th>
                    <th rowSpan={2} style={{ top: rowHeights.row1, position: "sticky" }}>
                      Part/Full
                    </th>
                  </tr>
                  <tr ref={row3Ref}>
                    <th style={{ top: rowHeights.row1 + rowHeights.row2, position: "sticky" }}>Court fee or DD/IPO No.</th>
                    <th style={{ top: rowHeights.row1 + rowHeights.row2, position: "sticky" }}>Rs.</th>
                  </tr>
                  <tr>
                    <th style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }} width="10%">
                      1
                    </th>
                    <th colSpan={2} style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>
                      2
                    </th>
                    <th colSpan={2} style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>
                      3
                    </th>
                    <th style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>4</th>
                    <th style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>5</th>
                    <th style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>6</th>
                    <th style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>7</th>
                    <th colSpan={5} style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>
                      8A
                    </th>
                    <th style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>8B</th>
                    <th style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>8C</th>
                    <th style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>9</th>
                    <th style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>10</th>
                    <th colSpan={2} style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>
                      11
                    </th>
                    <th style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>12</th>
                    <th style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>13</th>
                    <th style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>14</th>
                    <th style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>15</th>
                    <th style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>16</th>
                    <th style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>17</th>
                  </tr>
                </thead>
                <tbody>
                  {rtiLists.map((rtiList, index) => (
                    <tr key={index}>
                      <td style={cellStyle}>{index + 1}</td>
                      <td style={{ display: "none" }}>{rtiList.application_id}</td>
                      <td style={cellStyle}>{rtiList.appnNum}</td>

                      <td style={cellStyle}> {new Date(rtiList.appnDate).toLocaleDateString("en-GB")}</td>

                      <td style={cellStyle}>{rtiList.apptName}</td>
                      <td style={cellStyle}>{rtiList.apptAddress}</td>
                      <td style={cellStyle}> {new Date(rtiList.pioRecDate).toLocaleDateString("en-GB")}</td>
                      {/* <td style={cellStyle}>{rtiList.piorecdate}</td> */}
                      <td style={cellStyle}>{rtiList.apptCategory}</td>
                      <td style={cellStyle}>{rtiList.descInfoReq}</td>
                      {/* <td style={cellStyle}>{rtiList.thirdParty ? 'Yes' : 'No'}</td> */}
                      <td style={cellStyle}>{rtiList.thirdParty}</td>
                      <td style={cellStyle}>{rtiList.isTransferred}</td>
                      <td style={cellStyle}> {rtiList.transDate && !isNaN(new Date(rtiList.transDate)) ? new Date(rtiList.transDate).toLocaleDateString("en-GB") : "-"} </td>
                      <td style={cellStyle}>{rtiList.transName}</td>
                      <td style={cellStyle}>{rtiList.transMode}</td>
                      <td style={cellStyle}>{rtiList.transAmt}</td>
                      <td style={cellStyle}>{rtiList.deemedPio}</td>
                      <td style={cellStyle}>{rtiList.appnFee}</td>
                      <td style={cellStyle}>{rtiList.chargesCollected}</td>
                      <td style={cellStyle}>{rtiList.totAmt}</td>
                      <td style={cellStyle}> {rtiList.infoFurnDate && !isNaN(new Date(rtiList.infoFurnDate)) ? new Date(rtiList.infoFurnDate).toLocaleDateString("en-GB") : "-"}</td>
                      {/* <td style={cellStyle}>{rtiList.infofurndate}</td> */}
                      <td style={cellStyle}>{rtiList.infoPartFull}</td>
                      <td style={cellStyle}> {rtiList.rejectDate && !isNaN(new Date(rtiList.rejectDate)) ? new Date(rtiList.rejectDate).toLocaleDateString("en-GB") : "-"}</td>
                      {/* <td style={cellStyle}>{rtiList.rejectSectionId}</td> */}
                      <td style={cellStyle}>{rtiList.rtiRejectionSection}</td>
                      <td style={cellStyle}> {rtiList.refusedDate && !isNaN(new Date(rtiList.refusedDate)) ? new Date(rtiList.refusedDate).toLocaleDateString("en-GB") : "-"}</td>

                      <td style={cellStyle}>{rtiList.deemedRefusal}</td>
                      <td style={cellStyle}>{rtiList.appealMade}</td>
                      <td style={cellStyle}>{rtiList.remarks}</td>
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
