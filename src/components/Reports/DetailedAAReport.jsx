import React, { useState, useEffect } from 'react';
import { Card, Alert, Button } from 'react-bootstrap';
import ReportsService from '../../services/ReportsService';
import Table from 'react-bootstrap/Table';
import UserService from '../../services/UserService';
import { useNavigate } from 'react-router-dom';
import { ViewFile } from '../Reports/ViewFile';

const DetailedAAReport  = ({
  unitId,
  approvedById,
  scstFunds,
  financialYear,
  projectId,
  hoaId,
  workTypeId,
  ProjSubType,
  type
}) => {
  const [tanksList, setTanksList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [liftList, setLiftList] = useState([]);
  const [smallLiftList, setSmallLiftList] = useState([]);
  const [buildingList, setBuildingList] = useState([]);
  const [floodBankList, setFloodBankList] = useState([]);
  //const [reportData, setReportData] = useState(null);
  const [errorData, seterrorData] = useState(null);
  //const [officeNames, setOfficeNames] = useState([]); // [officeNames,setOfficeNames]
  // const { unitId, approvedById, scst, financialYear, projectId } = location.state || {};
 const [normalizedApprovedById, setNormalizedApprovedById] = useState(approvedById);
 const navigate = useNavigate();
 
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
        fetchAAReportData(unitId, normalizedApprovedById, financialYear, scstFunds, projectId, hoaId, workTypeId, ProjSubType, type);
      } else if (unitId === 0 && hoaId === 0) {
        fetchAAReportDataSanction(unitId, normalizedApprovedById, financialYear, scstFunds, projectId, hoaId, workTypeId, ProjSubType, type);
      } else {
        fetchAAReportDataHoa(unitId, normalizedApprovedById, financialYear, scstFunds, projectId, hoaId, workTypeId, ProjSubType, type);
      }
    }
  }, [unitId, normalizedApprovedById, financialYear, scstFunds, projectId, hoaId, workTypeId, ProjSubType, type]);

  const fetchAAReportDataSanction = async (...params) => {
    try {
      ReportsService.getDetailedAAReportSanction(
        { params: getParams(...params) },
        (response) => getWorkItems(response),
        (error) => console.error('Error :', error)
      );
    } catch (err) {
      seterrorData("Error fetching data");
      console.error('Error fetching report data:', err);
    }
  };

  const fetchAAReportDataHoa = async (...params) => {
    try {
      ReportsService.getDetailedAAReportHoa(
        { params: getParams(...params) },
         (response) => getWorkItems(response), 
         (error) => console.error('Error :', error))

    } catch (err) {
      seterrorData("Error fetching data");
      console.error('Error fetching report data:', err);
    }
  };

  const fetchAAReportData = async (...params) => {
    // console.log("fetchAAReportData unitId"+unitId+" approvedById"+approvedById+" scstFunds"+scstFunds+" financialYear"+financialYear+" projectId"+projectId+ "hoaId"+hoaId+"workTypeId"+workTypeId+"ProjSubType"+ProjSubType +"type"+type);
    try {

      ReportsService.getDetailedAAReport(
        { params: getParams(...params) },
         (response) => getWorkItems(response), 
         (error) => console.error('Error :', error))

    } catch (err) {
      seterrorData("Error fetching data");
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
    UserService.getOfficeNames((officeNamesResponse) => {

    //  console.log("officeNamesResponseofficeNamesResponse:", officeNamesResponse);
      const unitMap = new Map(officeNamesResponse.data.data.map(({ unitId, unitName }) => [unitId, unitName]));
      const circleMap = new Map(officeNamesResponse.data.data.map(({ circleId, circleName }) => [circleId, circleName]));
      const divisionMap = new Map(officeNamesResponse.data.data.map(({ divisionId, divisionName }) => [divisionId, divisionName]));
      const subDivisionMap = new Map(officeNamesResponse.data.data.map(({ subdivisionId, subDivisionName }) => [subdivisionId, subDivisionName]));

const updatedResponse = response.data.data.map((item) => ({
  ...item,
  unitName: unitMap.get(item.unitId) || "Not Found", // Get unitName or default "Not Found"
  circleName: circleMap.get(item.circleId) || "Not Found", // Get circleName or default "Not Found"
  divisionName: divisionMap.get(item.divisionId) || "Not Found", // Get divisionName or default "Not Found"
  subDivisionName: subDivisionMap.get(item.subDivisionId) || "Not Found", // Get subDivisionName or default "Not Found"
  
}));

try {
  //console.log("updatedResponse"+updatedResponse);
  const tanksList = updatedResponse.filter(item => item.workTypeId === 2);
  //console.log("Filtered Tanks List:", tanksList);  
  setTanksList(tanksList);

  const projectList = updatedResponse.filter(item => item.workTypeId === Number(1));
  console.log("Filtered Projects List:", projectList);  
  setProjectList(projectList);

  const liftList = updatedResponse.filter(item => item.workTypeId === 3);
  //console.log("Filtered liftList:", liftList);  
  setLiftList(liftList);

  const smallLiftList = updatedResponse.filter(item => item.workTypeId === 4);
  //console.log("Filtered smallLiftList:", smallLiftList);  
  setSmallLiftList(smallLiftList);

  const floodBanksList = updatedResponse.filter(item => item.workTypeId === 5);
  //console.log("Filtered floodBanksList:", floodBanksList);  
  setFloodBankList(floodBanksList);

  const buildingList = updatedResponse.filter(item => item.workTypeId === 6);
  //console.log("Filtered buildingList:", buildingList);  
  setBuildingList(buildingList);

  //setReportData(response.data.data);
} catch (error) {
  if(error.status === 401 || error.status === 403 || error.status === 404){navigate('/')}
  console.error('Error Getting Data:', error);
}

    }, (error) => console.error('Error :', error));
   
  }



  return (
    <div className='d-flex justify-content-center m-3'>
      <Card className="mb-3">
        <Card.Header  className='Card-header'  as="h5">DETAILED REPORT - O&M WORKS</Card.Header>
        <Card.Body >

          <Card.Text>
        

            {errorData && <Alert variant="danger">{errorData}</Alert>}

            {projectList && projectList.length > 0 && (
              <div>  <h5 className="panel-title text-center" style={{ fontWeight: 'bold' }}>
                PROJECTS REPORT
              </h5>
                <Table striped bordered hover size="sm" responsive="sm" className='custom-table'>

                  <thead>
                    <tr>
                      <th rowSpan="2">Sl.No</th>
                      <th rowSpan="2">Work Id</th>
                      <th rowSpan="2">Project-Reservoir Name</th>
                      <th rowSpan="2">Name of the Work</th>
                      <th rowSpan="2">Head of Account</th>
                      <th colSpan="3">Works Approved Details</th>
                      <th rowSpan="2">Submitted by</th>
                      <th rowSpan="2">Administrative Sanction Proceeding</th>
                    </tr>
                    <tr>
                      <th>Approved by</th>
                      <th>Proc No.</th>
                      <th>Amount (in Rupees)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectList.map((project, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{project.workId}</td>
                        <td>{project.projectName}</td>
                        <td>{project.workName}</td>
                        <td>{project.headOfAccount}</td>
                        <td>{project.approvedByName}</td>
                        <td>{project.referenceNumber}</td>
                        <td>{project.adminSanctionAmt}</td>
                       <td>{project.unitId !== 0 && (project.unitName + ', ' +  ((project.circleId) !== 0 ? project.circleName + ', ' : '') +  ((project.divisionId) !== 0 ? project.divisionName + ', ' : '' )+  ((project.subDivisionId)!==0 ? project.subDivisionName :''))}</td>
                       <td><Button variant="link" className='w-50 m-0' onClick={() => viewFile(project.aaFileUrl)} >  View File   </Button>
                        {/* <a href={`../${project.adminSancUrl}`} target="_blank" rel="noopener noreferrer"> View File </a> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </Table>
              </div>
            )}


            {tanksList && tanksList.length > 0 && (
              <div>
                <h5 className="panel-title text-center" style={{ fontWeight: 'bold' }}>
                  TANKS REPORT
                </h5>

                <Table striped bordered hover size="sm" responsive="sm" className='custom-table'>
                  <thead>
                    <tr>
                      <th rowSpan="2">Sl.No</th>
                      <th rowSpan="2">Work Id</th>
                      <th rowSpan="2">Tank Name</th>
                      <th rowSpan="2">Name of the Work</th>
                      <th rowSpan="2">Head of Account</th>
                      <th colSpan="3">Works Approved Details</th>
                      <th rowSpan="2">Submitted by</th>
                      <th rowSpan="2">Administrative Sanction Proceeding</th>
                    </tr>
                    <tr>
                      <th>Approved by</th>
                      <th>Proc No.</th>
                      <th>Amount (in Rupees)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tanksList.map((project, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{project.workId}</td>
                        <td>{project.projectName}</td>
                        <td>{project.workName}</td>
                        <td>{project.headOfAccount}</td>
                        <td>{project.approvedByName}</td>
                        <td>{project.referenceNumber}</td>
                        <td>{project.adminSanctionAmt}</td>
                      
<td>{project.unitId !== 0 &&
    (project.unitName + ', ' + 
     ((project.circleId) !== 0 ? project.circleName + ', ' : '') + 
     ((project.divisionId) !== 0 ? project.divisionName + ', ' : '' )+
     ((project.subDivisionId)!==0 ? project.subDivisionName :''))}</td>
                        <td>
                          <Button variant="link" className='w-50 m-0' onClick={() => viewFile(project.aaFileUrl)} >  View File   </Button>
                          {/* <a href={`../${project.adminSancUrl}`} target="_blank" rel="noopener noreferrer">  View File  </a> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </Table> </div>
            )}

            {liftList && liftList.length > 0 && (
              <div><h5 className="panel-title text-center" style={{ fontWeight: 'bold' }}>
                LIFTS REPORT
              </h5>
                <Table striped bordered hover size="sm" responsive="sm" className='custom-table'>
                  <thead>
                    <tr>
                      <th rowSpan="2">Sl.No</th>
                      <th rowSpan="2">Work Id</th>
                      <th rowSpan="2">Project-Reservoir Name</th>
                      <th rowSpan="2">Name of the Work</th>
                      <th rowSpan="2">Head of Account</th>
                      <th colSpan="3">Works Approved Details</th>
                      <th rowSpan="2">Submitted by</th>
                      <th rowSpan="2">Administrative Sanction Proceeding</th>
                    </tr>
                    <tr>
                      <th>Approved by</th>
                      <th>Proc No.</th>
                      <th>Amount (in Rupees)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {liftList.map((project, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{project.workId}</td>
                        <td>{project.projectName}</td>
                        <td>{project.workName}</td>
                        <td>{project.headOfAccount}</td>
                        <td>{project.approvedByName}</td>
                        <td>{project.referenceNumber}</td>
                        <td>{project.adminSanctionAmt}</td>
                      
<td>{project.unitId !== 0 &&
    (project.unitName + ', ' + 
     ((project.circleId) !== 0 ? project.circleName + ', ' : '') + 
     ((project.divisionId) !== 0 ? project.divisionName + ', ' : '' )+
     ((project.subDivisionId)!==0 ? project.subDivisionName :''))}</td>
                        <td>
                          <Button variant="link" className='w-50 m-0' onClick={() => viewFile(project.aaFileUrl)} >  View File   </Button>
                          {/* <a href={`../${project.adminSancUrl}`} target="_blank" rel="noopener noreferrer"> View File </a> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </Table></div>
            )}


            {smallLiftList && smallLiftList.length > 0 && (
              <div><h5 className="panel-title text-center" style={{ fontWeight: 'bold' }}>
                SMALL LIFTS REPORT
              </h5>
                <Table striped bordered hover size="sm" responsive="sm" className='custom-table'>
                  <thead>
                    <tr>
                      <th rowSpan="2">Sl.No</th>
                      <th rowSpan="2">Work Id</th>
                      <th rowSpan="2">Project-Reservoir Name</th>
                      <th rowSpan="2">Name of the Work</th>
                      <th rowSpan="2">Head of Account</th>
                      <th colSpan="3">Works Approved Details</th>
                      <th rowSpan="2">Submitted by</th>
                      <th rowSpan="2">Administrative Sanction Proceeding</th>
                    </tr>
                    <tr>
                      <th>Approved by</th>
                      <th>Proc No.</th>
                      <th>Amount (in Rupees)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {smallLiftList.map((project, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{project.workId}</td>
                        <td>{project.projectName}</td>
                        <td>{project.workName}</td>
                        <td>{project.headOfAccount}</td>
                        <td>{project.approvedByName}</td>
                        <td>{project.referenceNumber}</td>
                        <td>{project.adminSanctionAmt}</td>
                       
<td>{project.unitId !== 0 &&
    (project.unitName + ', ' + 
     ((project.circleId) !== 0 ? project.circleName + ', ' : '') + 
     ((project.divisionId) !== 0 ? project.divisionName + ', ' : '' )+
     ((project.subDivisionId)!==0 ? project.subDivisionName :''))}</td>
                        <td>
                          <Button variant="link" className='w-50 m-0' onClick={() => viewFile(project.aaFileUrl)} >  View File   </Button>
                          {/* <a href={`../${project.adminSancUrl}`} target="_blank" rel="noopener noreferrer">  View File </a> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </Table></div>
            )}


            {floodBankList && floodBankList.length > 0 && (
              <div><h5 className="panel-title text-center" style={{ fontWeight: 'bold' }}>
                FLOOD BANKS REPORT
              </h5>
                <Table striped bordered hover size="sm" responsive="sm" className='custom-table'>
                  <thead>
                    <tr>
                      <th rowSpan="2">Sl.No</th>
                      <th rowSpan="2">Work Id</th>
                      <th rowSpan="2">Project-Reservoir Name</th>
                      <th rowSpan="2">Name of the Work</th>
                      <th rowSpan="2">Head of Account</th>
                      <th colSpan="3">Works Approved Details</th>
                      <th rowSpan="2">Submitted by</th>
                      <th rowSpan="2">Administrative Sanction Proceeding</th>
                    </tr>
                    <tr>
                      <th>Approved by</th>
                      <th>Proc No.</th>
                      <th>Amount (in Rupees)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {floodBankList.map((project, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{project.workId}</td>
                        <td>{project.projectName}</td>
                        <td>{project.workName}</td>
                        <td>{project.headOfAccount}</td>
                        <td>{project.approvedByName}</td>
                        <td>{project.referenceNumber}</td>
                        <td>{project.adminSanctionAmt}</td>
                     
<td>{project.unitId !== 0 &&
    (project.unitName + ', ' + 
     ((project.circleId) !== 0 ? project.circleName + ', ' : '') + 
     ((project.divisionId) !== 0 ? project.divisionName + ', ' : '' )+
     ((project.subDivisionId)!==0 ? project.subDivisionName :''))}</td>
                        <td>
                          <Button variant="link" className='w-50 m-0' onClick={() => viewFile(project.aaFileUrl)} >  View File   </Button>
                          {/* <a href={`../${project.adminSancUrl}`} target="_blank" rel="noopener noreferrer"> View File  </a> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </Table></div>
            )}


            {buildingList && buildingList.length > 0 && (
              <div>
                <h5 className="panel-title text-center" style={{ fontWeight: 'bold' }}>
                  CAMPS AND BUILDINGS REPORT
                </h5>
                <Table striped bordered hover size="sm" responsive="sm" className='custom-table'>
                  <thead>
                    <tr>
                      <th rowSpan="2">Sl.No</th>
                      <th rowSpan="2">Work Id</th>
                      <th rowSpan="2">Name of the Work</th>
                      <th rowSpan="2">Head of Account</th>
                      <th colSpan="3">Works Approved Details</th>
                      <th rowSpan="2">Submitted by</th>
                      <th rowSpan="2">Administrative Sanction Proceeding</th>
                    </tr>
                    <tr>
                      <th>Approved by</th>
                      <th>Proc No.</th>
                      <th>Amount (in Rupees)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buildingList.map((project, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{project.workId}</td>
                        {/* <td>{project.projectName}</td> */}
                        <td>{project.workName}</td>
                        <td>{project.headOfAccount}</td>
                        <td>{project.approvedByName}</td>
                        <td>{project.referenceNumber}</td>
                        <td>{project.adminSanctionAmt}</td>
                        
<td>{project.unitId !== 0 &&
    (project.unitName + ', ' + 
     ((project.circleId) !== 0 ? project.circleName + ', ' : '') + 
     ((project.divisionId) !== 0 ? project.divisionName + ', ' : '' )+
     ((project.subDivisionId)!==0 ? project.subDivisionName :''))}</td>
                        <td>
                          <Button variant="link" className='w-50 m-0' onClick={() => viewFile(project.aaFileUrl)} >  View File   </Button>
                          {/* <a href={`../${project.adminSancUrl}`} target="_blank" rel="noopener noreferrer">  View File </a> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </Table></div>
            )}
          </Card.Text>
        </Card.Body>
      </Card>

    </div>

  );
};

export default DetailedAAReport;
