import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import ExporttoExcel from "../ExporttoExcel";
import PrintableComponents from "../PrintableComponents";
import ReportsService from "../../services/ReportsService";
import { FinancialYearOptions } from "../Entry/FinancialYearOptions";
import { useUserDetails } from "../UserDetailsContext";
//import { useNavigate } from 'react-router-dom';
import DetailedTSAgmtBillsReport from "./DetailedTSAgmtBillsReport";
import DetailedAAReport from "./DetailedAAReport";

export const SanctionAuthorityWise = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [errorData, seterrorData] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ component: null, params: {} });

  //const navigate = useNavigate();
  const getSelectedYear = (data) => {
    setSelectedYear(data);
  };

  const { user } = useUserDetails();
  useEffect(() => {
    ReportsService.fetchSanctionAuthorityWise(
      {
        params: {
          unitId: user && user.unitId,
          circleId: user && user.circleId,
          divisionId: user && user.divisionId,
          subDivisionId: user && user.subDivisionId,
          finyear: selectedYear != null ? selectedYear : 0,
          // unitId: 9813,
          //circleId: 21574,
          //divisionId: 30994,
          //subDivisionId: 11751,
          //finyear: 2024,
        },
      },
      (response) => {
        //console.log("response in sancton auhtority wise"+JSON.stringify(response.data.data));
        setReportData(response.data.data);
        seterrorData(null);
      },
      (error) => {
        seterrorData("Error fetching data");
        if (error.status === 401 || error.status === 403 || error.status === 404) {
          window.location.href = `${process.env.ICAD_BASE_URL}`;
        }
      },
    );
  }, [selectedYear]);

  const reportList = reportData.map((item, index) => ({
    SlNo: index + 1,
    "Approved Authority": item.approvedName,
    "Admin Count": item.adminCount,
    "Admin Amount": item.adminAmt.toFixed(4),
    "Tech Count": item.techCount,
    "Tech Amount": item.techAmt.toFixed(4),
    "Agreement Count": item.agreementCount,
    "Agreement Amount": item.agreementAmt.toFixed(4),
    "Bill Paid Count": item.billsPaid,
    "Bill Paid Amount": item.paidAmount.toFixed(4),
    billsPendingCount: item.billsPending,
    billsPendingAmount: item.pendingAmount.toFixed(4),
  }));

  const calculateColumnTotal = (key) => {
    if (!reportData) {
      return 0;
    }
    return reportData.reduce((total, item) => total + (item[key] || 0), 0);
  };

  const openModal = (component, params) => {
    setModalData({ component, params });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData({ component: null, params: {} });
  };

  return (
    <div className="d-flex justify-content-center m-3">
      <Card className="mb-3" style={{ width: "80%" }}>
        <Card.Header className="Card-header" as="h5">
          SANCTION AUTHORITY WISE - ABSTRACT REPORT
        </Card.Header>
        <Card.Body>
          <Row>
            {/* <div className='d-flex justify-content-end'>
                <span style={{ color: "red" }} >* Only Assigned Works will be reflected in this Report. Please Assign the Works after submission of Administrative Sanction.</span>
              </div> */}
            <div className="d-flex justify-content-end">
              <span style={{ color: "red" }}>* Amount in Lakhs.</span>
            </div>
          </Row>
          <Row className="mb-6">
            <div className="d-flex justify-content-end">
              {/* to print json data */}
              {/* <div><PrintableComponents data={reportList} columns={reportList.length > 0 ? Object.keys(reportList[0]) : []} type={"json"} header={`SanctionAuthority Wise` +  selectedYear}></PrintableComponents></div> */}

              <div>
                <PrintableComponents data="printTable" type="html" header={`SanctionAuthority Wise  ${selectedYear ? parseInt(selectedYear) + -1 + "-" + selectedYear : ""}`}></PrintableComponents>
              </div>
              <div>
                {" "}
                <ExporttoExcel tableData={reportList} fileName="SanctionAuthorityWise"></ExporttoExcel>
              </div>
            </div>
            <Form.Group as={Row} controlId="formGridFinYear">
              <div className="d-flex justify-content-center">
                <Form.Label className="m-3">Select Financial Year</Form.Label>
                <FinancialYearOptions selectedYearFromChild={getSelectedYear}></FinancialYearOptions>
              </div>
            </Form.Group>
          </Row>
          {errorData && <Alert variant="danger">{errorData}</Alert>}
          <div className="table-responsive" id="printTable">
            <Table bordered hover className="custom-table">
              <thead>
                <tr>
                  <th rowSpan="2">Sl.No</th>
                  <th rowSpan="2">Approved By</th>
                  <th colSpan="2">Admin Sanctions</th>
                  <th colSpan="2">Technical Sanction</th>
                  <th colSpan="2">Tender Called for</th>
                  <th colSpan="2">Agreement Done</th>
                  <th colSpan="2">Action to be taken</th>
                  <th colSpan="2">Bill Status</th>
                  <th colSpan="2">Bill Amount</th>
                </tr>
                <tr>
                  <th> Nos.</th>
                  <th>Amount</th>

                  <th> Nos.</th>
                  <th>Amount</th>
                  <th> Nos.</th>
                  <th>Amount</th>
                  <th> Nos.</th>
                  <th>Amount</th>
                  <th> Nos.</th>
                  <th>Amount</th>
                  <th>Paid</th>
                  <th>Pending</th>
                  <th>Paid Amount</th>
                  <th>Pending Amount</th>
                </tr>
              </thead>
              <tbody>
                {reportData &&
                  reportData.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.approvedName}</td>
                      <td>
                        {" "}
                        <Link
                          to="#"
                          onClick={(e) => {
                            e.preventDefault();
                            openModal("AADetail", {
                              unitId: 0,
                              approvedById: item.approvedId,
                              financialYear: selectedYear,
                              projectId: 0,
                              hoaId: 0,
                              workTypeId: 0,
                              ProjSubType: 0,
                              scstFunds: 0,
                              type: 1,
                            });
                          }}
                        >
                          {item.adminCount}{" "}
                        </Link>
                      </td>
                      <td>{item.adminAmt.toFixed(4)}</td>
                      <td>
                        <Link
                          to="#"
                          onClick={(e) => {
                            e.preventDefault();
                            openModal("TSDetail", {
                              unitId: 0,
                              approvedById: item.approvedId,
                              financialYear: selectedYear,
                              projectId: 0,
                              hoaId: 0,
                              workTypeId: 0,
                              ProjSubType: 0,
                              scstFunds: 0,
                              type: 2,
                            });
                          }}
                        >
                          {item.techCount}{" "}
                        </Link>
                      </td>
                      <td>{item.techAmt.toFixed(4)}</td>
                      <td>
                        <Link
                          to="#"
                          onClick={(e) => {
                            e.preventDefault();
                            openModal("TSDetail", {
                              unitId: 0,
                              approvedById: item.approvedId,
                              financialYear: selectedYear,
                              projectId: 0,
                              hoaId: 0,
                              workTypeId: 0,
                              ProjSubType: 0,
                              scstFunds: 0,
                              type: 3,
                            });
                          }}
                        >
                          {item.agreementCount}{" "}
                        </Link>
                      </td>
                      <td>{item.agreementAmt.toFixed(4)}</td>
                      <td>
                        <Link
                          to="#"
                          onClick={(e) => {
                            e.preventDefault();
                            openModal("TSDetail", {
                              unitId: 0,
                              approvedById: item.approvedId,
                              financialYear: selectedYear,
                              projectId: 0,
                              hoaId: 0,
                              workTypeId: 0,
                              ProjSubType: 0,
                              scstFunds: 0,
                              type: 3,
                            });
                          }}
                        >
                          {item.agreementCount}{" "}
                        </Link>
                      </td>
                      <td>{item.agreementAmt.toFixed(4)}</td>
                      <td>
                        <Link
                          to="#"
                          onClick={(e) => {
                            e.preventDefault();
                            openModal("AADetail", {
                              unitId: 0,
                              approvedById: item.approvedId,
                              financialYear: selectedYear,
                              projectId: 0,
                              hoaId: 0,
                              workTypeId: 0,
                              ProjSubType: 0,
                              scstFunds: 0,
                              type: 4,
                            });
                          }}
                        >
                          {item.actionToBeTakenCount}{" "}
                        </Link>
                      </td>
                      <td>{item.actionToBeTakenAmt.toFixed(4)}</td>
                      <td>
                        <Link
                          to="#"
                          onClick={(e) => {
                            e.preventDefault();
                            openModal("TSDetail", {
                              unitId: 0,
                              approvedById: item.approvedId,
                              financialYear: selectedYear,
                              projectId: 0,
                              hoaId: 0,
                              workTypeId: 0,
                              ProjSubType: 0,
                              scstFunds: 0,
                              type: 5,
                            });
                          }}
                        >
                          {item.billsPaid}{" "}
                        </Link>
                      </td>
                      <td>
                        <Link
                          to="#"
                          onClick={(e) => {
                            e.preventDefault();
                            openModal("TSDetail", {
                              unitId: 0,
                              approvedById: item.approvedId,
                              financialYear: selectedYear,
                              projectId: 0,
                              hoaId: 0,
                              workTypeId: 0,
                              ProjSubType: 0,
                              scstFunds: 0,
                              type: 6,
                            });
                          }}
                        >
                          {item.billsPending}{" "}
                        </Link>
                      </td>
                      <td>{item.paidAmount.toFixed(4)}</td>
                      <td>{item.pendingAmount.toFixed(4)}</td>
                    </tr>
                  ))}
                {reportData && reportData.length === 0 && (
                  <tr>
                    <td colSpan="17" align="center">
                      No Data Found
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2">
                    <strong>Totals</strong>
                  </td>
                  <td>{calculateColumnTotal("adminCount")}</td>
                  <td>{calculateColumnTotal("adminAmt").toFixed(4)}</td>
                  <td>{calculateColumnTotal("techCount")}</td>
                  <td>{calculateColumnTotal("techAmt").toFixed(4)}</td>
                  <td>{calculateColumnTotal("agreementCount")}</td>
                  <td>{calculateColumnTotal("agreementAmt").toFixed(4)}</td>
                  <td>{calculateColumnTotal("agreementCount")}</td>
                  <td>{calculateColumnTotal("agreementAmt").toFixed(4)}</td>
                  <td>{calculateColumnTotal("actionToBeTakenCount")}</td>
                  <td>{calculateColumnTotal("actionToBeTakenAmt").toFixed(4)}</td>
                  <td>{calculateColumnTotal("billsPaid")}</td>
                  <td>{calculateColumnTotal("billsPending")}</td>
                  <td>{calculateColumnTotal("paidAmount").toFixed(4)}</td>
                  <td>{calculateColumnTotal("pendingAmount").toFixed(4)}</td>
                </tr>
              </tfoot>

              {isModalOpen && (
                <div className="modal-backdrop" onClick={closeModal}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button onClick={closeModal} className="modal-close-button" aria-label="Close">
                      &times; Close
                    </button>
                    {modalData.component === "AADetail" && <DetailedAAReport {...modalData.params} />}
                    {modalData.component === "TSDetail" && <DetailedTSAgmtBillsReport {...modalData.params} />}
                  </div>
                </div>
              )}
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
