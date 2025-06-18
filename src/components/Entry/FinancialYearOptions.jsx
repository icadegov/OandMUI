import React from 'react'
import { useState} from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export const FinancialYearOptions = ({selectedYearFromChild}) => {

    const years = [];

    const [finYear, setfinYear] = useState();

    const date = new Date()
    const currentyear = date.getFullYear();

    const handleChange=(event)=>{
     
        setfinYear(event.target.value);                                                                           
        selectedYearFromChild(event.target.value)
    }
   
    for (let year = 2019; year <= currentyear; year++) {
      years.push({
        key: `${year + 1}`,
        value: `${year + 1}`,
        label: `${year}-${year + 1}`,
        startDate: new Date(year, 3, 1), // April 1 of start year
        endDate: new Date(year + 1, 2, 31) // March 31 of the following year
      });
    }
  return (
<>

{/* <Select 
        value={finYear}
        onChange={handleChange}
        options={years} // Set the financial year options
        placeholder="Select Financial Year"
        isClearable
  /> */}

  <Row className=" d-flex justify-content-center align-items-center" >
    <Col>
<Form.Select value={finYear} onChange={handleChange} style={{ width: "100%" }}>
  <option value="">Select </option>
  {years.map((year) => (
    <option key={year.value} value={year.value}>
      {year.label}
    </option>
  ))}
</Form.Select>
</Col>
</Row>

</>
  )
}
