import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export const FinancialYearOptions = ({ selectedYearFromChild, selectedYear }) => {
  const years = [];
  const [finYear, setfinYear] = useState('');

  const currentyear = new Date().getFullYear();

  // ✅ Initialize internal state from selectedYear prop
  useEffect(() => {
    if (selectedYear) {
      setfinYear(selectedYear);
    }
  }, [selectedYear]); // ✅ Runs when prop changes

  const handleChange = (event) => {
    const value = event.target.value;
    setfinYear(value);
    selectedYearFromChild(value);
  };

  for (let year = 2019; year <= currentyear; year++) {
    years.push({
      key: `${year + 1}`,
      value: `${year + 1}`,
      label: `${year}-${year + 1}`,
      startDate: new Date(year, 3, 1),
      endDate: new Date(year + 1, 2, 31)
    });
  }

  return (
    <Row className="d-flex justify-content-center align-items-center">
      <Col>
        <Form.Select value={finYear} onChange={handleChange} style={{ width: "100%" }}>
          <option value="">Select</option>
          {years.map((year) => (
            <option key={year.value} value={year.value}>
              {year.label}
            </option>
          ))}
        </Form.Select>
      </Col>
    </Row>
  );
};
