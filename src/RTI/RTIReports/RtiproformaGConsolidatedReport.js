import React, { useEffect, useState } from "react";
import { Card, Alert } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import RTIYearQuarterComponent from "../RTIComponents/RTIYearQuarterComponent";
import { calculateTotals } from "../RTIUtils/PrfmGTotalsCalculatorUtil";
import RtiPrfmGConsolidatedReportTableHeader from "../RTIComponents/RtiPrfmGConsolidatedReportTableHeader";
import UserService from "../../services/UserService";
import RTIPrfmGService from "../../services/RTIPrfmGService";
import PrintableComponents from "../../components/PrintableComponents";
import ExportToExcel from "../RTIComponents/ExportToExcel";
import { useUserDetails } from "../../components/UserDetailsContext";

export default function RtiproformaGConsolidatedReport() {
  const [rtiLists, setRtiLists] = useState([]);
  const totals = calculateTotals(rtiLists);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize the navigate hook
  const [year, setYear] = useState(null);
  const [quarter, setQuarter] = useState(null);
  const [formId, setFormId] = useState(null);
  const [circles, setCircles] = useState([]); // Store fetched circles
  const [divisions, setDivisions] = useState([]); // Store fetched divisions
  const [message, setMessage] = useState(null);
  const { user } = useUserDetails();

  useEffect(() => {
    //console.log("useEffect triggered!", { reload, formId });

    if (formId === "rtiUnitConsolidatedG") {
      setLoading(true);
      //console.log("User Details Retrieved:", user);
      const { unitId, circleId, designationId } = user;
      //  console.log("Unit ID:", unitId, "Circle ID:", circleId, "Designation:", designationId);
      UserService.getCirclesByUnitId(
        unitId,
        (circlesData) => {
          //    console.log("Circles API Response:", circlesData);

          if (!Array.isArray(circlesData)) {
            console.error("Unexpected circlesData format:", circlesData);
            return;
          }

          UserService.getDivisionsByCircleId(
            circleId,
            (divisionsData) => {
              //  console.log("Divisions Retrieved:", divisionsData);
              setDivisions(divisionsData);
              const requestData = {
                year,
                quarter,
                user: user,
                circles: circlesData.map((circle) => ({
                  id: circle.circleId, // Ensure correct field name
                  name: circle.circleName, // Ensure correct field name
                })),
              };
              if (unitId !== 4) {
                if (designationId === 12 || designationId === 9 || designationId === 10) {
                  navigate("/circle-proformaG", { state: { year, quarter, formId: "rtiCircleConsReportG" } });
                  return;
                } else if (designationId === 7 || designationId === 5) {
                  navigate("/division-proformaG", { state: { year, quarter, formId: "rtiDivisionConsReportG" } });
                  return;
                }
              }

              // console.log("Final requestData sent to backend:", JSON.stringify(requestData, null, 2));

              RTIPrfmGService.fetchRtiPrfmGUnitConsolidated(
                requestData,
                (data) => {
                  //  console.log("Response received from backend:", data);
                  setRtiLists(data);
                  setLoading(false);
                },
                (error) => {
                  console.error("Error fetching report:", error);
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
  }, [reload, formId]);

  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redirect if no user session
    }
  }, []);

  const cellStyle = {
    textAlign: "center",
    border: "1px solid grey",
    wordWrap: "break-word",
  };

  const handleFormSubmit = (year, quarter, formId) => {
    setYear(year);
    setQuarter(quarter);
    setFormId(formId);
    setReload((prev) => !prev); // Toggle reload to trigger useEffect
  };

  const handleUnitClick = (selectedUnitId) => {
    try {
      //  console.log("selectedUnit ID:", selectedUnitId);

      UserService.getCirclesByUnitId(
        selectedUnitId,
        (circlesData) => {
          //  console.log("Cons G report Circles Retrieved:", circlesData);

          if (!Array.isArray(circlesData)) {
            console.error("Unexpected G circlesData format:", circlesData);
            return;
          }
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
          };

          //  console.log("Request Data:", requestData);

          navigate("/circle-proformaG", {
            state: {
              year,
              quarter,
              selectedUnitId: selectedUnitId,
              formId: "rtiCircleConsReportG",
              requestData,
            },
          });
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
            <h6>Consolidated Statement on the 1st Appeals received and disposed off under the R.T.I Act-2005 - Department: Irrigation & CADD</h6>
          </div>
        </Card.Header>
        <Card.Body style={{ overflowX: "auto" }}>
          <Card.Text>
            <div style={{ width: "100%", overflowX: "auto" }}>
              <div className="mb-1">
                <RTIYearQuarterComponent
                  actionUrl="/submitForm"
                  onSubmit={handleFormSubmit} // Call the function that sets state and triggers reload
                  formId="rtiUnitConsolidatedG"
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
                    {rtiLists.map((r, index) => (
                      <tr key={index}>
                        <td className="custom-tableCell">{index + 1}</td>
                        <td style={{ display: "none" }}>{r.unitId}</td>
                        <td
                          className="custom-tableCell"
                          style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                          onClick={() => handleUnitClick(r.unitId)} // Call the handler with unitId
                        >
                          {r.unitName}
                        </td>

                        <td className="custom-tableCell"></td>
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
