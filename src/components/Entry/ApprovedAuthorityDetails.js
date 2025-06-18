import React from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useState, useEffect } from "react";
import AdminSanctionService from "../../services/AdminSanctionService";
import { useUserDetails } from "../UserDetailsContext";
const ApprovedAuthorityDetails = ({ selApprovedIdFromChild }) => {
  const { user } = useUserDetails();

  const [approvedList, setapprovedList] = useState([]);

  const [approvedAmount, setapprovedAmount] = useState();

  const [selApprovedId, setselApprovedId] = useState(0);

  useEffect(() => {
    AdminSanctionService.getAuthorityList(
      (response) => {
        const data = response.data.data;
        if (Number(user.designationId) === Number(7)) {
          setapprovedList(data.filter((item) => item.authorityId === Number(4)));
        } else if (Number(user.designationId) === Number(5)) {
          setapprovedList(data.filter((item) => item.authorityId === Number(5)));
        } else if (Number(user.designationId) === Number(4)) {
          setapprovedList(data.filter((item) => item.authorityId === Number(6)));
        } else if (Number(user.designationId) === Number(12)) {
          setapprovedList(data.filter((item) => item.authorityId > Number(0) && item.authorityId < Number(4)));
        } else {
          setapprovedList(data);
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }, []);
  const handleAuthorityChange = (event) => {
    const authorityId = event.target.value;
    setselApprovedId(authorityId);
    AdminSanctionService.getUserAdminAmountByfinyear(
      {
        params: {
          unit: user.unitId,
          circle: user.circleId,
          division: user.divisionId,
          subdivision: user.subDivisionId,
          approvedId: authorityId,
          finyear: "2024",
        },
      },
      (response) => {
        calculateAmount(response.data.data);
      },
      (error) => {
        console.log(error);
      },
    );
  };
  const calculateAmount = (list) => {
    const total = list.reduce((acc, item) => acc + item.adminSanctionAmt, 0);
    setapprovedAmount(total); // State update is asynchronous
  };

  useEffect(() => {
    if (approvedAmount !== undefined && selApprovedId !== null) {
      const selApprovedObj = approvedList.find((approvedList) => Number(approvedList.authorityId) === Number(selApprovedId));
      if (selApprovedObj) {
        const updatedData = {
          authorityId: selApprovedObj.authorityId,
          finyearAmount: selApprovedObj.adminsancLimitFinYear,
          perWork: selApprovedObj.adminsancLimitPerWork,
          enteredASAmt: approvedAmount,
        };

        // console.log("Updated Data:", updatedData);
        // Store the final data
        selApprovedIdFromChild(updatedData);
      }
    }
  }, [approvedAmount, selApprovedId]);

  return (
    <Row className="mb-3">
      <Form.Group as={Col} controlId="formGridFinYear">
        <Form.Label>Select Authority</Form.Label>
        {approvedList && (
          <Form.Select value={selApprovedId} onChange={handleAuthorityChange}>
            <option value="0">Select </option>
            {approvedList &&
              approvedList.map((list) => (
                <option key={list.authorityId} value={list.authorityId}>
                  {list.authorityName}
                </option>
              ))}
          </Form.Select>
        )}
      </Form.Group>
    </Row>
  );
};

export default ApprovedAuthorityDetails;
