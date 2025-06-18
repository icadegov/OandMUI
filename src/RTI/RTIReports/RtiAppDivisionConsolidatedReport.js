import React, { useEffect, useState } from "react";
import { Card, Alert } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { useLocation, useNavigate } from "react-router-dom";
import RTIYearQuarterComponent from "../RTIComponents/RTIYearQuarterComponent";
import { calculateTotals } from "../RTIUtils/PrfmGTotalsCalculatorUtil";
import RtiAppConsolidatedReportTableHeader from "../RTIComponents/RtiAppConsolidatedReportTableHeader";
import RTIPrfmCService from "../../services/RTIPrfmCService";
import UserService from "../../services/UserService";
import PrintableComponents from "../../components/PrintableComponents";
import ExportToExcel from "../RTIComponents/ExportToExcel";
import { useUserDetails } from "../../components/UserDetailsContext";

export default function RtiAppDivisionConsolidatedReport() {
  const [rtiLists, setRtiLists] = useState([]);
  const totals = calculateTotals(rtiLists);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false); // State to trigger re-fetching
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize the navigate hook
  const [year, setYear] = useState(null);
  const [quarter, setQuarter] = useState(null);
  const [formId, setFormId] = useState(null);

  const [selectedCircleId, setSelectedCircleId] = useState(null); // Selected Unit ID
  const [circleId, setCircleId] = useState([]); // Store fetched circles
  const [unitId, setUnitId] = useState([]); //
  const [divisions, setDivisions] = useState([]); // Store fetched divisions

  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const { user } = useUserDetails();

  const location = useLocation();
  const [message, setMessage] = useState(location.state?.message || "");

  useEffect(() => {
    if (location.state) {
      setYear(location.state.year || null);
      setQuarter(location.state.quarter || null);
      setFormId(location.state.formId || null);
      setSelectedCircleId(location.state.selectedCircleId || null);
      setSelectedUnitId(location.state.selectedUnitId || null);
    }
  }, [location.state]);

  console.log("Location State in division:", location.state); // Log the state when component mounts
  // Extract user details

  useEffect(() => {
    // console.log("Fetching Data with:", { year, quarter, formId });
    const { designationId } = user;
    //console.log("Designation:", designationId);
    if (formId === "rtiDivisionConsReportC" && year !== null && quarter !== null) {
      setLoading(true);
      if (selectedUnitId === null) {
        setUnitId(user.unitId);
        //  console.log("Unit ID:", unitId, "Designation:", designationId);
      } else {
        //  console.log("selectedUnitId ID:", selectedUnitId, "Designation:", designationId);
        setUnitId(selectedUnitId);
        //  console.log("selectedUnitId ID2:", unitId);
      }
      if (selectedCircleId === null) {
        const { circleId } = user;
        //  console.log("Unit ID:", unitId, "Circle ID:", circleId, "Designation:", designationId);
      } else {
        // console.log("Unit ID2:", unitId, "selectedCircleId ID:", selectedCircleId, "Designation:", designationId);
        setCircleId(selectedCircleId);
        //  console.log("selectedCircleId ID2:", circleId);
      }

      const unitIdToUse = selectedUnitId ?? user.unitId;

      if (!unitIdToUse) {
        console.error("Unit ID is null, skipping API call");
        return;
      }
      UserService.getCirclesByUnitId(
        unitIdToUse,
        (circlesData) => {
          // console.log("Circles API Response:", circlesData);

          if (!Array.isArray(circlesData)) {
            console.error("Unexpected circlesData format:", circlesData);
            return;
          }
          setCircleId(circlesData); // Store the circles data
          const circleIdToUse = selectedCircleId ?? user.circleId;

          if (!circleIdToUse) {
            console.error("Circle ID is null, skipping API call");
            return;
          }

          UserService.getDivisionsByCircleId(
            circleIdToUse,
            (divisionsData) => {
              setDivisions(divisionsData);
              const requestData = {
                year,
                quarter,
                user: user,
                selectedUnitId,
                selectedCircleId,
                circles: circlesData.map((circle) => ({
                  circleId: circle.circleId, // Ensure correct field name
                  circleName: circle.circleName, // Ensure correct field name
                })),
                divisions: divisionsData.map((division) => ({
                  divisionId: division.divisionId,
                  divisionName: division.divisionName, // Ensure correct field name
                })),
              };

              //  console.log("Final requestData:", JSON.stringify(requestData, null, 2));
              RTIPrfmCService.fetchRtiCYrQtrDivisionConsolidatedReport(
                requestData,
                (data) => {
                  // console.log("Response received:", data);
                  setRtiLists(data);
                  setLoading(false);
                },
                (error) => {
                  console.error("Error fetching data:", error);
                  setError(error);
                  setLoading(false);
                },
              );
            },
            (error) => {
              console.error("Error fetching divisions:", error);
              setError(error);
              setLoading(false);
            },
          );
        },
        (error) => {
          console.error("Error fetching circles:", error);
          setError(error);
          setLoading(false);
        },
      );
    }
  }, [reload, year, quarter, formId]);

  // Extend the totals with the extra column
  const extendedTotals = {
    ...totals,
    totalDeemedRefused: rtiLists.reduce((sum, r) => sum + (r.deemrefus || 0), 0),
    totalDoubTotAmt: rtiLists.reduce((sum, r) => sum + (r.totAmt || 0), 0),
  };
  const cellStyle = {
    color: "black",
    textAlign: "center",
    border: "1px solid grey",
    wordWrap: "break-word",
  };

  const handleFormSubmit = (year, quarter, formId) => {
    setYear(year);
    setQuarter(quarter);
    setFormId(formId);
    setReload((prev) => !prev);
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
            <h3 className="card-header-text">Annexure-III(proforma-C)</h3>
            <h6>Consolidated Statement on the applications received and disposed of under the R.T.I Act-2005 ,Department: Irrigation & CADD </h6>
          </div>
        </Card.Header>
        <Card.Body style={{ overflowX: "auto" }}>
          <Card.Text>
            <div style={{ width: "100%", overflowX: "auto" }}>
              <div className="mb-1">
                <RTIYearQuarterComponent
                  actionUrl="/submitForm"
                  onSubmit={handleFormSubmit} // Call the function that sets state and triggers reload
                  formId="rtiDivisionConsReportC"
                />{" "}
              </div>
              <div className="mb-1 text-center" style={{ color: "red", fontStyle: "italic" }}>
                {year && quarter && (
                  <p>
                    RTI Application (Proforma C) report for Year {year} and Quarter {quarter}
                  </p>
                )}{" "}
              </div>
              <div className="col-md-12 d-flex justify-content-center">
                <div className="me-2">
                  <PrintableComponents
                    data="printTable"
                    type="html"
                    header={`RTI Application Division Consolidated Report ${year ? parseInt(year) : ""}${quarter ? "-" + parseInt(quarter) : ""}`}
                  ></PrintableComponents>
                </div>
                <div>
                  <ExportToExcel tableId="printTable" filename="RTIProformaC.xlsx" sheetName="RTIProformaC" buttonLabel="Download Excel" />
                </div>
              </div>
              <div id="printTable">
                <Table striped bordered hover className="rti-table">
                  <RtiAppConsolidatedReportTableHeader cellStyle={cellStyle} />
                  <tbody>
                    {rtiLists.map((r, index) => (
                      <tr key={index}>
                        <td className="custom-tableCell">{index + 1}</td>
                        <td style={{ display: "none" }}>{r.unitId}</td>
                        <td className="custom-tableCell"> {r.divisionName}</td>

                        <td className="custom-tableCell"> </td>
                        <td className="custom-tableCell">{r.qpending}</td>
                        <td className="custom-tableCell">{r.totapp} </td>
                        {/* Calculate the sum and display it */}
                        <td className="custom-tableCell">{Number(r.totapp) + Number(r.qpending)}</td>
                        <td className="custom-tableCell">{r.totdispo} </td>
                        <td className="custom-tableCell">{r.totPending} </td>
                        <td className="custom-tableCell">{r.infor}</td>
                        <td className="custom-tableCell">{r.deemrefus}</td>
                        <td className="custom-tableCell">{r.rej6}</td>
                        <td className="custom-tableCell">{r.rs1}</td>
                        <td className="custom-tableCell">{r.rs2}</td>
                        <td className="custom-tableCell">{r.rs3}</td>
                        <td className="custom-tableCell">{r.rs4}</td>
                        <td className="custom-tableCell">{r.rs5}</td>
                        <td className="custom-tableCell">{r.rs6}</td>
                        <td className="custom-tableCell">{r.rs7}</td>
                        <td className="custom-tableCell">{r.rs8}</td>
                        <td className="custom-tableCell">{r.rs9}</td>
                        <td className="custom-tableCell">{r.rs10}</td>
                        <td className="custom-tableCell">{r.rs11}</td>
                        <td className="custom-tableCell">{r.rs12}</td>
                        <td className="custom-tableCell">{r.rs13}</td>
                        <td className="custom-tableCell">{r.rs15}</td>
                        <td className="custom-tableCell">{r.totAmt}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={3} className="custom-tableTotalCell">
                        <b>TOTAL</b>
                      </td>
                      <td className="custom-tableTotalCell">
                        <b>{totals.totalQpending}</b>
                      </td>
                      <td className="custom-tableTotalCell">
                        <b>{totals.totalApp}</b>
                      </td>
                      <td className="custom-tableTotalCell">
                        <b>{totals.totalToDispose}</b>
                      </td>
                      <td className="custom-tableTotalCell">
                        <b>{totals.totalDispo}</b>
                      </td>
                      <td className="custom-tableTotalCell">
                        <b>{totals.totalPending}</b>
                      </td>
                      <td className="custom-tableTotalCell">
                        <b>{totals.totalInfo}</b>
                      </td>
                      <td className="custom-tableTotalCell">
                        <b>{extendedTotals.totalDeemedRefused}</b>
                      </td>
                      <td className="custom-tableTotalCell">
                        <b>{totals.totalRej6}</b>
                      </td>
                      <td className="custom-tableTotalCell">
                        <b>{totals.totalRs1}</b>
                      </td>
                      <td className="custom-tableTotalCell">
                        <b>{totals.totalRs2}</b>
                      </td>
                      <td className="custom-tableTotalCell">
                        <b>{totals.totalRs3}</b>
                      </td>
                      <td className="custom-tableTotalCell">
                        <b>{totals.totalRs4}</b>
                      </td>
                      <td className="custom-tableTotalCell">
                        <b>{totals.totalRs5}</b>
                      </td>
                      <td className="custom-tableTotalCell">
                        <b>{totals.totalRs6}</b>
                      </td>
                      <td className="custom-tableTotalCell">
                        <b>{totals.totalRs7}</b>
                      </td>
                      <td className="custom-tableTotalCell">
                        <b>{totals.totalRs8}</b>
                      </td>
                      <td className="custom-tableTotalCell">
                        <b>{totals.totalRs9}</b>
                      </td>
                      <td className="custom-tableTotalCell">
                        <b>{totals.totalRs10}</b>
                      </td>
                      <td className="custom-tableTotalCell">
                        <b>{totals.totalRs11}</b>
                      </td>
                      <td className="custom-tableTotalCell">
                        <b>{totals.totalRs12}</b>
                      </td>
                      <td className="custom-tableTotalCell">
                        <b>{totals.totalRs13}</b>
                      </td>
                      <td className="custom-tableTotalCell">
                        <b>{totals.totalRs15}</b>
                      </td>
                      <td className="custom-tableTotalCell">
                        <b>{extendedTotals.totalDoubTotAmt}</b>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}
