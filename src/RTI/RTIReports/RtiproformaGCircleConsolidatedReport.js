import React, { useEffect, useState } from "react";
import { Card, Alert } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { useLocation, useNavigate } from "react-router-dom";
import RtiPrfmGConsolidatedReportTableHeader from "../RTIComponents/RtiPrfmGConsolidatedReportTableHeader";
import { calculateTotals } from "../RTIUtils/PrfmGTotalsCalculatorUtil";
import RTIYearQuarterComponent from "../RTIComponents/RTIYearQuarterComponent";
import UserService from "../../services/UserService";
import RTIPrfmGService from "../../services/RTIPrfmGService";
import PrintableComponents from "../../components/PrintableComponents";
import ExportToExcel from "../RTIComponents/ExportToExcel";
import { useUserDetails } from "../../components/UserDetailsContext";

export default function RtiproformaGCircleConsolidatedReport() {
  const [rtiLists, setRtiLists] = useState([]);
  const totals = calculateTotals(rtiLists);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false); // State to trigger re-fetching
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize the navigate hook
  const [year, setYear] = useState(null);
  const [quarter, setQuarter] = useState(null);
  const [formId, setFormId] = useState(null);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [unitId, setUnitId] = useState(null); // Selected Unit ID
  const [circles, setCircles] = useState([]); // Store fetched circles
  const [divisons, setDivisions] = useState([]); // Store fetched divisions

  const location = useLocation();
  const [message, setMessage] = useState(location.state?.message || "");
  const { user } = useUserDetails();

  useEffect(() => {
    // console.log("Location state in circle:", location.state); // Debugging step
    if (location.state) {
      setYear(location.state.year || null);
      setQuarter(location.state.quarter || null);
      setFormId(location.state.formId || null);
      setSelectedUnitId(location.state.selectedUnitId || null);
    }
  }, [location.state]);
  const { circleId, designationId } = user;
  useEffect(() => {
    // console.log("Fetching Data with:", { year, quarter, formId });
    if (formId === "rtiCircleConsReportG" && year !== null && quarter !== null) {
      setLoading(true);
      if (selectedUnitId === null) {
        //  console.log("Unit ID:", unitId, "Circle ID:", circleId, "Designation:", designationId);
      } else {
        // console.log("selectedUnitId ID1:", selectedUnitId);
        setUnitId(selectedUnitId);
        // console.log("selectedUnitId ID2:", unitId);
      }
      const unitIdToUse = selectedUnitId ?? user.unitId;

      if (!unitIdToUse) {
        console.error("Unit ID is null, skipping API call");
        return;
      }
      // console.log("Fetching divisions for Unit ID:", unitIdToUse);
      UserService.getCirclesByUnitId(
        unitIdToUse,
        (circlesData) => {
          //  console.log("Circles API Response:", circlesData);

          if (!Array.isArray(circlesData)) {
            console.error("Unexpected circlesData format:", circlesData);
            return;
          }

          UserService.getDivisionsByCircleId(
            circleId,
            (divisionsData) => {
              //console.log("Divisions Retrieved:", divisionsData);
              setDivisions(divisionsData);

              const requestData = {
                year,
                quarter,
                user: user,
                selectedUnitId,
                circles: circlesData.map((circle) => ({
                  circleId: circle.circleId, // Ensure correct field name
                  circleName: circle.circleName, // Ensure correct field name
                })),
                divisions: divisionsData.map((division) => ({
                  divisionId: division.divisionId,
                  divisionName: division.divisionName, // Ensure correct field name
                })),
              };

              // console.log("Final requestData:", JSON.stringify(requestData, null, 2));

              RTIPrfmGService.fetchRtiPrfmGYrQtrCircleConsolidatedReport(
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

  const cellStyle = {
    color: "black",
    textAlign: "center",
    border: "1px solid grey",
  };

  const handleFormSubmit = (year, quarter, formId) => {
    setYear(year);
    setQuarter(quarter);
    setFormId(formId);
    setReload((prev) => !prev); // Toggle reload to trigger useEffect
  };

  const handleCircleClick = (circleId) => {
    try {
      if (selectedUnitId === null) {
        const { unitId } = user;
        //  console.log("Unit ID:", user.unitId);
      } else {
        // console.log("selectedUnitId ID1:", selectedUnitId);
        setUnitId(selectedUnitId);
        // console.log("selectedUnitId ID2:", unitId);
      }
      const unitIdToUse = selectedUnitId ?? user.unitId;

      if (!unitIdToUse) {
        console.error("Unit ID is null, skipping API call");
        return;
      }
      console.log("Unit ID:", unitIdToUse, "Circle ID:", circleId);

      UserService.getCirclesByUnitId(
        unitIdToUse,
        (circlesData) => {
          // console.log("Circles Retrieved:", circlesData);

          if (!Array.isArray(circlesData)) {
            console.error("Unexpected circlesData format:", circlesData);
            return;
          }

          UserService.getDivisionsByCircleId(
            circleId,
            (divisionsData) => {
              // console.log("Divisions Retrieved:", divisionsData);

              setDivisions(divisionsData);
              setCircles(circlesData);

              const requestData = {
                year,
                quarter,
                user: user,
                // Pass the correct circleId
                circles: circlesData.map((circle) => ({
                  id: circle.circleId,
                  name: circle.circleName,
                })),
                divisions: divisionsData.map((division) => ({
                  id: division.divisionId,
                  name: division.divisionName,
                })),
              };

              // console.log("Request Data:", requestData);

              navigate("/division-proformaG", {
                state: {
                  year,
                  quarter,
                  selectedCircleId: circleId,
                  selectedUnitId: selectedUnitId,
                  formId: "rtiDivisionConsReportG",
                  requestData,
                },
              });
            },
            (error) => {
              console.error("Error fetching divisions:", error);
            },
          );
        },
        (error) => {
          console.error("Error fetching circles:", error);
        },
      );
    } catch (error) {
      console.error("Error in handleCircleClick:", error);
    }
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
            <h3 className="card-header-text">Proforma-G</h3>
            <h6>Consolidated Statement on the 1st Appeals received and disposed off under the R.T.I Act-2005, Department: Irrigation & CADD</h6>
          </div>
        </Card.Header>
        <Card.Body style={{ overflowX: "auto" }}>
          <Card.Text>
            <div style={{ width: "100%", overflowX: "auto" }}>
              <div className="mb-1">
                <RTIYearQuarterComponent
                  actionUrl="/submitForm"
                  onSubmit={handleFormSubmit} // Call the function that sets state and triggers reload
                  formId="rtiCircleConsReportG"
                />
              </div>
              <div className="mb-1 text-center" style={{ color: "red", fontStyle: "italic", paddingBottom: "0.5cm" }}>
                {year && quarter && (
                  <p>
                    RTI Appeal report for Year {year} and Quarter {quarter}
                  </p>
                )}
              </div>

              <div className="col-md-12 d-flex justify-content-center">
                <div className="me-2">
                  <PrintableComponents data="print-area" type="html" header={`RTI Proforma G ${year ? parseInt(year) : ""}${quarter ? "-" + parseInt(quarter) : ""}`}></PrintableComponents>
                </div>
                <div>
                  <ExportToExcel tableId="printTable" filename="RTIProformaG.xlsx" sheetName="RTIProformaG" buttonLabel="Download Excel" />
                </div>
              </div>
              <div className="scroll-container" id="print-area">
                <Table striped bordered hover className="rti-table" id="printTable">
                  <RtiPrfmGConsolidatedReportTableHeader />

                  <tbody>
                    {rtiLists.map(
                      (r, index) =>
                        r.circleId === 0 && (
                          <tr key={index}>
                            <td className="custom-tableCell">{index + 1}</td>
                            <td style={{ display: "none" }}>{r.circleId}</td>
                            <td className="custom-tableCell"> {r.circleName}</td>
                            <td className="custom-tableCell">
                              {" "}
                              <input type="hidden" name="circleId" id="circleId" />{" "}
                            </td>

                            <td className="custom-tableCell">{r.qpending} </td>
                            <td className="custom-tableCell">{r.totapp} </td>
                            {/* Calculate the sum and display it */}
                            <td className="custom-tableCell">{Number(r.totapp) + Number(r.qpending)}</td>
                            <td className="custom-tableCell">{r.totdispo} </td>
                            <td className="custom-tableCell">{r.totPending} </td>
                            <td className="custom-tableCell">{r.infor}</td>
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
                            <td className="custom-tableCell">{r.amount}</td>
                          </tr>
                        ),
                    )}

                    {rtiLists
                      .filter((r) => r.circleId !== 0)
                      .map((r, index) => (
                        <tr key={index}>
                          <td className="custom-tableCell">{index + 1}</td>
                          <td style={{ display: "none" }}>{r.circleId}</td>
                          <td
                            className="custom-tableCell"
                            style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                            onClick={() => handleCircleClick(r.circleId)} // Call the handler with unitId
                          >
                            {r.circleName}
                          </td>

                          <td className="custom-tableCell"> </td>
                          <td className="custom-tableCell">{r.qpending} </td>
                          <td className="custom-tableCell">{r.totapp} </td>
                          {/* Calculate the sum and display it */}
                          <td className="custom-tableCell">{Number(r.totapp) + Number(r.qpending)}</td>
                          <td className="custom-tableCell">{r.totdispo} </td>
                          <td className="custom-tableCell">{r.totPending} </td>
                          <td className="custom-tableCell">{r.infor}</td>
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
                          <td className="custom-tableCell">{r.amount}</td>
                        </tr>
                      ))}
                    <tr>
                      <td colSpan={3} className="custom-tableTotalCell">
                        <b>TOTAL</b>
                      </td>
                      <td className="custom-tableTotalCellTotalCell">
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
                        <b>{totals.totalAmount}</b>
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
