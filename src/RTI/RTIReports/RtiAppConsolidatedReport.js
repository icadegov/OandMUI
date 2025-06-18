import React, { useEffect, useState } from "react";
import { Card, Alert } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import RTIYearQuarterComponent from "../RTIComponents/RTIYearQuarterComponent";
import { calculateTotals } from "../RTIUtils/PrfmGTotalsCalculatorUtil";
import RtiAppConsolidatedReportTableHeader from "../RTIComponents/RtiAppConsolidatedReportTableHeader";
import RTIPrfmCService from "../../services/RTIPrfmCService";
import UserService from "../../services/UserService";
import PrintableComponents from "../../components/PrintableComponents";
import ExportToExcel from "../RTIComponents/ExportToExcel";
import { useUserDetails } from "../../components/UserDetailsContext";

export default function RtiAppConsolidatedReport() {
  const [rtiLists, setRtiLists] = useState([]);
  const totals = calculateTotals(rtiLists);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false); // State to trigger re-fetching
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
    console.log("useEffect triggered!", { reload, formId });

    if (formId === "rtiunitConsReportC") {
      setLoading(true);
      //  console.log("User Details Retrieved:", user);
      const { unitId, circleId, designationId } = user;
      console.log("Unit ID:", unitId, "Circle ID:", circleId, "Designation:", designationId);
      UserService.getCirclesByUnitId(
        unitId,
        (circlesData) => {
          if (!Array.isArray(circlesData)) {
            console.error("Unexpected circlesData format:", circlesData);
            return;
          }
          UserService.getDivisionsByCircleId(
            circleId,
            (divisionsData) => {
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
                  navigate("/circle-proforma", { state: { year, quarter, formId: "rtiCircleConsReportC" } });
                  return;
                } else if (designationId === 7 || designationId === 5) {
                  navigate("/division-proforma", { state: { year, quarter, formId: "rtiDivisionConsReportC" } });
                  return;
                }
              }
              console.log("Final requestData sent to backend:", JSON.stringify(requestData, null, 2));

              RTIPrfmCService.fetchRtiCYrQtrConsolidatedReport(
                requestData,
                (data) => {
                  // console.log("Response received from backend:", data);
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
    setReload((prev) => !prev); // Toggle reload to trigger useEffect
  };

  const handleUnitClick = (selectedUnitId) => {
    try {
      // console.log("selectedUnit ID:", selectedUnitId);

      UserService.getCirclesByUnitId(
        selectedUnitId,
        (circlesData) => {
          // console.log("Cons C report Circles Retrieved:", circlesData);

          if (!Array.isArray(circlesData)) {
            console.error("Unexpected C circlesData format:", circlesData);
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

          navigate("/circle-proforma", {
            state: {
              year,
              quarter,
              selectedUnitId: selectedUnitId,
              formId: "rtiCircleConsReportC",
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
            <h3 className="card-header-text">
              Annexure-III (proforma-C) <br /> Consolidated Statement on the applications received and disposed of under the R.T.I Act , Department: Irrigation & CADD
            </h3>
          </div>
        </Card.Header>
        <Card.Body style={{ overflowX: "auto" }}>
          <Card.Text>
            <div style={{ width: "100%", overflowX: "auto" }}>
              <div className="mb-1">
                <RTIYearQuarterComponent
                  actionUrl="/submitForm"
                  onSubmit={handleFormSubmit} // Call the function that sets state and triggers reload
                  formId="rtiunitConsReportC"
                />
              </div>

              <div className="mb-1 text-center" style={{ color: "red", fontStyle: "italic", paddingBottom: "0.5cm" }}>
                {year && quarter && (
                  <p>
                    RTI Application (Proforma C) report for Year {year} and Quarter {quarter}
                  </p>
                )}
              </div>

              <div className="col-md-12 d-flex justify-content-center">
                <div className="me-2">
                  <PrintableComponents
                    data="printTable"
                    type="html"
                    header={`RTI Application Consolidated Report ${year ? parseInt(year) : ""}${quarter ? "-" + parseInt(quarter) : ""}`}
                  ></PrintableComponents>
                </div>
                <div>
                  <ExportToExcel tableId="printTable" filename="RTIProformaC.xlsx" sheetName="RTIProformaC" buttonLabel="Download Excel" />
                </div>
              </div>
              <div className="scroll-container" id="printTable">
                <Table striped bordered hover style={{ width: "100%", tableLayout: "fixed" }} size="sm" className="rti-table">
                  <RtiAppConsolidatedReportTableHeader cellStyle={cellStyle} />

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

                        <td className="custom-tableCell"> </td>
                        <td className="custom-tableCell">{r.qpending} </td>
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
