import React, { useState, useEffect } from "react";
import UserService from "../../services/UserService";
import { useUserDetails } from "../UserDetailsContext";

import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

const UserOfficeDetails = ({ selectedValueFromChild }) => {
  const { user } = useUserDetails();
  const [circle, setCircle] = useState([]);

  const [selCircle, setSelCircle] = useState(0);

  const [division, setdivision] = useState([]);

  const [selDivision, setSelDivision] = useState(0);

  const [subdivision, setSubdivision] = useState([]);

  const [selSubdivision, setSelSubdivision] = useState(0);

  useEffect(() => {
    // UserService.getCirclesByUnitId({ params: { unit: user.unit}},(response)=>setCircle(response.data.data),(error)=>{console.log(error)})

    UserService.getCirclesByUnitId(
      user.unitId,
      (response) => {
        setCircle(response);
      },
      (error) => {
        console.log(error);
      },
    );
  }, []);

  const handleCircleChange = (event) => {
    setSelCircle(event.target.value);
    UserService.getDivisionsByCircleId(
      event.target.value,
      (response) => setdivision(response),
      (error) => {
        console.log(error);
      },
    );
  };

  const handleDivisionChange = (event) => {
    setSelDivision(event.target.value);
    UserService.getSubdivisionsByDivisionId(
      selCircle,
      event.target.value,
      (response) => setSubdivision(response.data.data),
      (error) => {
        console.log(error);
      },
    );
  };

  const handleSubDivisionChange = (event) => {
    setSelSubdivision(event.target.value);
    selectedValueFromChild({ circle: selCircle, division: selDivision, subdivision: event.target.value });
  };

  return (
    <div>
      <Form.Group as={Col} controlId="formGridFinYear">
        <Form.Label>Select Circle</Form.Label>
        {circle && (
          <Form.Select value={selCircle} onChange={handleCircleChange} required>
            <option value="">Select </option>
            {circle &&
              circle.map((circle) => (
                <option key={circle.circleId} value={circle.circleId}>
                  {circle.circleName}
                </option>
              ))}
          </Form.Select>
        )}
      </Form.Group>
      <Form.Group as={Col} controlId="formGridFinYear">
        <Form.Label>Select Division</Form.Label>
        {division && (
          <Form.Select value={selDivision} onChange={handleDivisionChange} required>
            <option value="">Select </option>
            {division &&
              division.map((division) => (
                <option key={division.divisionId} value={division.divisionId}>
                  {division.divisionName}
                </option>
              ))}
          </Form.Select>
        )}
      </Form.Group>

      <Form.Group as={Col} controlId="formGridFinYear">
        <Form.Label>Select Sub Division</Form.Label>
        {subdivision && (
          <Form.Select value={selSubdivision} onChange={handleSubDivisionChange} required>
            <option value="">Select </option>
            {subdivision &&
              subdivision.map((subdivision) => (
                <option key={subdivision.subDivisionId} value={subdivision.subDivisionId}>
                  {subdivision.subDivisionName}
                </option>
              ))}
          </Form.Select>
        )}
      </Form.Group>
    </div>
  );
};

export default UserOfficeDetails;
