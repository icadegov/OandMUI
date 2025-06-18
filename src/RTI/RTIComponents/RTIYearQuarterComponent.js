import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { Form, Button, Row, Col } from "react-bootstrap";

const RTIYearQuarterComponent = ({ actionUrl, onSubmit, formId, includeAllOption = false }) => {
  const [formData, setFormData] = useState({
    appnrptyear: "",
    quarter: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const { appnrptyear, quarter } = formData;
    if (appnrptyear && quarter) {
      onSubmit(appnrptyear, quarter, formId);
      setFormData({ appnrptyear: "", quarter: "" }); // Reset form after submission
    }
  };

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => currentYear - i).map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ));
  }, []);

  return (
    <Form id={formId} name={formId} action={actionUrl} onSubmit={(e) => e.preventDefault()}>
      <Row className="col-md-12 toppad">
        <Col md={2}>
          <Form.Label htmlFor="rticonGyr" className="label-control rowlebel">
            Select Year
          </Form.Label>
        </Col>
        <Col md={2}>
          <Form.Select
            id="rticonGyr"
            name="appnrptyear"
            value={formData.appnrptyear}
            onChange={handleInputChange}
            style={{ border: "1px solid black" }} // Solid black border
            aria-describedby="yearHelp"
          >
            <option value="">--select--</option>
            {yearOptions}
          </Form.Select>
        </Col>

        <Col md={2}>
          <Form.Label htmlFor="rticonGqtr" className="label-control rowlebel">
            Select Quarter
          </Form.Label>
        </Col>
        <Col md={2}>
          <Form.Select
            id="rticonGqtr"
            name="quarter"
            value={formData.quarter}
            onChange={handleInputChange}
            required
            style={{ border: "1px solid black" }} // Solid black border
            aria-describedby="quarterHelp"
          >
            <option value="">--select--</option>
            {includeAllOption && <option value="5">All</option>}
            <option value="1">Jan-Mar</option>
            <option value="2">Apr-Jun</option>
            <option value="3">Jul-Sep</option>
            <option value="4">Oct-Dec</option>
          </Form.Select>
        </Col>

        <Col md={3}>
          <Button id="viewrtireport" className="btn btn-1 btn-primary center-block" type="button" onClick={handleSubmit} disabled={!formData.appnrptyear || !formData.quarter}>
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

RTIYearQuarterComponent.propTypes = {
  actionUrl: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  includeAllOption: PropTypes.bool, // New prop
};

export default RTIYearQuarterComponent;
