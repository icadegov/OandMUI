import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import ReportsService from "../../../services/ReportsService";
import { useUserDetails } from "../../../components/UserDetailsContext";
import UserService from "../../../services/UserService";
const ReportTable = ({ finYear }) => {
  const [reportData, setReportData] = useState(null);
  const { user } = useUserDetails();
  const [errorData, setErrorData] = useState(null);

  // const getToken = () => localStorage.getItem('KC_TOKEN');
  // const getUserDetails = () => localStorage.getItem('userDetails');
  useEffect(() => {
    if (finYear) {
      sanctionAuthorityWise();
    }
  }, [finYear]);

  const sanctionAuthorityWise = () => {
    const token = UserService.getToken();
    //const user = UserService.getUserData();
    //setUsers(user);

    if (!token) {
      setErrorData("No authentication token found.");
      return;
    }

    ReportsService.fetchSanctionAuthorityWise(
      {
        params: {
          unitId: user?.unitId,
          circleId: user?.circleId,
          divisionId: user?.divisionId,
          subDivisionId: user?.subDivisionId,
          finyear: finYear,
        },
      },
      (response) => {
        // console.log("response in report table"+JSON.stringify(response.data.data));
        setReportData(response.data.data);
        setErrorData(null);
      },
      (error) => {
        setErrorData("Error fetching data");
        console.log(error);
      },
    );
  };

  return (
    <>
      {errorData && <p>{errorData}</p>}
      <Table bordered hover responsive className="custom-table-sm">
        <thead>
          <tr>
            <th>Sl.No</th>
            <th>Approved by</th>
            <th>Admin Sanction</th>
            <th>Technical Sanction</th>
            <th className="text-right">Agreement</th>
            <th className="text-right">Action to be taken</th>
            <th className="text-right">Bills Paid</th>
            <th className="text-right">Bills Pending</th>
          </tr>
        </thead>
        <tbody>
          {reportData &&
            reportData.map((item, index) => (
              <tr key={index + 1}>
                <td>{index + 1}</td>
                <td>
                  <div className="d-flex align-items-center">
                    <div>
                      <h6 className="font-weight-bold">{item.approvedName}</h6>
                    </div>
                  </div>
                </td>
                <td>
                  <span>
                    <b>{item.adminCount}</b> - {item.adminAmt.toFixed(2)}
                  </span>
                </td>
                <td>
                  <span>
                    <b>{item.techCount}</b> - {item.techAmt.toFixed(2)}
                  </span>
                </td>
                <td>
                  <span>
                    <b>{item.agreementCount}</b> - {item.agreementAmt.toFixed(2)}
                  </span>
                </td>
                <td>
                  <span>
                    <b>{item.actionToBeTakenCount}</b> - {item.actionToBeTakenAmt.toFixed(2)}
                  </span>
                </td>
                <td>
                  <span>
                    <b>{item.billsPaid}</b> - {item.paidAmount.toFixed(2)}
                  </span>
                </td>
                <td>
                  <span>
                    <b>{item.billsPending}</b> - {item.pendingAmount.toFixed(2)}
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
};

export default ReportTable;
