import React, { useState, useEffect } from 'react';
import { Card, Alert, Button } from 'react-bootstrap';
import ReportsService from '../../services/ReportsService';
import Table from 'react-bootstrap/Table';
import ExporttoExcel from '../ExporttoExcel';
import PrintableComponents from '../PrintableComponents';
import { ViewFile } from '../Reports/ViewFile';

const DetailedTSAgmtBillsReport = ({
  unitId,
  approvedById,
  scstFunds,
  financialYear,
  projectId,
  hoaId,
  workTypeId,
  ProjSubType,
  type,
}) => {
  const [tsList, setTsList] = useState([]);
  const [agmtList, setAgmtList] = useState([]);
  const [billsList, setBillsList] = useState([]);
  const [errorData, setErrorData] = useState(null);

  const [normalizedApprovedById, setNormalizedApprovedById] = useState(approvedById);

  useEffect(() => {
    let adjusted = approvedById;
    if (adjusted === "GO. 45") adjusted = 9999;
    else if (adjusted === "Government") adjusted = 1;
    else if (adjusted === "O") adjusted = 2;

    setNormalizedApprovedById(adjusted);
  }, [approvedById]);

 // console.log("unitId"+unitId+" approvedById"+approvedById+" scstFunds"+scstFunds+" financialYear"+financialYear+" projectId"+projectId+ "hoaId"+hoaId+"workTypeId"+workTypeId+"ProjSubType"+ProjSubType +"type"+type);

 const viewFile = (filePath) => {
  // console.log(filePath);
     ViewFile(filePath);
   };

  useEffect(() => {
    if (
      unitId != null &&
      normalizedApprovedById != null &&
      scstFunds != null &&
      financialYear != null &&
      projectId != null &&
      hoaId != null &&
      workTypeId != null &&
      ProjSubType != null &&
      type != null
    ) {
      if (hoaId === 0 && unitId !== 0) {
        fetchTSAgmtBillsReportData(unitId, normalizedApprovedById, financialYear, scstFunds, projectId, hoaId, workTypeId, ProjSubType, type);
      } else if (unitId === 0 && hoaId === 0) {
        fetchTSAgmtBillsReportDataSanction(unitId, normalizedApprovedById, financialYear, scstFunds, projectId, hoaId, workTypeId, ProjSubType, type);
      } else {
        fetchTSAgmtBillsReportDataHoa(unitId, normalizedApprovedById, financialYear, scstFunds, projectId, hoaId, workTypeId, ProjSubType, type);
      }
    }
  }, [unitId, normalizedApprovedById, financialYear, scstFunds, projectId, hoaId, workTypeId, ProjSubType, type]);

  const fetchTSAgmtBillsReportDataSanction = async (...params) => {
    try {
      ReportsService.getDetailedTSAgmtBillsReportSanction(
        { params: getParams(...params) },
        (response) => getWorkItems(response),
        (error) => console.error('Error :', error)
      );
    } catch (err) {
      setErrorData("Error fetching data");
      console.error('Error fetching report data:', err);
    }
  };

  const fetchTSAgmtBillsReportDataHoa = async (...params) => {
    try {
      ReportsService.getDetailedTSAgmtBillsReportHoa(
        { params: getParams(...params) },
        (response) => getWorkItems(response),
        (error) => console.error('Error :', error)
      );
    } catch (err) {
      setErrorData("Error fetching data");
      console.error('Error fetching report data:', err);
    }
  };

  const fetchTSAgmtBillsReportData = async (...params) => {
    try {
      ReportsService.getDetailedTSAgmtBillsReport(
        { params: getParams(...params) },
        (response) => getWorkItems(response),
        (error) => console.error('Error :', error)
      );
    } catch (err) {
      setErrorData("Error fetching data");
      console.error('Error fetching report data:', err);
    }
  };

  const getParams = (
    unitId, approvedById, financialYear, scstFunds, projectId, hoaId, workTypeId, ProjSubType, type
  ) => ({
    unitId,
    approvedById,
    financialYear,
    scstFunds,
    projectId,
    hoaId,
    workTypeId,
    ProjSubType,
    type,
  });

  const getWorkItems = (response) => {
   // console.log("response.data.data" +response.data.data);
    try {
      const tsList = response.data.data.filter(item => item.type === 2);
      setTsList(tsList);
      //console.log("Filtered tsList:", tsList); 

      const agmtList = response.data.data.filter(item => item.type === 3);
      setAgmtList(agmtList);
     // console.log("Filtered agmtList List:", agmtList);  

      const billsList = response.data.data.filter(item => item.type === 5 || item.type === 6);
      setBillsList(billsList);
       //console.log("Filtered billsList:", billsList);  

    } catch (error) {
      console.error('Error Getting Data:', error);
    }
  };

  return (
    <div className='d-flex justify-content-center m-3'>
      
      <Card className="mb-3" style={{ width: '100%' }}>
      <div className="d-flex justify-content-center align-items-center gap-3">
      <div><PrintableComponents data="printTable1" type="html" header={`Detailed Report `} ></PrintableComponents></div>
      <div> <ExporttoExcel tableData={tsList}  fileName="Detailed Report" ></ExporttoExcel></div>
      </div>
        <Card.Header  className='Card-header'  as="h5">
          DETAILED REPORT - O&M WORKS
        </Card.Header>
        <Card.Body>
          <Card.Text>
            {errorData && <Alert variant="danger">{errorData}</Alert>}

            {tsList && tsList.length > 0 && (
              <div className="table-responsive" id="printTable1">
                <h5 className="panel-title text-center" style={{ fontWeight: 'bold' }}>
                  TECHNICAL SANCTION DETAILS
                </h5>
                <Table striped bordered hover size="sm" responsive="sm" className='custom-table'>
                  <thead>
                    <tr>
                      <th rowSpan="2">Sl.No</th>
                      <th rowSpan="2">Work Id</th>
                      <th rowSpan="2">Name of the Work</th>
                      <th colSpan="2">Technical Sanction Details</th>
                      <th rowSpan="2">Submitted by</th>
                      <th rowSpan="2">TS Proceeding</th>
                      <th rowSpan="2">TS Estimate</th>
                    </tr>
                    <tr>
                      <th>Proc No.</th>
                      <th>Amount (in Rupees)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tsList.map((ts, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{ts.workId}</td>
                        <td>{ts.workName}</td>
                        <td>{ts.tsNumber} , {ts.tsApprovedDate}</td>
                        <td>{ts.tsApprovedAmount}</td>
                        <td>{ts.submittedBy || '-'}</td>
                        <td>
                          <Button variant="link" className='w-50 m-0' onClick={() => viewFile(ts.tsFileUrl)} > View File </Button>
                          {/* <a href={`../${ts.tsFileUrl}`} target="_blank" rel="noopener noreferrer">  View Proceeding  </a> */}
                        </td>
                        <td>
                          <Button variant="link" className='w-50 m-0' onClick={() => viewFile(ts.tsEstFileUrl)} >  View File   </Button>
                          {/* <a href={`../${ts.tsEstFileUrl}`} target="_blank" rel="noopener noreferrer"> View Estimate </a> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}



{agmtList && agmtList.length > 0 && (
             <div className="table-responsive" id="printTable1">
                <h5 className="panel-title text-center" style={{ fontWeight: 'bold' }}>
                AGREEMENT DETAILS
                </h5>
                <Table striped bordered hover size="sm" responsive="sm" className='custom-table'>
                  <thead>
                    <tr>
                    <th rowSpan="2">Sl.No</th>
                      <th rowSpan="2">Work Id</th>
                      <th rowSpan="2">Name of the Work</th>
                      <th colSpan="2">Works Called by</th>
                      <th colSpan="2">Agreement Details</th>
                      <th rowSpan="2">Agency Name</th>
                      <th rowSpan="2">Submitted by</th>
                    </tr>
                    <tr>
                    <th>Called on</th>
                      <th>Tender %</th>
                      <th>Proc No.</th>
                      <th>Amount (in Rupees)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agmtList.map((agmt, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{agmt.workId}</td>
                        <td>{agmt.workName}</td>
                        <td>{agmt.tenderTypeName}</td>
                        <td>{agmt.tenderPercentage}</td>
                        <td>{agmt.agreementNumber}, {agmt.agreementDate}</td>
                        <td>{agmt.agreementAmount}</td>
                        <td>{agmt.agencyName}</td>
                        <td> </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}

{billsList && billsList.length > 0 && (
               <div className="table-responsive" id="printTable1">
                <h5 className="panel-title text-center" style={{ fontWeight: 'bold' }}>
                 BILL DETAILS
                </h5>
                <Table striped bordered hover size="sm" responsive="sm" className='custom-table'>
                  <thead>
                    <tr>
                    <th >Sl.No</th>
                      <th >Work Id</th>
                      <th >Work Name</th>
                      <th >Agreement No</th>
                      <th >Bill No</th>
                      <th >Bill Amount</th>
                      <th >Status</th>
                      <th >Submitted by</th>

                    </tr>
                    
                  </thead>
                  <tbody>
                    {billsList.map((bill, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{bill.workId}</td>
                       <td>{bill.workName}</td>
                        <td>{bill.agreementNumber}</td>
                        <td>{bill.billNo}& {bill.billType}</td>
                        <td>{bill.workDoneAmount}</td>
                        <td>{bill.statusName}</td>
                        <td></td>

                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DetailedTSAgmtBillsReport;
