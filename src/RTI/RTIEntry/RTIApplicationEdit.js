import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Alert } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { useLocation, useNavigate } from "react-router-dom";
import RTIPrfmCService from "../../services/RTIPrfmCService";
import { useUserDetails } from "../../components/UserDetailsContext";
import PrintableComponents from "../../components/PrintableComponents";
import ExportToExcel from "../RTIComponents/ExportToExcel";

export default function RTIApplicationEdit() {
  const [rtiLists, setRtiLists] = useState([]);
  const [reload, setReload] = useState(false); // State to trigger re-fetching
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [message, setMessage] = useState(location.state?.message || "");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useUserDetails();

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
    setLoading(true);
    if (user && Object.keys(user).length > 0) {
      // Ensure userDetails is not empty
      setLoading(true);
      RTIPrfmCService.getRtiCEditList(
        user,
        (response) => {
          setRtiLists(response); // Assuming the response data is directly usable
          setLoading(false); // Stop loading when data is received
        },
        (error) => {
          console.error("Error fetching  RTI C Edit data List:", error);
          setLoading(false); // Stop loading on error
        },
      );
    } else {
      console.warn("User details are missing or invalid.");
      setLoading(false); // Stop loading if user details are not found
    }
  }, [reload]);

  const handleDelete = (id) => {
    console.log("rti going for delete: ", id);
    const confirmDelete = window.confirm("Do you really want to delete this?");
    const username = user.username;
    console.log("Deleted by: ", username);
    if (!confirmDelete) return;

    RTIPrfmCService.deleteRtiCEntry(
      id,
      username,
      (response) => {
        if (response.status === 200 && response.data.success) {
          alert(response.data.message); // Success feedback
          setMessage(response.data.message);
          setReload(!reload); // Trigger UI refresh
        }
      },
      (error) => {
        if (error.response && error.response.status === 404) {
          alert("Application not found.");
        } else {
          alert("An error occurred while deleting the application.");
        }
      },
    );
  };
  const handleEditRtiApp = (rti) => {
    console.log("rti going for Edit: ", rti);
    navigate(`/rtiapp`, { state: { rti } });
  };

  const cellStyle = {
    border: "2px solid #D3D3D3",
    textAlign: "center",
    wordWrap: "break-word",
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
            <h5>RTI Application Edit/Delete</h5>
            <h3 className="card-header-text">Annexure-II : Register-I : Register of Applications received and disposed of under RTI Act by the public Information Officer (Maintained by P.I.O)</h3>
          </div>
        </Card.Header>
        <Card.Body>
          <Card.Text>
            <div className="col-md-12 d-flex justify-content-center">
              <div className="me-2">
                <PrintableComponents data="printTable" type="html" header={`RTI Application Edit/Delete`}></PrintableComponents>
              </div>
              <div>
                <ExportToExcel tableId="printTable" filename="RTIApplicationEditDelete.xlsx" />
              </div>
            </div>

            <div className="scroll-container" id="printTable">
              <Table bordered striped style={{ width: "130%", tableLayout: "fixed" }} size="sm" className="rti-table">
                <thead>
                  <tr ref={row1Ref}>
                    <th className="sticky-header" style={{ top: 0, position: "sticky" }} rowSpan={3} width="1%">
                      Sl No.
                    </th>
                    <th className="sticky-header" style={{ top: 0, position: "sticky" }} colSpan={2} width="6%">
                      Application
                    </th>
                    <th className="sticky-header" style={{ top: 0, position: "sticky" }} colSpan={2} width="10%">
                      Applicant
                    </th>
                    <th className="sticky-header" style={{ top: 0, position: "sticky" }} rowSpan={3} width="4%">
                      Date of receipt by APIO / PIO
                    </th>
                    <th className="sticky-header" style={{ top: 0, position: "sticky" }} rowSpan={3}>
                      Category of Applicant BPL / Other
                    </th>
                    <th className="sticky-header" style={{ top: 0, position: "sticky" }} rowSpan={3} width="15%">
                      Brief description of request for information
                    </th>
                    <th className="sticky-header" style={{ top: 0, position: "sticky" }} rowSpan={3}>
                      Involving Third party information or not
                    </th>
                    <th className="sticky-header" style={{ top: 0, position: "sticky" }} colSpan={5} width="15%">
                      Transmitted to other PIO under sec 6(3)
                    </th>
                    <th className="sticky-header" style={{ top: 0, position: "sticky" }} rowSpan={3}>
                      Deemed PIO name
                    </th>
                    <th className="sticky-header" style={{ top: 0, position: "sticky" }} rowSpan={3}>
                      Amount for application fees paid
                    </th>
                    <th className="sticky-header" style={{ top: 0, position: "sticky" }} rowSpan={3}>
                      Charges collected for furnishing of information
                    </th>
                    <th className="sticky-header" style={{ top: 0, position: "sticky" }} rowSpan={3}>
                      Total amount collected (Col. 8C + Col. 9)
                    </th>
                    <th className="sticky-header" style={{ top: 0, position: "sticky" }} colSpan={2}>
                      Information furnished
                    </th>
                    <th className="sticky-header" style={{ top: 0, position: "sticky" }} rowSpan={3}>
                      Date of rejection
                    </th>
                    <th className="sticky-header" style={{ top: 0, position: "sticky" }} rowSpan={3} width="4%">
                      Sections under 8, 9, 11, 24 which information Rejected
                    </th>
                    <th className="sticky-header" style={{ top: 0, position: "sticky" }} rowSpan={3} width="4%">
                      Date of Refusal
                    </th>
                    <th className="sticky-header" style={{ top: 0, position: "sticky" }} rowSpan={3} width="4%">
                      Deemed Refusal u/s 7(2) / 18(1)
                    </th>
                    <th className="sticky-header" style={{ top: 0, position: "sticky" }} rowSpan={3}>
                      Whether Appeal made against decision of PIO u/s 19 (1) & 19 (3)
                    </th>
                    <th className="sticky-header" style={{ top: 0, position: "sticky" }} rowSpan={3} width="5%">
                      Any other information
                    </th>
                    <th className="sticky-header" style={{ top: 0, position: "sticky" }} rowSpan={3} width="3%">
                      Edit
                    </th>
                    <th className="sticky-header" style={{ top: 0, position: "sticky" }} rowSpan={3} width="3%">
                      Delete
                    </th>
                  </tr>
                  <tr ref={row2Ref}>
                    <th className="sticky-header" style={{ top: rowHeights.row1, position: "sticky" }} rowSpan={2}>
                      No.
                    </th>
                    <th className="sticky-header" style={{ top: rowHeights.row1, position: "sticky" }} rowSpan={2}>
                      Date
                    </th>
                    <th className="sticky-header" style={{ top: rowHeights.row1, position: "sticky" }} rowSpan={2}>
                      Name
                    </th>
                    <th className="sticky-header" style={{ top: rowHeights.row1, position: "sticky" }} rowSpan={2}>
                      Address
                    </th>
                    <th className="sticky-header" style={{ top: rowHeights.row1, position: "sticky" }} rowSpan={2}>
                      Transmitted for
                    </th>
                    <th className="sticky-header" style={{ top: rowHeights.row1, position: "sticky" }} rowSpan={2} width="4%">
                      Date
                    </th>
                    <th className="sticky-header" style={{ top: rowHeights.row1, position: "sticky" }} rowSpan={2}>
                      PIO & Office
                    </th>
                    <th className="sticky-header" style={{ top: rowHeights.row1, position: "sticky" }} colSpan={2}>
                      Amount
                    </th>
                    <th className="sticky-header" style={{ top: rowHeights.row1, position: "sticky" }} rowSpan={2}>
                      Date
                    </th>
                    <th className="sticky-header" style={{ top: rowHeights.row1, position: "sticky" }} rowSpan={2}>
                      Part/Full
                    </th>
                  </tr>
                  <tr ref={row3Ref}>
                    <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2, position: "sticky" }}>
                      Court fee or DD/IPO No.
                    </th>
                    <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2, position: "sticky" }}>
                      Rs.
                    </th>
                  </tr>
                  <tr>
                    <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }} width="10%">
                      1
                    </th>
                    <th colSpan={2} className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>
                      2
                    </th>
                    <th colSpan={2} className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>
                      3
                    </th>
                    <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>
                      4
                    </th>
                    <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>
                      5
                    </th>
                    <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>
                      6
                    </th>
                    <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>
                      7
                    </th>
                    <th className="sticky-header" colSpan={5} style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>
                      8A
                    </th>
                    <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>
                      8B
                    </th>
                    <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>
                      8C
                    </th>
                    <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>
                      9
                    </th>
                    <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>
                      10
                    </th>
                    <th className="sticky-header" colSpan={2} style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>
                      11
                    </th>
                    <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>
                      12
                    </th>
                    <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>
                      13
                    </th>
                    <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>
                      14
                    </th>
                    <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>
                      15
                    </th>
                    <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>
                      16
                    </th>
                    <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>
                      17
                    </th>
                    <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>
                      18
                    </th>
                    <th className="sticky-header" style={{ top: rowHeights.row1 + rowHeights.row2 + rowHeights.row3, position: "sticky" }}>
                      19
                    </th>
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
                      <td style={cellStyle}>
                        {rtiList.isTransferred?.toLowerCase() === "yes" ? (
                          <Button variant="secondary" size="sm" disabled>
                            Edit
                          </Button>
                        ) : (
                          <Button variant="warning" size="sm" onClick={() => handleEditRtiApp(rtiList)}>
                            Edit
                          </Button>
                        )}
                      </td>
                      {/* <td style={cellStyle}>
                        <Button onClick={() => handleEditRtiApp(rtiList)}>Edit</Button>
                      </td> */}
                      <td style={cellStyle}>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(rtiList.applicationId)}>
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
