import React from "react";
import { useState, useEffect } from "react";
import Select from "react-select";
import AdminSanctionService from "../../services/AdminSanctionService";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { useUserDetails } from "../UserDetailsContext";

export const WorkDetails = ({ finyear, selectedWorkIdFromChild, handleerrorFromChild }) => {
  const [workId, setWorkId] = useState(null);
  const [items, setitems] = useState(null);

  const [error, seterror] = useState(null);
  const { user } = useUserDetails();

  const [loading, setLoading] = useState(false);

  const handleChange = (option) => {
    setWorkId(option);
    selectedWorkIdFromChild(option);
  };

  const getSelectItems = async () => {
    setLoading(true);
    if (user) {
      AdminSanctionService.getWorks(
        {
          params: {
            unitId: user?.unitId,
            circleId: user?.circleId,
            divisionId: user?.divisionId,
            subDivisionId: user?.subDivisionId,
            financialYear: finyear ? finyear : 0,
          },
        },
        (response) => getWorkItems(response),
        (error) => {
          handleError(error);
          handleerrorFromChild(error);
        },
      );
    } else {
      handleerrorFromChild("User details not found.Please Login Again");
    }
  };
  const getWorkItems = (response) => {
    try {
      const selectOptions = response.data.data.map((items) => ({
        value: items.workId,
        label: items.workName,
      }));
      setitems(selectOptions);
      setLoading(false);
      // Toggle reload to refresh list

      if (!response || response.data.data.length === 0) {
        seterror("No Works found.");
      } else {
        seterror(null); // clear old errors
      }
    } catch (error) {
      setLoading(false);
      console.error("Error Getting Data:", error);
    }
  };
  const handleError = (error) => {
    // errorFromChild(error.response?.data?.message || 'Something went wrong');
    seterror("Error: " + error?.message || "Something went wrong");
  };
  useEffect(() => {
    getSelectItems();
  }, [finyear]);

  return (
    <>
      {" "}
      <div></div>
      <Row className="mb-3 d-flex justify-content-center align-items-center">
        {<Select isLoading={loading} value={workId} options={items} isSearchable={true} placeholder="Select WorkId" onChange={handleChange}></Select>}
        {error && <Form.Text className="text-danger">{error}</Form.Text>}
      </Row>
    </>
  );
};
