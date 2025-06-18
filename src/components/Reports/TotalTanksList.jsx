import React, { useEffect, useState, useMemo } from "react";

import TankFillingService from "../../services/TankFillingService";
import { Link } from "react-router-dom";
import { useUserDetails } from "../UserDetailsContext";
import PaginationComponent from "../PaginationComponent";
import { Button, Card } from "react-bootstrap";
import ExporttoExcel from "../ExporttoExcel";
import PrintableComponents from "../PrintableComponents";
import Alert from "react-bootstrap/Alert";

const TotalTankList = () => {
  const [reportList, setReportList] = useState([]);
  const [officeWiseList, setOfficeWiseList] = useState([]);

  const [selectedTab, setSelectedTab] = useState(1);
  const [detailTanks, setdetailTanks] = useState(0);
  const [errorMsg, seterrorMsg] = useState(null);

  const { user } = useUserDetails();

  useEffect(() => {
    fetchData();
  }, [selectedTab]);

  useEffect(() => {}, [reportList]);

  const fetchData = () => {
    try {
      const data = {
        unitId: user.unitId,
        circleId: user.circleId,
        divisionId: user.divisionId,
        subDivisionId: user.subDivisionId,
        sourceType: [1, 2, 7, 9, 10, 11],
      };
      if (selectedTab === 1) {
        // Call fetchTankDataByunitId when type is 1
        TankFillingService.fetchTankDataByunitId(
          data,
          (response) => handleResponse(response),
          (error) => handleerror(error),
        );
      } else {
        // Call officeWiseTanks for all other types
        TankFillingService.officeWiseTanks(
          {
            params: {
              unit: user.unitId,
              circle: user.circleId,
              division: user.divisionId,
              subdivision: user.subDivisionId,
            },
          },
          "officeWisetanks",
          (response) => handleResponse(response),
          (error) => handleerror(error),
        );
      }
    } catch (err) {
      console.error("Failed to load data", err);
    }
  };

  const handleResponse = (response) => {
    // if (selectedTab === 1) {
    //   setFillingstatusReport(response.data.data);
    // }
    // else {
    //  // console.log("response in office wise tanks"+response.data.data);
    //   setOfficeWiseList(response.data.data);
    //
    //

    if (selectedTab === 1) {
      console.log("response in office wise tanks" + JSON.stringify(response.data.data));
      setReportList(response.data.data);
    }
    if (selectedTab === 2) {
      setOfficeWiseList(response.data.data);
    }
  };

  const handleerror = (error) => {
    console.error("Failed to load data", error);
    seterrorMsg("Error in fetching data");
  };

  const getsubOfficeWiseTanks = (officeId, officeType) => {
    try {
      TankFillingService.subOfficeWiseTanks(
        {
          params: {
            officeId: officeId,
            officeType: officeType,
          },
        },
        (response) => {
          handleResponse(response);
        },
        (error) => {
          handleerror(error);
        },
      );
    } catch (err) {
      console.error("Failed to load data", err);
    }
  };

  const calculateColumnTotal = () => {
    if (!reportList) {
      return 0;
    }
    return reportList.reduce((total, item) => total + (item.tanksCount || 0), 0);
  };

  //   const subtotals = items.reduce((acc, item) => {
  //   const { subdivId, amount } = item;
  //   acc[subdivId] = (acc[subdivId] || 0) + amount;
  //   return acc;
  // }, {});

  const getTankDetails = (officeId, officeType, id) => {
    //setSelectedTab=1;
    setdetailTanks(1);
    const data = {
      officeId: officeId,
      sourceType: [id],
      sectionName: officeType,
    };
    try {
      TankFillingService.fetchTankDataByunitId(
        data,
        (response) => {
          setReportList(response.data.data);
        },
        (error) => handleerror(error),
      );
    } catch (err) {
      console.error("Failed to load data", err);
    }
  };

  const selectedFields = selectedTab === 1 || detailTanks === 1 ? ["SlNo", "tankName", "tankCode", "geoId", "dname", "mname", "vname"] : ["SlNo", "officeName", "tankCount"];

  // const filteredReportList = useMemo(() => {

  //   return reportList.map((item, index) => {
  //     const filteredItem = { SlNo: index + 1 };

  //     selectedFields.forEach(field => {
  //       if (field !== 'SlNo') {
  //         filteredItem[field] = item[field];
  //       }
  //     });
  //     return filteredItem;
  //   });
  // }, [reportList, selectedFields]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Items per page

  // const totalPages = useMemo(() => {
  //   return Math.ceil(filteredReportList.length / itemsPerPage);
  // }, [filteredReportList, itemsPerPage]);

  // const currentItems = useMemo(() => {
  //   const indexOfLastItem = currentPage * itemsPerPage;
  //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  //   return filteredReportList.slice(indexOfFirstItem, indexOfLastItem);
  // }, [filteredReportList, currentPage, itemsPerPage]);
  const filteredReportList = reportList.map((item, index) => {
    const filteredItem = { SlNo: index + 1 };
    selectedFields.forEach((field) => {
      if (field !== "SlNo") {
        filteredItem[field] = item[field];
      }
    });

    return filteredItem;
  });

  const totalPages = filteredReportList && Math.ceil(filteredReportList.length / itemsPerPage);
  console.log("totalPages", totalPages);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReportList && filteredReportList.slice(indexOfFirstItem, indexOfLastItem);

  const renderFillingStatusTable = () => (
    <div id="printArea">
      <table id="totalTable" className="table table-bordered">
        <thead className="bg-info text-center">
          <tr>
            <th>Sl.No</th>
            <th>Name of the Tank</th>
            <th>Tank Code</th>
            <th>Geo Id</th>
            <th>District</th>
            <th>Mandal</th>
            <th>Village</th>
          </tr>
        </thead>
        <tbody>
          {currentItems && currentItems.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                No Data Found
              </td>
            </tr>
          ) : (
            currentItems &&
            currentItems.map((b, index) => (
              <tr key={index}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{b.tankName}</td>
                <td>{b.tankCode}</td>
                <td>{b.geoId}</td>
                <td>{b.dname}</td>
                <td>{b.mname}</td>
                <td>{b.vname}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderOfficeWiseTable = () => (
    <div id="printArea">
      <h2 className="text-center">Office Wise Tanks List</h2>
      <table id="officeTable" className="table table-bordered">
        <thead className="bg-info text-center">
          <tr>
            <th>Sl.No</th>
            <th>Office Name</th>
            <th>Source Type</th>
            <th>Tanks Count</th>
          </tr>
        </thead>
        <tbody>
          {officeWiseList.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No Data Found
              </td>
            </tr>
          ) : (
            officeWiseList.map((b, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td>{index + 1}</td>
                  <td>
                    {b.officeType !== "subdivision" ? (
                      // <a href={`./subofficeWiseTanks?officeId=${b.officeId}&officeName=${b.officeName}`}>{b.officeName}</a>
                      <Link to="#" onClick={() => getsubOfficeWiseTanks(b.officeId, b.officeType)} className="text-primary">
                        {" "}
                        {b.officeName}
                      </Link>
                    ) : (
                      b.officeName
                    )}
                  </td>
                  <td>{b.sourceTypeName}</td>
                  <td>
                    <Link to="#" onClick={() => getTankDetails(b.officeId, b.officeType, b.sourceTypeId)} className="text-primary">
                      {" "}
                      {b.tanksCount}
                    </Link>
                  </td>
                </tr>
                {b.totalTankCount > 0 && (
                  <tr className="bg-light font-weight-bold">
                    <td></td>
                    <td></td>
                    <td>{b.officeName} Total :</td>
                    <td>
                      <a href={`./subofficeWiseTotalTankDetails?officeId=${b.unitId}&officeName=${b.officeName}`}>{b.totalTankCount}</a>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td></td>
            <td className="text-right">Total :</td>
            <td className="text-center">{calculateColumnTotal()}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
  return (
    <div className="d-flex justify-content-center m-3">
      <br />
      <br />

      <Card className="mb-3" style={{ width: "80%" }}>
        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
        <Card.Header className="Card-header" as="h5">
          {" "}
          Tanks List for Tank Filling Status
        </Card.Header>
        <Card.Body>
          <div className="row">
            <div className="col-md-3">
              <Button
                variant={selectedTab === 1 ? "success" : "outline-success"}
                onClick={() => {
                  setSelectedTab(1);
                }}
              >
                Total Tanks
              </Button>
            </div>
            <div className="col-md-3">
              <Button
                variant={selectedTab === 2 ? "info" : "outline-info"}
                onClick={() => {
                  setSelectedTab(2);
                  setdetailTanks(0);
                }}
              >
                Office Wise Tanks
              </Button>
            </div>
            <div className="col-md-3"></div>

            <div className="col-md-3 d-flex justify-content-around">
              <div>
                <PrintableComponents
                  data={filteredReportList}
                  columns={filteredReportList.length > 0 ? Object.keys(filteredReportList[0]) : []}
                  type={"json"}
                  header={"Tank List for Tank Filling Status"}
                ></PrintableComponents>
              </div>
              <div>
                {" "}
                <ExporttoExcel tableData={filteredReportList} fileName="Tank List for Tank Filling Status"></ExporttoExcel>
              </div>
            </div>
            <br />
            <br />
            {selectedTab === 1 || detailTanks === 1 ? renderFillingStatusTable() : renderOfficeWiseTable()}
          </div>

          <div className="d-flex justify-content-center">
            {(selectedTab === 1 || detailTanks === 1) && <PaginationComponent totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage}></PaginationComponent>}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TotalTankList;
