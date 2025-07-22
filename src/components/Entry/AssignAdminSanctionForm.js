import React from "react";
import { useState, useEffect } from "react";
import { Card, Alert } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { useFormik } from "formik";
import * as yup from "yup";
import AdminSanctionService from "../../services/AdminSanctionService";
import { useUserDetails } from "../UserDetailsContext";

import UserOfficeDetails from "./UserOfficeDetails";
import Form from "react-bootstrap/Form";

function AssignAdminSanction() {
  const [message, setMessage] = useState("");
  const [errormsg, setErrormsg] = useState("");
  //const [key, setKey] = useState(0);

  const { user } = useUserDetails();

  const [list, setList] = useState([]);

  // const [officeDetails,setOfficeDetails]=useState();
  const getUnAssignedWorks = async () => {
    if (user !== null) {
      AdminSanctionService.getUnAssignedWorks(
        { params: { unit: user.unitId, circle: user.circleId, division: user.divisionId, subdivision: user.subDivisionId } },
        (response) => {
          // console.log("in response data"+JSON.stringify(response.data));
          if (response.data.data.length > 0) {
            setMessage("");
            setList(response.data.data);
          } else {
            setMessage("All works are assigned");
          }
        },
        (error) => {
          setErrormsg(error.message);
        },
      );
    } else {
      setErrormsg("No User Found");
    }
  };
  useEffect(() => {
    getUnAssignedWorks();
  }, []);

  const validationSchema = yup.object({
    workId: yup.string().required("Work is required"),
    circleId: yup.string().required("Circle is required"),
    divisionId: yup.string().required("Division is required"),
    subDivisionId: yup.string().required("Sub Division is required"),
  });
  const formik = useFormik({
    initialValues: {
      workId: "",
      circleId: "",
      divisionId: "",
      subDivisionId: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      AdminSanctionService.submiAssignedWorks(
        values,
        (response) => {
          setMessage(response.data.message);
        },
        (error) => {
          setErrormsg(error.message);
        },
      );
    },
  });
  const getSelectedValues = (data) => {
    // setOfficeDetails(data);

    formik.setValues({
      ...formik.values, // Keep existing values
      circleId: data.circle,
      divisionId: data.division,
      subDivisionId: data.subdivision,
    });
  };
  return (
    <div className="d-flex justify-content-center m-3">
      <Card className="mb-3" style={{ width: "70%" }}>
        {message && (
          <Alert variant="success" className="m-3" style={{ height: "40px", textAlign: "center" }}>
            {message}{" "}
          </Alert>
        )}

        {errormsg && (
          <Alert variant="danger" style={{ height: "40px" }}>
            {errormsg}{" "}
          </Alert>
        )}

        <Card.Header className="Card-header" as="h5">
          Assign Administrative Sanction
        </Card.Header>
        <Card.Body>
          <Card.Text>
            <form onSubmit={formik.handleSubmit}>
              <Row className="d-flex flex-column align-items-center text-center ">
                <Form.Group className="mb-3 ">
                  <Form.Label>Select Work</Form.Label>
                  <Form.Select
                    id="workId"
                    name="workId"
                    value={formik.values.projSubTypeId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.workId && !!formik.errors.workId}
                    required
                  >
                    <option value="">--Select Type--</option>
                    {list &&
                      list.map((item, index) => (
                        <option key={index} value={item.workId}>
                          {item.workName}
                        </option>
                      ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{formik.errors.workId}</Form.Control.Feedback>
                </Form.Group>
                

                <UserOfficeDetails selectedValueFromChild={getSelectedValues} unitId={user.unitId}></UserOfficeDetails>
                <Button size="sm" className="m-3 w-25" variant="primary" type="submit">
                  Submit
                </Button>
              </Row>
            </form>
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}

export default AssignAdminSanction;
